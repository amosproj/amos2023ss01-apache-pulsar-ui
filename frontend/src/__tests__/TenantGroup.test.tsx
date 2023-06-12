import React from 'react'
import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import store from '../store'
import TenantView from '../components/pages/tenant/TenantView'
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'

const dataTest: Array<TenantInfo> = [
	{
		name: 'amos-tenant-2',
		tenantInfo: {
			adminRoles: ['role1', 'role2'],
			allowedClusters: ['cluster1', 'cluster2'],
		},
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
		'Admin Roles: role1, role2'
	)
	expect(screen.getByTestId('main-tenantgroup')).toHaveTextContent(
		'Allowed Clusters: cluster1, cluster2'
	)
})
