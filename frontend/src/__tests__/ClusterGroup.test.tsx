// SPDX-License-Identifier: MIT
// SPDX-FileCopyrightText: 2023 Julian Tochman-Szewc <tochman-szewc@campus.tu-berlin.de>
// SPDX-FileCopyrightText: 2023 Shahraz Nasir <shahraz.nasir@campus.tu-berlin.de>
// SPDX-FileCopyrightText: 2023 Ziqi He <ziqi.he@fau.de>
import React from 'react'
import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import store from '../store'
import ClusterView from '../routes/cluster/ClusterView'
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'

const dataTest: Array<ClusterInfo> = [
	{
		name: 'amos-demo-2',
		numberOfNamespaces: 1,
		numberOfTenants: 1,
	},
	{
		name: 'amos-demo-3',
		numberOfNamespaces: 1,
		numberOfTenants: 1,
	},
	{
		name: 'amos-demo-4',
		numberOfNamespaces: 1,
		numberOfTenants: 1,
	},
]

test('should check if data is being displayed in the ClusterGroup', async () => {
	//store.dispatch(setClusterDataTEST(dataTest))

	render(
		<Router>
			<Routes>
				<Route
					path="/"
					element={
						<Provider store={store}>
							<div data-testid="main-clustergroup">
								<h2 className="dashboard-title">Available Clusters</h2>
								<div>
									{dataTest.map((cluster, index) => (
										<div className="main-card" key={index}>
											<ClusterView key={index} data={cluster} />
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
	expect(screen.getByTestId('main-clustergroup')).toHaveTextContent(
		'amos-demo-2'
	)
})
