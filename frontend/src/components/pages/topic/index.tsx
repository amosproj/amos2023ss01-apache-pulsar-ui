// SPDX-License-Identifier: MIT
// SPDX-FileCopyrightText: 2010-2021 Dirk Riehle <dirk@riehle.org
// SPDX-FileCopyrightText: 2019 Georg Schwarz <georg. schwarz@fau.de>

import React, { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../../store/hooks'
import axios from 'axios'
import {
	selectCluster,
	selectNamespace,
	selectTenant,
	selectTopic,
	updateDisplayedOptions,
} from '../../../store/filterSlice'
import TopicView from './TopicView'
import { selectTrigger } from '../requestTriggerSlice'

interface ResponseTopic {
	topics: TopicInfo[]
}

const TopicGroup: React.FC = () => {
	const [data, setData] = useState<TopicInfo[]>([])
	const [error, setError] = useState<string | null>(null)
	const [loading, setLoading] = useState<boolean>(true)

	const clusterFilter = useAppSelector(selectCluster)
	const tenantFilter = useAppSelector(selectTenant)
	const namespaceFilter = useAppSelector(selectNamespace)
	const topicFilter = useAppSelector(selectTopic)
	const url = 'http://localhost:8081/api/topic/all'
	const dispatch = useAppDispatch()
	const trigger = useAppSelector(selectTrigger)

	useEffect(() => {
		// Query parameters
		const params = {
			//clusters: clusterFilter,
			tenants: tenantFilter.toString().replace(/,/g, '&'),
			namespaces: namespaceFilter.toString().replace(/,/g, '&'),
			topics: topicFilter.toString().replace(/,/g, '&'),
		}

		// Sending GET request
		axios
			.get<ResponseTopic>(url, { params })
			.then((response) => {
				setData(response.data.topics)
				setLoading(false)
				dispatch(
					updateDisplayedOptions({
						topologyLevel: 'topic',
						options: response.data.topics.map((topic) => topic.name),
					})
				)
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
