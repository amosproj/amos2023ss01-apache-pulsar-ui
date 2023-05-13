// SPDX-License-Identifier: MIT
// SPDX-FileCopyrightText: 2010-2021 Dirk Riehle <dirk@riehle.org>
// SPDX-FileCopyrightText: 2019 Georg Schwarz <georg.schwarz@fau.de>

import React, { useEffect } from 'react'
import './App.css'
import './assets/styles/styles.scss'
import { useAppSelector } from './store/hooks'
import { selectView } from './store/globalSlice'
import NavBar from './components/NavBar'
import Dashboard from './components/Dashboard'

let allData: Array<SampleCluster> = []

function App() {
	const view = useAppSelector(selectView)

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
		fetch('dummy/dummyFull.json', {
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

	useEffect(() => {
		getData()
	}, [])

	return (
		<div className="bg-blue w-full h-full">
			<div className="w-full h-full">
				<NavBar />
				<ul>
					<Dashboard completeData={allData} view={view.selectedNav} />
				</ul>
			</div>
		</div>
	)
}

export default App
