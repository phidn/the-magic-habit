package infrastructure

import (
	"fmt"
	"log"
	"net/http"
	"net/url"
	"strconv"
	"strings"
	"sync"
	"time"

	"github.com/pocketbase/dbx"
	"github.com/pocketbase/pocketbase"
	"github.com/robfig/cron/v3"
)

// CronManager handles all user-specific scheduled tasks
type CronManager struct {
	App           *pocketbase.PocketBase
	CronScheduler *cron.Cron
	JobEntries    map[string]cron.EntryID // Map userID -> JobID
	mu            sync.Mutex
}

// NewCronManager initializes a new cron job manager
// NOTE: We specify cron.WithLocation(time.UTC) to ensure that the cron
// specs are interpreted in UTC, matching our conversion logic.
func NewCronManager(app *pocketbase.PocketBase) *CronManager {
	return &CronManager{
		App:           app,
		CronScheduler: cron.New(cron.WithLocation(time.UTC)),
		JobEntries:    make(map[string]cron.EntryID),
	}
}

// Start initializes and runs the cron jobs
func (cm *CronManager) Start() {
	cm.LoadUserSchedules()
	cm.CronScheduler.Start()
	log.Println("Cron jobs started...")
}

// LoadUserSchedules fetches user settings and schedules jobs
func (cm *CronManager) LoadUserSchedules() {
	records, err := cm.App.Dao().FindRecordsByExpr("sys_user_setting", nil)
	if err != nil {
		log.Println("Error fetching user schedules:", err)
		return
	}

	for _, record := range records {
		userID := record.GetString("user_id")
		telegramTime := record.GetString("telegram_time")
		timezone := record.GetString("timezone")

		if telegramTime != "" {
			cm.ScheduleUserTask(userID, telegramTime, timezone)
		}
	}
}

// Schedule a cron job for a user
func (cm *CronManager) ScheduleUserTask(userID string, timeStr string, timezone string) {
	cm.mu.Lock()
	defer cm.mu.Unlock()

	// Remove existing job if it exists
	if entryID, exists := cm.JobEntries[userID]; exists {
		cm.CronScheduler.Remove(entryID)
	}

	// Convert "HH:MM" format into a cron-compatible format, in UTC
	cronSpec, err := convertTimeToCronFormat(timeStr, timezone)
	if err != nil {
		log.Printf("Error converting time for user %s: %v\n", userID, err)
		return
	}

	// Schedule a new job
	entryID, err := cm.CronScheduler.AddFunc(cronSpec, func() {
		cm.SendNotification(userID)
	})
	if err != nil {
		log.Printf("Error scheduling job for user %s: %v\n", userID, err)
		return
	}

	// Store the job ID
	cm.JobEntries[userID] = entryID
	log.Printf("Scheduled job for user %s at %s\n", userID, timeStr)
}

// convertTimeToCronFormat takes a local time (HH:MM) and timezone,
// converts it to UTC, and returns a cron spec ("M H * * *") for UTC.
func convertTimeToCronFormat(timeStr string, timezone string) (string, error) {
	// Split "HH:MM"
	parts := strings.Split(timeStr, ":")
	if len(parts) != 2 {
		return "", fmt.Errorf("invalid time format")
	}

	hour := parts[0]
	minute := parts[1]

	hourInt, err := strconv.Atoi(hour)
	if err != nil {
		return "", fmt.Errorf("invalid hour format: %s", hour)
	}

	minuteInt, err := strconv.Atoi(minute)
	if err != nil {
		return "", fmt.Errorf("invalid minute format: %s", minute)
	}

	// Load user's timezone
	loc, err := time.LoadLocation(timezone)
	if err != nil {
		log.Printf("Invalid timezone '%s', using UTC instead", timezone)
		loc = time.UTC
	}

	// Get current date in user's timezone
	now := time.Now().In(loc)

	// Create time in user timezone
	userTime := time.Date(now.Year(), now.Month(), now.Day(), hourInt, minuteInt, 0, 0, loc)

	// Convert to UTC
	utcTime := userTime.UTC()

	// Extract hours and minutes in UTC
	utcHour, utcMinute, _ := utcTime.Clock()

	// Return cron spec in UTC
	cronSpec := fmt.Sprintf("%d %d * * *", utcMinute, utcHour)
	log.Printf("Converted user time %s [%s] -> server cron %s\n", timeStr, timezone, cronSpec)
	return cronSpec, nil
}

// SendNotification simulates sending a Telegram message
func (cm *CronManager) SendNotification(userID string) {
	// Get today's date in YYYY-MM-DD format
	today := time.Now().Format("2006-01-02")

	// Query to check if the user has any check-in records today
	checkIns, err := cm.App.Dao().FindRecordsByExpr("mz_check_in",
		dbx.NewExp("habit_id IN (SELECT id FROM mz_habits WHERE user_id = {:user_id}) AND date = {:date}",
			dbx.Params{"user_id": userID, "date": today}),
	)

	if err != nil {
		log.Printf("Error checking user %s check-ins: %v\n", userID, err)
		return
	}

	// If no check-in records exist, send a notification
	if len(checkIns) == 0 {
		log.Printf("User %s has no check-ins today. Sending notification...", userID)

		// Fetch user settings (Telegram info)
		userSettings, err := cm.App.Dao().FindFirstRecordByData("sys_user_setting", "user_id", userID)
		if err != nil {
			log.Printf("Error fetching user settings for %s: %v\n", userID, err)
			return
		}

		// Extract Telegram details
		telegramChatID := userSettings.GetString("telegram_chat_id")
		telegramToken := userSettings.GetString("telegram_bot_token")

		// Send Telegram message if credentials exist
		if telegramChatID != "" && telegramToken != "" {
			sendTelegramMessage(telegramToken, telegramChatID, "Hey! You haven't checked in today. Don't forget your habits!")
		} else {
			log.Printf("Missing Telegram details for user %s. Skipping notification.", userID)
		}
	} else {
		log.Printf("User %s has already checked in today. No notification needed.", userID)
	}
}

func sendTelegramMessage(botToken string, chatID string, message string) {
	apiURL := fmt.Sprintf("https://api.telegram.org/bot%s/sendMessage", botToken)

	// Prepare request data
	data := url.Values{}
	data.Set("chat_id", chatID)
	data.Set("text", message)
	data.Set("parse_mode", "Markdown")

	// Send HTTP request
	resp, err := http.PostForm(apiURL, data)
	if err != nil {
		log.Printf("Error sending Telegram message: %v", err)
		return
	}
	defer resp.Body.Close()

	log.Printf("Telegram notification sent to chat ID %s", chatID)
}
