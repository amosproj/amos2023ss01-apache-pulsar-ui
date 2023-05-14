import React from 'react'

const CustomCheckbox: React.FC<CustomCheckboxProps> = ({
	text,
	typology,
	changeFunc,
	selected,
}) => {
	return (
		<div className="flex custom-checkbox-wrapper">
			<span
				onClick={() => changeFunc(text, typology)}
				className={selected ? 'custom-checkbox active' : 'custom-checkbox'}
			></span>
			<p>{text}</p>
		</div>
	)
}

export default CustomCheckbox
