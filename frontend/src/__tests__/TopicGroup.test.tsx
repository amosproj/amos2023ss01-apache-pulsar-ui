// SPDX-License-Identifier: MIT
// SPDX-FileCopyrightText: 2023 Julian Tochman-Szewc <tochman-szewc@campus.tu-berlin.de>
// SPDX-FileCopyrightText: 2023 Shahraz Nasir <shahraz.nasir@campus.tu-berlin.de>
// SPDX-FileCopyrightText: 2023 Ziqi He <ziqi.he@fau.de>
import React from 'react'
import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import store from '../store'
import TopicView from '../routes/topic/TopicView'
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'

const dataTest: Array<TopicInfo> = [
	{
		name: 'amos-topic-1',
		namespace: 'amos-namespace-2',
		tenant: 'amos-tenant-2',
		producers: ['test-producer'],
		subscriptions: ['test-subscription'],
		messagesSendToTopic: 5,
	},
]

test('should check if data is being displayed in the TopicGroup', async () => {
	//store.dispatch(setClusterDataTEST(dataTest))

	render(
		<Router>
			<Routes>
				<Route
					path="/"
					element={
						<Provider store={store}>
							<div data-testid="main-topicgroup">
								<h2 className="dashboard-title">Available Topics</h2>
								<div>
									{dataTest.map((topic, index) => (
										<div className="main-card" key={index}>
											<TopicView key={index} data={topic} />
										</div>
									))}
								</div>
							</div>
						</Provider>
					}
				></Route>
			</Routes>
		</Router>
	)
	expect(screen.getByTestId('main-topicgroup')).toHaveTextContent(
		'amos-topic-1'
	)
	expect(screen.getByTestId('main-topicgroup')).toHaveTextContent(
		'amos-namespace-2'
	)
	expect(screen.getByTestId('main-topicgroup')).toHaveTextContent(
		'amos-tenant-2'
	)
	expect(screen.getByTestId('main-topicgroup')).toHaveTextContent(
		'test-producer'
	)
	expect(screen.getByTestId('main-topicgroup')).toHaveTextContent(
		'test-subscription'
	)
})
