// SPDX-License-Identifier: MIT
// SPDX-FileCopyrightText: 2023 Julian Tochman-Szewc <tochman-szewc@campus.tu-berlin.de>
// SPDX-FileCopyrightText: 2023 Shahraz Nasir <shahraz.nasir@campus.tu-berlin.de>
// SPDX-FileCopyrightText: 2023 Ziqi He <ziqi.he@fau.de>
import React from 'react'
import { useAppDispatch } from '../../store/hooks'
import { addFilter, deleteFilter } from '../../store/filterSlice'
import { triggerRequest } from '../../routes/requestTriggerSlice'

/**
 * The CustomCheckbox component provides a filter option including a checkbox and some text.
 * It allows users to select one or more options displayed within the filter accordion.
 * Although Material UI already provided form components (including checkboxes), we decided to create
 * our own component for this type of element in order to maximize flexibility and custom styling options.
 *
 * @component
 * @param id - The id associated to the option.
 * @param text - The text/description associated to the option.
 * @param topology - The topology of the elements within the filter accordion.
 * @param selected - Boolean indicating if current option is selected or not.
 * @returns a filter option (checkbox + text) with custom styling and functionality.
 */
const CustomCheckbox: React.FC<CustomCheckboxProps> = ({
	id,
	text,
	topology,
	selected,
}) => {
	const dispatch = useAppDispatch()

	/**
	 * Triggers a new request for the data and manages the current option by
	 * removing it when it is already selected or adding it to the applied filters.
	 */
	const handleClick = (): void => {
		dispatch(triggerRequest())
		if (selected) dispatch(deleteFilter({ filterName: topology, id: id }))
		else dispatch(addFilter({ filterName: topology, id: id }))
	}

	return (
		<div className="flex custom-checkbox-wrapper">
			<span
				onClick={handleClick}
				className={selected ? 'custom-checkbox active' : 'custom-checkbox'}
			></span>
			<p>{text}</p>
		</div>
	)
}

export default CustomCheckbox
