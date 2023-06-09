// SPDX-License-Identifier: MIT
// SPDX-FileCopyrightText: 2010-2021 Dirk Riehle <dirk@riehle.org
// SPDX-FileCopyrightText: 2019 Georg Schwarz <georg. schwarz@fau.de>

import React from 'react'
import IconButton from '@mui/material/IconButton'
import SearchIcon from '@mui/icons-material/Search'
import TextField from '@mui/material/TextField'

const CustomSearchbar: React.FC<CustomSearchProps> = ({
	setSearchQuery,
	placeholder,
}) => {
	return (
		<form>
			<TextField
				id="search-bar"
				className="primary-textfield"
				onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
					setSearchQuery(e?.target?.value)
				}}
				InputProps={{
					endAdornment: (
						<IconButton
							className="icon-wrapper"
							type="submit"
							aria-label="search"
						>
							<SearchIcon style={{ fill: '#A4A4A4' }} />
						</IconButton>
					),
				}}
				variant="outlined"
				placeholder={placeholder}
				size="small"
			/>
		</form>
	)
}

export default CustomSearchbar
