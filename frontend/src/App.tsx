// SPDX-License-Identifier: MIT
// SPDX-FileCopyrightText: 2010-2021 Dirk Riehle <dirk@riehle.org>
// SPDX-FileCopyrightText: 2019 Georg Schwarz <georg.schwarz@fau.de>

import React, { useEffect } from 'react'
import './App.css'
import './assets/styles/styles.scss'
import { useAppSelector } from './store/hooks'
import { selectShowLP, selectView } from './store/globalSlice'
import LandingPage from './components/landing/LandingPage'
import NavBar from './components/NavBar'
import Dashboard from './components/Dashboard'

let allData: Array<SampleCluster> = []
let allMessages: Array<SampleMessage> = []

function App() {
	const view = useAppSelector(selectView)

	/** Landing Page Logic */
	const showLP = useAppSelector(selectShowLP)
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
	const getData = () => {
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
	}

	const getMessages = () => {
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
	}

	useEffect(() => {
		getData()
		getMessages()
	}, [])

	return (
		<>
			{showLP ? (
				<LandingPage />
			) : (
				<div className="dashboard-container">
					<NavBar />
					<Dashboard
						completeData={allData}
						completeMessages={allMessages}
						view={view.selectedNav}
					/>
				</div>
			)}
		</>
	)
}

export default App
