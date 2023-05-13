// SPDX-License-Identifier: MIT
// SPDX-FileCopyrightText: 2010-2021 Dirk Riehle <dirk@riehle.org>
// SPDX-FileCopyrightText: 2019 Georg Schwarz <georg.schwarz@fau.de>

import React from 'react'
import '../../assets/styles/landing.scss'
import team_logo from '../../assets/images/team-logo-light.png'
import RbiLogo from './RbiLogo'

interface LandingPageProps {
	children: React.ReactNode
}

const LandingBackground: React.FC<LandingPageProps> = ({ children }) => {
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
				<div>{children}</div>
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

export default LandingBackground
