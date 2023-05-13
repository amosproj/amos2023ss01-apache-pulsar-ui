// SPDX-License-Identifier: MIT
// SPDX-FileCopyrightText: 2010-2021 Dirk Riehle <dirk@riehle.org>
// SPDX-FileCopyrightText: 2019 Georg Schwarz <georg.schwarz@fau.de>

import React from 'react'
import { Button, TextField } from '@mui/material'
import '../../assets/styles/landing.scss'
import { useAppDispatch } from '../../store/hooks'
import { setEndpoint } from './endpointSlice'

const EndpointForm = () => {
	// Endpoint string of pulsar
	let endpoint = ''
	// const [endpointString, setEndpointString] = React.useState('')
	// Whether the endpoint which user type in is valid
	const [endpointError, setEndpointError] = React.useState(false)
	// const { isError } = useAppSelector((store) => store.endpoint)

	const dispatch = useAppDispatch()

	/**
	 * Validate the endpoint that users type in
	 * @param endpoint
	 * @returns whether there is error in the endpoint
	 */
	const validateEndpoint = (endpoint: string): boolean => {
		// so far it's hardcoded, need to add the validation logic later on.
		return endpoint ? true : false
	}

	const handleChange = (e: React.FormEvent<EventTarget>): void => {
		const target = e.target as HTMLInputElement
		endpoint = target.value
	}

	const handleSubmit = (e: React.FormEvent<EventTarget>): void => {
		e.preventDefault()

		// If the endpoint is not valid
		if (!validateEndpoint(endpoint)) {
			setEndpointError(true)
			return
		}

		// If the endpoint is valid
		console.log(endpoint)
		dispatch(setEndpoint(endpoint))
	}

	return (
		<div className="endpoint-form-container">
			<form onSubmit={handleSubmit}>
				<h3>Pulsar Endpoint</h3>
				<TextField
					id="endpoint"
					label="Enter Endpoint"
					onChange={handleChange}
					error={endpointError}
				/>
				<Button type="submit" variant="contained" className="connect-button">
					connect
				</Button>
			</form>
		</div>
	)
}

export default EndpointForm
