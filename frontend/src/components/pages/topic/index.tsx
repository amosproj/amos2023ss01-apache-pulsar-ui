// SPDX-License-Identifier: MIT
// SPDX-FileCopyrightText: 2010-2021 Dirk Riehle <dirk@riehle.org
// SPDX-FileCopyrightText: 2019 Georg Schwarz <georg. schwarz@fau.de>

import React, { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../../store/hooks'
import axios from 'axios'
import {
	selectCluster,
	selectNamespace,
	selectProducer,
	selectSubscription,
	selectTenant,
	selectTopic,
} from '../../../store/filterSlice'
import TopicView from './TopicView'
import { selectTrigger } from '../requestTriggerSlice'
import config from '../../../config'

export interface ResponseTopic {
	topics: TopicInfo[]
}

/**
 * Card group component for the topic type.
 * Displays the TopicView cards, title, loading window and network error.
 * @returns Rendered topic view cards for the dashboard component
 */
const TopicGroup: React.FC = () => {
	const [data, setData] = useState<TopicInfo[]>([])
	const [error, setError] = useState<string | null>(null)
	const [loading, setLoading] = useState<boolean>(true)

	const clusterFilter = useAppSelector(selectCluster)
	const tenantFilter = useAppSelector(selectTenant)
	const namespaceFilter = useAppSelector(selectNamespace)
	const producerFilter = useAppSelector(selectProducer)
	const subscriptionFilter = useAppSelector(selectSubscription)
	const topicFilter = useAppSelector(selectTopic)
	const baseURL = config.backendUrl + '/api/topic/all'
	const trigger = useAppSelector(selectTrigger)

	// Sends get request to /cluster/all for general information everytime the trigger value changes
	useEffect(() => {
		// Query parameters
		const clusterQuery = clusterFilter
			.map((cluster) => `clusters=${cluster}`)
			.join('&')
		const tenantQuery = tenantFilter
			.map((tenant) => `tenants=${tenant}`)
			.join('&')
		const namespaceQuery = namespaceFilter
			.map((namespace) => `namespaces=${namespace}`)
			.join('&')
		const producerQuery = producerFilter.map(
			(producer) => `producer=${producer}`
		)
		const subscriptionQuery = subscriptionFilter
			.map((subscription) => `subscriptions=${subscription}`)
			.join('&')
		const topicQuery = topicFilter.map((topic) => `topics=${topic}`).join('&')

		// Joining all query parameters
		const query = [
			clusterQuery,
			tenantQuery,
			namespaceQuery,
			topicQuery,
			producerQuery,
			subscriptionQuery,
		]
			.filter((q) => q)
			.join('&')
		const url = `${baseURL}?${query}`
		// Sending GET request
		axios
			.get<ResponseTopic>(url)
			.then((response) => {
				setData(response.data.topics)
				setLoading(false)
			})
			.catch((error) => {
				setError(error.message)
				setLoading(false)
			})
	}, [trigger])

	return (
		<div>
			<h2 className="dashboard-title">Available Topics</h2>
			{loading ? (
				<div className="main-card"> Loading...</div>
			) : error ? (
				<div>Error: {error}</div>
			) : (
				<div>
					{data.map((topic, index) => (
						<div className="main-card" key={index}>
							<TopicView key={index} data={topic} />
						</div>
					))}
				</div>
			)}
		</div>
	)
}

export default TopicGroup
