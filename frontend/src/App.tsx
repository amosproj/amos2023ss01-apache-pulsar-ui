// SPDX-License-Identifier: MIT
// SPDX-FileCopyrightText: 2010-2021 Dirk Riehle <dirk@riehle.org>
// SPDX-FileCopyrightText: 2019 Georg Schwarz <georg.schwarz@fau.de>
import React from 'react'
import './App.css'
import './assets/styles/styles.scss'
import logo from './assets/images/team-logo-light.png'
import Form from './components/Form'

function App() {
	return (
		<div className="bg-blue w-full h-full">
			<div className="w-full h-full">
				<nav className="px-12 py-5">
					<img className="home-logo" src={logo} alt="logo" />
				</nav>
				<Form></Form>
			</div>
		</div>
	)
}

export default App
