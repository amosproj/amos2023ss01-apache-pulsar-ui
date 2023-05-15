// SPDX-License-Identifier: MIT
// SPDX-FileCopyrightText: 2010-2021 Dirk Riehle <dirk@riehle.org>
// SPDX-FileCopyrightText: 2019 Georg Schwarz <georg.schwarz@fau.de>

import React, { useEffect } from 'react'
import { TextField, Button } from '@mui/material'
import '../../assets/styles/landing.scss'
import team_logo from '../../assets/images/team-logo-light.png'
import RbiLogo from './RbiLogo'
import { useAppDispatch } from '../../store/hooks'
import { setEndpoint } from '../../store/globalSlice'

interface landingPageProps {
	setIsLanding: (isLanding: boolean) => void
}

const LandingPage: React.FC<landingPageProps> = ({ setIsLanding }) => {
	// Endpoint string of pulsar
	let endpoint = ''

	useEffect(() => {
		setIsLanding(true)
	}, [])

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
			setIsLanding(true)
			return
		}

		// If the endpoint is valid
		setIsLanding(false)
		dispatch(setEndpoint(endpoint))
	}

	return (
		<div className="landing-container">
			<header>
				<div className="header-container">
					<div className="logo-container">
						<img src={team_logo} alt="apache-pulsar-log" />
					</div>
					<div className="semi-circle"></div>
				</div>
			</header>
			<main>
				<div className="endpoint-form-container">
					<form onSubmit={handleSubmit}>
						<h3>Pulsar Endpoint</h3>
						<TextField
							id="endpoint"
							label="Enter Endpoint"
							onChange={handleChange}
						/>
						<Button
							type="submit"
							variant="contained"
							className="connect-button"
						>
							connect
						</Button>
					</form>
				</div>
			</main>
			<footer>
				<div className="footer-container">
					<p>
						Apache Pulsar UI is an open-source project developed in
						collaboration with:
					</p>
					<RbiLogo />
					<div className="semi-circle"></div>
				</div>
			</footer>
		</div>
	)
}

export default LandingPage
