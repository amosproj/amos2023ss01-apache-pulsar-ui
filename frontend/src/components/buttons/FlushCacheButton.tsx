// SPDX-License-Identifier: MIT
// SPDX-FileCopyrightText: 2023 Julian Tochman-Szewc <tochman-szewc@campus.tu-berlin.de>
// SPDX-FileCopyrightText: 2023 Shahraz Nasir <shahraz.nasir@campus.tu-berlin.de>
// SPDX-FileCopyrightText: 2023 Ziqi He <ziqi.he@fau.de>
import * as React from 'react'
import { Box, Button, Snackbar } from '@mui/material'
import MuiAlert, { AlertProps } from '@mui/material/Alert'
import config from '../../config'
import axios from 'axios'

/**
 * The Alert communicates to the user if flushing was executed correctly or not.
 */
const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
	props,
	ref
) {
	return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
})

/**
 * On click event, the FlushCacheButton flushes the cache and retrieves the latest data from Pulsar.
 */
export default function FlushCacheButton() {
	const [open, setOpen] = React.useState(false)
	const [error, setError] = React.useState(false)

	/**
	 * Calls the API endpoint to flush the backend-cache.
	 */
	const flushCache = () => {
		const url = config.backendUrl + '/api/cache/flush'
		axios
			.get(url)
			.then((response) => {
				if (response.status !== 200) {
					setError(true)
				}
				setError(false)
			})
			.catch((error) => {
				console.log(error.message)
				setError(true)
			})
	}

	// Sends the request and displays the alert.
	const handleClick = () => {
		flushCache()
		setOpen(true)
	}

	// Closes alert.
	const handleClose = (
		event?: React.SyntheticEvent | Event,
		reason?: string
	) => {
		if (reason === 'clickaway') {
			return
		}
		setOpen(false)
	}

	return (
		<Box className="flush-cache-container">
			<Button
				variant="contained"
				onClick={handleClick}
				className="outlined-button"
				title="Flush the backend-cache to get live-data from apache pulsar"
			>
				Flush Cache
			</Button>
			<Snackbar
				open={open}
				autoHideDuration={3000}
				onClose={handleClose}
				anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
			>
				{error ? (
					<Alert severity="error" onClose={handleClose} sx={{ width: '100%' }}>
						Error when flush the cache
					</Alert>
				) : (
					<Alert
						onClose={handleClose}
						severity="success"
						sx={{ width: '100%' }}
					>
						Cache flushed!
					</Alert>
				)}
			</Snackbar>
		</Box>
	)
}
