// SPDX-License-Identifier: MIT
// SPDX-FileCopyrightText: 2010-2021 Dirk Riehle <dirk@riehle.org>
// SPDX-FileCopyrightText: 2019 Georg Schwarz <georg.schwarz@fau.de>

import React, { useEffect } from 'react'
import './App.css'
import './assets/styles/styles.scss'
import logo from './assets/images/team-logo-light.png'
import Form from './components/form/Form'
import { useAppDispatch, useAppSelector } from './store/hooks'
import { selectData, setData, updateData } from './store/globalSlice'

function App() {
	const dispatch = useAppDispatch()
	const dummyData = useAppSelector(selectData)

	const triggerUpdate = (msg: string, tpc: string) => {
		dispatch(updateData({ message: msg, topic: tpc }))
		console.log(dummyData)
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
				console.log(response)
				return response.json()
			})
			.then(function (json) {
				console.log(json)
				dispatch(setData(json))
			})
	}

	useEffect(() => {
		getData()
	}, [])

	return (
		<div className="bg-blue w-full h-full">
			<div className="w-full h-full">
				<nav className="px-12 py-5">
					<img className="home-logo" src={logo} alt="logo" />
				</nav>
				<Form data={dummyData} triggerUpdate={triggerUpdate}></Form>
			</div>
		</div>
	)
}

export default App
