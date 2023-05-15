// SPDX-License-Identifier: MIT
// SPDX-FileCopyrightText: 2010-2021 Dirk Riehle <dirk@riehle.org>
// SPDX-FileCopyrightText: 2019 Georg Schwarz <georg.schwarz@fau.de>

import React, { useEffect, useState } from 'react'
import './App.css'
import './assets/styles/styles.scss'
import { useAppDispatch, useAppSelector } from './store/hooks'
import { selectView, setNav } from './store/globalSlice'
import NavBar from './components/NavBar'
import LandingPage from './components/landing/LandingPage'

type SampleCluster = {
	tag: string
	id: number
	content: string
	namespaces: Array<SampleNamespace>
}

type SampleNamespace = {
	tag: string
	id: number
	content: string
	topics: Array<SampleTopic>
}

type SampleTopic = {
	tag: string
	id: number
	content: string
	messages: Array<SampleMessage>
}

type SampleMessage = {
	tag: string
	id: number
	content: string
}

let allData: Array<SampleCluster> = []

function App() {
	const dispatch = useAppDispatch()

	const view = useAppSelector(selectView)

	/** Landing Page Logic */
	const [isLanding, setIsLanding] = useState(true)
	/** End of Landing Page Logic */

	const allNamespaces = allData
		.map((item) => item.namespaces)
		.filter((el) => el.length > 0)
		.flat()

	const allTopics = allData
		.flatMap((item) => item.namespaces)
		.map((namespace) => namespace.topics)
		.filter((el) => el.length > 0)
		.flat()

	const allMessages = allData
		.flatMap((item) => item.namespaces)
		.flatMap((namespace) => namespace.topics)
		.map((topic) => topic.messages)
		.filter((el) => el.length > 0)
		.flat()

	let filteredData:
		| Array<SampleCluster>
		| Array<SampleNamespace>
		| Array<SampleTopic>
		| Array<SampleMessage> = allData

	if (view.selectedNav === 'namespace') {
		filteredData = allNamespaces
	} else if (view.selectedNav === 'topic') {
		filteredData = allTopics
	} else if (view.selectedNav === 'message') {
		filteredData = allMessages
	}

	const getNewElementTag = (tag: string) => {
		tag = tag.toLowerCase()
		if (tag === 'cluster') {
			return 'namespace'
		} else if (tag === 'namespace') {
			return 'topic'
		} else return 'message'
	}

	const selectNewElement = (tag: string, id: number) => {
		tag = getNewElementTag(tag)
		dispatch(setNav(tag))
	}

	//can later on be replaced by the fetchDataThunk
	const getData = () => {
		//part for dummy NavBar
		fetch('dummy/dummyViewData.json', {
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
		<>
			{isLanding ? (
				<LandingPage setIsLanding={setIsLanding} />
			) : (
				<div className="bg-blue w-full h-full">
					<div className="w-full h-full">
						<NavBar />
						<ul>
							{filteredData.map(
								(
									item:
										| SampleCluster
										| SampleNamespace
										| SampleTopic
										| SampleMessage,
									index: number
								) => (
									<li key={index}>
										<a href="#">{item?.content}</a>
									</li>
								)
							)}
						</ul>
					</div>
				</div>
			)}
		</>
	)
}

export default App
