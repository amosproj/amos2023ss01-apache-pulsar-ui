// SPDX-License-Identifier: MIT
// SPDX-FileCopyrightText: 2023 Julian Tochman-Szewc <tochman-szewc@campus.tu-berlin.de>
// SPDX-FileCopyrightText: 2023 Shahraz Nasir <shahraz.nasir@campus.tu-berlin.de>
// SPDX-FileCopyrightText: 2023 Ziqi He <ziqi.he@fau.de>
/**
 * Adds a comma separator if not the last element.
 * @param {number} index - The index of current element in array.
 * @param {number} length - The length of array.
 * @returns {string} comma or null.
 */
export const addCommaSeparator = (index: number, length: number): string => {
	return index !== length - 1 ? ', ' : ''
}

/**
 * Converts a timestamp to a human-readable date and time format.
 * @param {number} timestamp - The timestamp to convert.
 * @returns {string} the formatted date and time string.
 */
export const convertTimestampToDateTime = (timestamp: number): string => {
	// If the timestamp is already in milliseconds, no conversion is needed
	const milliseconds = timestamp
	const dateObj = new Date(milliseconds)
	// ISO 8601 format: "YYYY-MM-DDTHH:mm:ss.sssZ"
	const formattedTime = dateObj.toISOString()
	return formattedTime
}

/**
 * Filters an array of strings based on the provided input.
 * @param {string} searchQuery - The input.
 * @param {string[]} completeArray - The array to be filtered.
 * @returns {string[]} the filtered array of strings that match or contain the provided input.
 */
export const filteredBySearchQuery = (
	searchQuery: string,
	completeArray: string[]
) => {
	let filteredArr = []
	filteredArr = completeArray.filter((item: string) => {
		return item.includes(searchQuery)
	})
	return filteredArr
}
