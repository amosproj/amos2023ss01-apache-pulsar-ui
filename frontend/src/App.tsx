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

const allData: Array<SampleCluster> = []
const allMessages: Array<SampleMessage> = []

function App() {
	const view = useAppSelector(selectView)
	/** Landing Page Logic */
	// const showLP = useAppSelector(selectShowLP)
	/** End of Landing Page Logic */

	/*const allTenants = allData
		.map((item) => item.tenants)
		.filter((el) => el.length > 0)
		.flat()

	const allNamespaces = allTenants
		.map((tenant) => tenant.namespaces)
		.filter((el) => el.length > 0)
		.flat()

	const allTopics = allNamespaces
		.map((namespace) => namespace.topics)
		.filter((el) => el.length > 0)
		.flat()*/

	/*const allMessages = allData
		.flatMap((item) => item.namespaces)
		.flatMap((namespace) => namespace.topics)
		.map((topic) => topic.messages)
		.filter((el) => el.length > 0)
		.flat()*/

	/*let filteredData:
		| Array<SampleCluster>
		| Array<SampleNamespace>
		| Array<SampleTopic> = allData

	if (view.selectedNav === 'namespace') {
		filteredData = allNamespaces
	} else if (view.selectedNav === 'topic') {
		filteredData = allTopics
	}*/

	/*const selectNewElement = (
		item: SampleCluster | SampleNamespace | SampleTopic
	) => {
		const selEl = getNewElementTag(item.tag, item.id)
		console.log(selEl)
		//dispatch(setNav(selEl[0]))
	}*/

	//can later on be replaced by the fetchDataThunk
	/*const getData = () => {
		fetch('dummy/dummyClusters.json', {
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
			},
		})
			.then(function (response) {
				return response.json()
			})
			.then(function (json) {
				allData = json
			})
	}*/

	/*const getMessages = () => {
		fetch('dummy/dummyMessages.json', {
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
			},
		})
			.then(function (response) {
				return response.json()
			})
			.then(function (json) {
				allMessages = json
			})
	}*/

	return (
		<>
			<Router>
				<div className="dashboard-container">
					<NavBar />
					<Dashboard completeMessages={allMessages} view={view.selectedNav}>
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
