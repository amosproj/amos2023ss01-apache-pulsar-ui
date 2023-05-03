import React, { useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import { error } from 'console'

interface CustomSelectProps {
	data: Array<any>
	onChange: any
	value: string
	label: string
	error: boolean
}

const CustomSelect: React.FC<CustomSelectProps> = ({
	data,
	onChange,
	value,
	label,
	error,
}) => {
	return (
		<Box sx={{ minWidth: 120 }}>
			<FormControl fullWidth>
				<InputLabel id="demo-simple-select-label">{label}</InputLabel>
				<Select
					labelId="demo-simple-select-label"
					id="demo-simple-select"
					value={value}
					label="Topic"
					onChange={onChange}
					error={error}
				>
					{data &&
						data.length > 0 &&
						data.map((item) => (
							<MenuItem key={item?.id} value={item?.id}>
								{item?.name}
							</MenuItem>
						))}
				</Select>
			</FormControl>
		</Box>
	)
}

export default CustomSelect
