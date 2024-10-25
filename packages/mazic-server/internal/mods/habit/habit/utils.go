package habit

import (
	"github.com/golangthang/mazic-habit/internal/mods/habit/check_in"
	"github.com/golangthang/mazic-habit/pkg/utils"
)

func processCheckInList(habits []*Habit, checkInList []*check_in.CheckIn) error {
	allValues := utils.ExtractFieldToSlice(checkInList, "Value")
	allAvgValue := utils.Avg(allValues)

	checkInMap := map[string][]*check_in.CheckIn{}
	for _, habit := range habits {
		if _, ok := checkInMap[habit.Id]; !ok {
			checkInMap[habit.Id] = []*check_in.CheckIn{}
		}
	}

	for _, checkIn := range checkInList {
		checkInMap[checkIn.HabitId] = append(checkInMap[checkIn.HabitId], checkIn)
	}

	for _, habit := range habits {
		if items, ok := checkInMap[habit.Id]; ok {
			values := utils.ExtractFieldToSlice(items, "Value")
			maxValue := utils.Max(values)
			avgValue := utils.Avg(values)

			processCheckInItem(items, allAvgValue, maxValue, avgValue)
			habit.CheckInItems = items
			habit.Meta.Avg = avgValue
			habit.Meta.Max = maxValue
		}
	}

	return nil
}

func processCheckInItem(checkItems []*check_in.CheckIn, totalAvg, maxValue, avgValue float64) error {
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
			if *checkIn.IsDone {
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
