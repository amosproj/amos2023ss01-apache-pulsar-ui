import React from 'react'
import { render, screen } from '@testing-library/react'
import Dashboard from '../components/Dashboard'
import { Provider } from 'react-redux'
import store from '../store'
import { setClusterDataTEST } from '../store/globalSlice'

const dataTest = [
	{
		id: 'amos-demo-2',
		tenants: [
			{
				id: 'eu-tenant',
				cluster: 'amos-demo-2',
				namespaces: [
					{
						id: 'eu-tenant/hr',
						cluster: 'amos-demo-2',
						tenant: 'eu-tenant',
						topics: [
							{
								id: 'persistent://eu-tenant/hr/foo',
								localName: 'foo',
								namespace: 'hr',
								tenant: 'eu-tenant',
								cluster: 'amos-demo-2',
								topicStatsDto: {
									subscriptions: [
										{
											name: 'foo-sub',
											consumers: [],
											numberConsumers: 0,
										},
									],
									producers: [],
									numberSubscriptions: 1,
									numberProducers: 0,
									producedMesages: 11,
									consumedMessages: 0,
									averageMessageSize: 0,
									storageSize: 495,
								},
								persistent: true,
							},
						],
						amountOfTopics: 1,
						bundlesData: {
							boundaries: [
								'0x00000000',
								'0x40000000',
								'0x80000000',
								'0xc0000000',
								'0xffffffff',
							],
							numBundles: 4,
						},
						messagesTTL: 6000,
						retentionPolicies: {
							retentionTimeInMinutes: 60,
							retentionSizeInMB: 1,
						},
					},
				],
				amountOfNamespaces: 3,
				amountOfTopics: 9,
				tenantInfo: {
					adminRoles: [],
					allowedClusters: ['amos-demo-2'],
				},
			},
		],
		brokers: ['broker:8082'],
		amountOfTenants: 1,
		amountOfNamespaces: 3,
		amountOfTopics: 9,
		amountOfBrokers: 1,
		brokerServiceUrl: 'pulsar://broker:8082',
		serviceUrl: 'http://broker:8082',
	},
]

const messagesTest = [
	{
		id: 'message-1',
		payload: 'I am a dummy',
		schema: '',
		cluster: 'amos-demo',
		tenant: 'eu-tenant',
		namespace: 'eu-tenant/sales',
		topic: 'persistent://eu-tenant/sales/bar',
		publishTime: '13:22 PM',
	},
	{
		id: 'message-2',
		payload: 'Message that has another text',
		schema: '',
		cluster: 'amos-demo-2',
		tenant: 'eu-tenant',
		namespace: 'eu-tenant/sales',
		topic: 'persistent://eu-tenant/sales/foobar',
		publishTime: '10:05 AM',
	},
]

test('should check if data is being displayed on the dashboard', async () => {
	store.dispatch(setClusterDataTEST(dataTest))

	render(
		<Provider store={store}>
			<Dashboard
				completeData={store.getState().globalControl.clusterData}
				completeMessages={messagesTest}
				view="cluster"
			/>
		</Provider>
	)
	expect(screen.getByTestId('main-dashboard')).toHaveTextContent(
		'amos-demo-2'
	)
})
