// SPDX-License-Identifier: MIT
// SPDX-FileCopyrightText: 2010-2021 Dirk Riehle <dirk@riehle.org>
// SPDX-FileCopyrightText: 2019 Georg Schwarz <georg.schwarz@fau.de>

import React, { useEffect } from 'react'
import './App.css'
import './assets/styles/styles.scss'
import Form from './components/form/Form'
import { useAppDispatch, useAppSelector } from './store/hooks'
import {
	selectData,
	selectView,
	setData,
	updateData,
	setNav,
} from './store/globalSlice'
import NavBar from './components/NavBar'

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
	const dummyData = useAppSelector(selectData)
	const triggerUpdate = (msg: string, tpc: string) => {
		dispatch(updateData({ message: msg, topic: tpc }))
	}

	const view = useAppSelector(selectView)

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

	let filteredData: any = allData

	if (view.selectedNav === 'namespace') {
		filteredData = allNamespaces
	} else if (view.selectedNav === 'topic') {
		filteredData = allTopics
	} else if (view.selectedNav === 'message') {
		filteredData = allMessages
	}

	const getNewElementTag = (tag: string) => {
		if (tag === 'cluster') {
			return 'namespace'
		} else if (tag === 'namespace') {
			return 'topic'
		} else return 'message'
	}

	const selectNewElement = (tag: string, id: number) => {
		tag = getNewElementTag(tag).toLowerCase()
		dispatch(setNav(tag))
	}

	//can later on be replaced by the fetchDataThunk
	const getData = () => {
		fetch('dummy/dummy.json', {
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
			},
		})
			.then(function (response) {
				return response.json()
			})
			.then(function (json) {
				dispatch(setData(json))
			})
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
		<div className="bg-blue w-full h-full">
			<div className="w-full h-full">
				<NavBar />
				<ul>
					{filteredData.map((item: any, index: any) => (
						<li key={index}>
							<a href="#">{item?.content}</a>
						</li>
					))}
				</ul>
			</div>
		</div>
	)
}

export default App
