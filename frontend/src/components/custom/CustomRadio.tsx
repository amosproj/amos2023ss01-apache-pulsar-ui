// SPDX-License-Identifier: MIT
// SPDX-FileCopyrightText: 2023 Julian Tochman-Szewc <tochman-szewc@campus.tu-berlin.de>
// SPDX-FileCopyrightText: 2023 Shahraz Nasir <shahraz.nasir@campus.tu-berlin.de>
// SPDX-FileCopyrightText: 2023 Ziqi He <ziqi.he@fau.de>
import React from 'react'
import { useAppDispatch } from '../../store/hooks'
import { addFilterWithRadio, deleteFilter } from '../../store/filterSlice'
import { triggerRequest } from '../../routes/requestTriggerSlice'

/**
 * The CustomRadio component provides a filter option including a radio button and some text.
 * It allows users to select only one of the options displayed within the filter accordion.
 * Although Material UI already provided form components (including radio buttons), we decided to create
 * our own component for this type of element in order to maximize flexibility and custom styling options.
 *
 * @component
 * @param id - The id associated to the option.
 * @param text - The text/description associated to the option.
 * @param topology - The topology of the elements within the filter accordion.
 * @param selected - Boolean indicating if current option is selected or not.
 * @returns a filter option (radio button + text) with custom styling and functionality.
 */
const CustomRadio: React.FC<CustomCheckboxProps> = ({
	id,
	text,
	topology,
	selected,
}) => {
	const dispatch = useAppDispatch()

	/**
	 * Triggers a new request for the data and manages the current option by
	 * removing it when it is already selected or adding it to the applied filters.
	 * In the latter case, all other selected options from the same filter accordion
	 * are discarded.
	 */
	const handleClick = (): void => {
		dispatch(triggerRequest())
		if (selected) dispatch(deleteFilter({ filterName: topology, id: id }))
		else dispatch(addFilterWithRadio({ filterName: topology, id: id }))
	}

	return (
		<div className="flex custom-radio-wrapper">
			<span
				onClick={handleClick}
				className={
					selected
						? 'custom-checkbox custom-radio active'
						: 'custom-checkbox custom-radio'
				}
			></span>
			<p>{text}</p>
		</div>
	)
}

export default CustomRadio
