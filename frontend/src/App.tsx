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
} from './store/globalSlice'
import ResponsiveNavBar from './components/responsiveNavBar'

type SampleViewData = {
	tag: string
	id: number
	content: string
}
let allData: Array<SampleViewData> = []

function App() {
	const dispatch = useAppDispatch()
	const dummyData = useAppSelector(selectData)
	const triggerUpdate = (msg: string, tpc: string) => {
		dispatch(updateData({ message: msg, topic: tpc }))
		console.log(dummyData)
	}

	const view = useAppSelector(selectView)

	const filteredData = allData.filter(
		//TODO add cases with item.id
		(item) => !view || item.tag === view.selectedNav
	)

	//can later on be replaced by the fetchDataThunk
	const getData = () => {
		fetch('dummy/dummy.json', {
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
			},
		})
			.then(function (response) {
				console.log(response)
				return response.json()
			})
			.then(function (json) {
				console.log(json)
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
				console.log(response)
				return response.json()
			})
			.then(function (json) {
				console.log(json)
				allData = json
			})
	}

	useEffect(() => {
		getData()
	}, [])

	return (
		<div className="bg-blue w-full h-full">
			<div className="w-full h-full">
				<ResponsiveNavBar></ResponsiveNavBar>
				<ul>
					{filteredData.map((item, index) => (
						<li key={index}>{item.content}</li>
					))}
				</ul>
				<Form data={dummyData} triggerUpdate={triggerUpdate}></Form>
			</div>
		</div>
	)
}

export default App
