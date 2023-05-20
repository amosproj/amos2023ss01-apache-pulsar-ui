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
