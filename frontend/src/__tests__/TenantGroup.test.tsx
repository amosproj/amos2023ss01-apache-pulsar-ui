// SPDX-License-Identifier: MIT
// SPDX-FileCopyrightText: 2023 Julian Tochman-Szewc <tochman-szewc@campus.tu-berlin.de>
// SPDX-FileCopyrightText: 2023 Shahraz Nasir <shahraz.nasir@campus.tu-berlin.de>
// SPDX-FileCopyrightText: 2023 Ziqi He <ziqi.he@fau.de>
import React from 'react'
import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import store from '../store'
import TenantView from '../routes/tenant/TenantView'
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'

const dataTest: Array<TenantInfo> = [
	{
		name: 'amos-tenant-2',
		tenantInfo: {
			adminRoles: ['role1', 'role2'],
			allowedClusters: ['cluster1', 'cluster2'],
		},
		numberOfNamespaces: 3,
		numberOfTopics: 3,
	},
]

test('should check if data is being displayed in the TenantGroup', async () => {
	//store.dispatch(setClusterDataTEST(dataTest))

	render(
		<Router>
			<Routes>
				<Route
					path="/"
					element={
						<Provider store={store}>
							<div data-testid="main-tenantgroup">
								<h2 className="dashboard-title">Available Tenants</h2>
								<div>
									{dataTest.map((tenant, index) => (
										<div className="main-card" key={index}>
											<TenantView key={index} data={tenant} />
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
	expect(screen.getByTestId('main-tenantgroup')).toHaveTextContent(
		'amos-tenant-2'
	)
	expect(screen.getByTestId('main-tenantgroup')).toHaveTextContent(
		'role1, role2'
	)
	expect(screen.getByTestId('main-tenantgroup')).toHaveTextContent(
		'cluster1, cluster2'
	)
})
