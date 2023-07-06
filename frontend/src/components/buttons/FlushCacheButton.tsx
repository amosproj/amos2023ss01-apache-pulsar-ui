import * as React from 'react'
import { Box, Button, Snackbar } from '@mui/material'
import MuiAlert, { AlertProps } from '@mui/material/Alert'
import config from '../../config'
import axios from 'axios'

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
	props,
	ref
) {
	return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
})

export default function FlushCacheButton() {
	const [open, setOpen] = React.useState(false)
	const [error, setError] = React.useState(false)

	/**
	 * Call the backend api endpoint to flush the backend-cache
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

	const handleClick = () => {
		flushCache()
		setOpen(true)
	}

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
		<Box sx={{ m: 1, position: 'absolute' }} className="flush-cache-container">
			<Button
				variant="contained"
				onClick={handleClick}
				className="flush-cache-button"
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
