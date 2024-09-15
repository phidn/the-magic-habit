package pretty_logger

import (
	"fmt"
	"strings"
)

// Function to find the maximum length of strings in a column
func findMaxLengths(data [][]string) []int {
	colWidths := make([]int, len(data[0]))
	for _, row := range data {
		for i, col := range row {
			if len(col) > colWidths[i] {
				colWidths[i] = len(col)
			}
		}
	}
	return colWidths
}

// Function to print a separator line
func printSeparator(colWidths []int) {
	for _, width := range colWidths {
		fmt.Print("+", strings.Repeat("-", width+2))
	}
	fmt.Println("+")
}

// Function to print a row of data
func printRow(row []string, colWidths []int) {
	for i, col := range row {
		fmt.Printf("| %-*s ", colWidths[i], col)
	}
	fmt.Println("|")
}

// Function to print the table with an option to show or hide the header
func PrintTable(data [][]string, isShowHeader bool) {
	if len(data) == 0 {
		return
	}
	colWidths := findMaxLengths(data)
	printSeparator(colWidths)
	if isShowHeader {
		printRow(data[0], colWidths)
		printSeparator(colWidths)
		for _, row := range data[1:] {
			printRow(row, colWidths)
		}
	} else {
		for _, row := range data {
			printRow(row, colWidths)
		}
	}
	printSeparator(colWidths)
}
