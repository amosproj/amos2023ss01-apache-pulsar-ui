// SPDX-License-Identifier: MIT
// SPDX-FileCopyrightText: 2010-2021 Dirk Riehle <dirk@riehle.org>
// SPDX-FileCopyrightText: 2019 Georg Schwarz <georg.schwarz@fau.de>

import React from 'react'
import LandingBackground from './LandingBackground'
import EndpointForm from './EndpointForm'

const LandingPage = () => {
	return (
		<LandingBackground>
			<EndpointForm />
		</LandingBackground>
	)
}

export default LandingPage
