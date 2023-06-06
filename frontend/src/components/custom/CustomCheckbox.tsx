// SPDX-License-Identifier: MIT
// SPDX-FileCopyrightText: 2010-2021 Dirk Riehle <dirk@riehle.org
// SPDX-FileCopyrightText: 2019 Georg Schwarz <georg. schwarz@fau.de>

import React from 'react'

const CustomCheckbox: React.FC<CustomCheckboxProps> = ({
	id,
	text,
	typology,
	changeFunc,
	selected,
}) => {
	return (
		<div className="flex custom-checkbox-wrapper">
			<span
				onClick={() => changeFunc(id, typology)}
				className={selected ? 'custom-checkbox active' : 'custom-checkbox'}
			></span>
			<p>{text}</p>
		</div>
	)
}

export default CustomCheckbox
