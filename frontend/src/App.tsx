// SPDX-License-Identifier: MIT
// SPDX-FileCopyrightText: 2010-2021 Dirk Riehle <dirk@riehle.org>
// SPDX-FileCopyrightText: 2019 Georg Schwarz <georg.schwarz@fau.de>

import React from 'react'
import './App.css'
import './assets/styles/styles.scss'
import { useAppSelector } from './store/hooks'
import { selectView } from './store/globalSlice'
import NavBar from './components/NavBar'
import Dashboard from './components/Dashboard'
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import ClusterGroup from './routes/cluster'
import NamespaceGroup from './routes/namespace'
import TenantGroup from './routes/tenant'
import TopicGroup from './routes/topic'

/**
 * The main application component.
 * It sets up the main routes for the application and also renders the main Dashboard and NavBar components.
 *
 * @component
 * @returns The main application component rendered to the DOM.
 */
function App() {
	return (
		<>
			<Router>
				<div className="dashboard-container">
					<NavBar />
					<Dashboard>
						<Routes>
							<Route path="/" element={<ClusterGroup />}></Route>
							<Route path="/cluster" element={<ClusterGroup />}></Route>
							<Route path="/tenant" element={<TenantGroup />}></Route>
							<Route path="/namespace" element={<NamespaceGroup />}></Route>
							<Route path="/topic" element={<TopicGroup />}></Route>
						</Routes>
					</Dashboard>
				</div>
			</Router>
		</>
	)
}

export default App
