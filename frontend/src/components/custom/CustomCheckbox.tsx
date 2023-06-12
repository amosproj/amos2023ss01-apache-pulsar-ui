// SPDX-License-Identifier: MIT
// SPDX-FileCopyrightText: 2010-2021 Dirk Riehle <dirk@riehle.org
// SPDX-FileCopyrightText: 2019 Georg Schwarz <georg. schwarz@fau.de>

import React from 'react'
import { useAppDispatch } from '../../store/hooks'
import { addFilter, deleteFilter } from '../../store/filterSlice'

const CustomCheckbox: React.FC<CustomCheckboxProps> = ({
	id,
	text,
	typology,
	selected,
}) => {
	const dispatch = useAppDispatch()
	const handleClick = (): void => {
		if (selected) dispatch(deleteFilter({ filterName: typology, id: id }))
		else dispatch(addFilter({ filterName: typology, id: id }))
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
