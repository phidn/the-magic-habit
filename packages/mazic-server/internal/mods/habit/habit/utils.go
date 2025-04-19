package habit

import (
	"github.com/golangthang/mazic-habit/pkg/schema"
	"github.com/golangthang/mazic-habit/pkg/utils"
)

func processCheckInList(habits []*Habit, checkInList []*schema.CheckIn) error {
	allValues := utils.ExtractFieldToSlice(checkInList, "Value")
	allAvgValue := utils.Avg(allValues)

	checkInMap := map[string][]*schema.CheckIn{}
	for _, habit := range habits {
		if _, ok := checkInMap[habit.Id]; !ok {
			checkInMap[habit.Id] = []*schema.CheckIn{}
		}
	}

	for _, checkIn := range checkInList {
		checkInMap[checkIn.HabitId] = append(checkInMap[checkIn.HabitId], checkIn)
	}

	for _, habit := range habits {
		if items, ok := checkInMap[habit.Id]; ok {
			if habit.CheckInType == utils.MULTI_CRITERIA {
				// Process multi-criteria check-ins differently
				groupedItems := groupCheckInsByDate(items)
				habit.CheckInItems = groupedItems

				// Calculate metrics based on grouped items
				values := utils.ExtractFieldToSlice(groupedItems, "Value")
				maxValue := utils.Max(values)
				avgValue := utils.Avg(values)

				processCheckInItem(groupedItems, allAvgValue, maxValue, avgValue)
				habit.Meta.Avg = avgValue
				habit.Meta.Max = maxValue
			} else {
				// Process regular check-ins
				values := utils.ExtractFieldToSlice(items, "Value")
				maxValue := utils.Max(values)
				avgValue := utils.Avg(values)

				processCheckInItem(items, allAvgValue, maxValue, avgValue)
				habit.CheckInItems = items
				habit.Meta.Avg = avgValue
				habit.Meta.Max = maxValue
			}
		}
	}

	return nil
}

// Group check-ins by date for multi-criteria habits
func groupCheckInsByDate(checkIns []*schema.CheckIn) []*schema.CheckIn {
	// Map to store grouped check-ins by date string
	dateMap := make(map[string]*schema.CheckIn)

	for _, checkIn := range checkIns {
		dateStr := checkIn.Date.String()

		if existing, ok := dateMap[dateStr]; ok {
			// Update existing entry for this date
			existing.Count += checkIn.Value
			existing.Value += checkIn.Value

			// Set level to max level among all entries for this date
			if checkIn.Level > existing.Level {
				existing.Level = checkIn.Level
			}

			// Add criterion value
			existing.CriterionValues = append(existing.CriterionValues, &schema.CriterionValue{
				CriterionId: checkIn.CriterionId,
				Value:       checkIn.Value,
			})
		} else {
			// Create new grouped entry
			groupedCheckIn := &schema.CheckIn{
				BaseModel: checkIn.BaseModel,
				Date:      checkIn.Date,
				Journal:   checkIn.Journal,
				HabitId:   checkIn.HabitId,
				Value:     checkIn.Value,
				IsDone:    checkIn.IsDone,
				Level:     checkIn.Level,
				Count:     checkIn.Value,
				CriterionValues: []*schema.CriterionValue{
					{
						CriterionId: checkIn.CriterionId,
						Value:       checkIn.Value,
					},
				},
			}
			dateMap[dateStr] = groupedCheckIn
		}
	}

	// Convert map to slice
	result := make([]*schema.CheckIn, 0, len(dateMap))
	for _, v := range dateMap {
		result = append(result, v)
	}

	return result
}

func processCheckInItem(checkItems []*schema.CheckIn, totalAvg, maxValue, avgValue float64) error {
	for _, checkIn := range checkItems {
		if checkIn.Value > 0 {
			if checkIn.Value > 0 && checkIn.Value < maxValue/4 {
				checkIn.Level = 1
			}
			if checkIn.Value >= maxValue/4 && checkIn.Value < maxValue/2 {
				checkIn.Level = 2
			}
			if checkIn.Value >= maxValue/2 && checkIn.Value < maxValue*3/4 {
				checkIn.Level = 3
			}
			if checkIn.Value >= maxValue*3/4 {
				checkIn.Level = 4
			}
			checkIn.Count = checkIn.Value
			numberFactor := totalAvg / avgValue
			checkIn.BarValue = checkIn.Value * numberFactor
		} else {
			if checkIn.IsDone != nil && *checkIn.IsDone {
				checkIn.Level = 4
				checkIn.Count = 1
				checkIn.Value = totalAvg
				checkIn.BarValue = totalAvg
			} else {
				checkIn.Level = 0
				checkIn.Count = 0
			}
		}
	}

	return nil
}
