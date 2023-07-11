// SPDX-License-Identifier: MIT
// SPDX-FileCopyrightText: 2010-2021 Dirk Riehle <dirk@riehle.org
// SPDX-FileCopyrightText: 2019 Georg Schwarz <georg. schwarz@fau.de>

/**
 * Helper function to add comma separator if not the last element.
 * @param index the index of current element in array.
 * @param length the length of array.
 * @returns comma or null.
 */
export const addCommaSeparator = (index: number, length: number): string => {
	return index !== length - 1 ? ', ' : ''
}

/**
 * Converts a timestamp to a human-readable date and time format.
 * @param {number} timestamp - The timestamp to convert.
 * @returns {string} The formatted date and time string.
 */
export const convertTimestampToDateTime = (timestamp: number): string => {
	// If the timestamp is already in milliseconds, no conversion is needed
	const milliseconds = timestamp
	const dateObj = new Date(milliseconds)
	// ISO 8601 format: "YYYY-MM-DDTHH:mm:ss.sssZ"
	const formattedTime = dateObj.toISOString()
	return formattedTime
}
