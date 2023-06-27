import React from 'react'
import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import store from '../store'
import ClusterView from '../components/pages/cluster/ClusterView'
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'

const dataTest: Array<ClusterInfo> = [
	{
		name: 'amos-demo-2',
		numberOfNamespces: 1,
		numberOfTenants: 1,
	},
	{
		name: 'amos-demo-3',
		numberOfNamespces: 1,
		numberOfTenants: 1,
	},
	{
		name: 'amos-demo-4',
		numberOfNamespces: 1,
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
