// SPDX-License-Identifier: MIT
// SPDX-FileCopyrightText: 2010-2021 Dirk Riehle <dirk@riehle.org
// SPDX-FileCopyrightText: 2019 Georg Schwarz <georg. schwarz@fau.de>

import React from 'react'
import { useAppDispatch } from '../../store/hooks'
import { addFilterWithRadio, deleteFilter } from '../../store/filterSlice'
import { triggerRequest } from '../../routes/requestTriggerSlice'

const CustomRadio: React.FC<CustomCheckboxProps> = ({
	id,
	text,
	topology,
	selected,
}) => {
	const dispatch = useAppDispatch()
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
