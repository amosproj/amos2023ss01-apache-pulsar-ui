import React from 'react'
import Box from '@mui/material/Box'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select, { SelectChangeEvent } from '@mui/material/Select'

interface CustomSelectProps<T> {
	data: Array<MessageList>
	onChange: (event: SelectChangeEvent<T>) => void
	value: T
	label: string
	error: boolean
}

const CustomSelect = <T extends string>({
	data,
	onChange,
	value,
	label,
	error,
}: CustomSelectProps<T>) => {
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
