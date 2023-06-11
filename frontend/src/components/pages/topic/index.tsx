// SPDX-License-Identifier: MIT
// SPDX-FileCopyrightText: 2010-2021 Dirk Riehle <dirk@riehle.org
// SPDX-FileCopyrightText: 2019 Georg Schwarz <georg. schwarz@fau.de>

import React, { useEffect, useState } from 'react'
import { useAppSelector } from '../../../store/hooks'
import axios from 'axios'
import {
	selectCluster,
	selectNamespace,
	selectTenant,
	selectTopic,
} from '../../../store/filterSlice'
import TopicView from '../../views/TopicView'

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

	useEffect(() => {
		// Query parameters
		const params = {
			cluster: clusterFilter,
			tenant: tenantFilter,
			namespace: namespaceFilter,
			topic: topicFilter,
		}

		// Sending GET request
		axios
			.get<ResponseTopic>(url, { params })
			.then((response) => {
				setData(response.data.topics)
				setLoading(false)
			})
			.catch((error) => {
				setError(error.message)
				setLoading(false)
			})
	}, [])

	return (
		<div>
			<h2 className="dashboard-title">Available Topics</h2>
			<div className="main-card">
				{loading ? (
					<div>Loading...</div>
				) : error ? (
					<div>Error: {error}</div>
				) : (
					<div>
						{data.map((topic, index) => (
							<TopicView key={index} data={topic} />
						))}
					</div>
				)}
			</div>
		</div>
	)
}

export default TopicGroup
