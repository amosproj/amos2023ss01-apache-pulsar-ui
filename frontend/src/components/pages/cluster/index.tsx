// SPDX-License-Identifier: MIT
// SPDX-FileCopyrightText: 2010-2021 Dirk Riehle <dirk@riehle.org
// SPDX-FileCopyrightText: 2019 Georg Schwarz <georg. schwarz@fau.de>

import React, { useEffect, useState } from 'react'
import { useAppSelector } from '../../../store/hooks'
import axios from 'axios'
import ClusterView from './ClusterView'
import { selectCluster } from '../../../store/filterSlice'

interface ResponseCluster {
	clusters: string[]
}

const ClusterGroup: React.FC = () => {
	const [data, setData] = useState<string[]>([])
	const [error, setError] = useState<string | null>(null)
	const [loading, setLoading] = useState<boolean>(true)
	const clusterFilter = useAppSelector(selectCluster)
	const url = 'http://localhost:8081/api/cluster/all'

	useEffect(() => {
		// Query parameters
		const params = {
			//clusters: clusterFilter,
		}

		// Sending GET request
		axios
			.get<ResponseCluster>(url, { params })
			.then((response) => {
				setData(response.data.clusters)
				setLoading(false)
			})
			.catch((error) => {
				setError(error.message)
				setLoading(false)
			})
	}, [])

	return (
		<div>
			<h2 className="dashboard-title">Available Clusters</h2>
			{loading ? (
				<div className="main-card"> Loading...</div>
			) : error ? (
				<div>Error: {error}</div>
			) : (
				<div>
					{data.map((cluster, index) => (
						<div className="main-card" key={index}>
							<ClusterView key={index} data={{ id: cluster }} />
						</div>
					))}
				</div>
			)}
		</div>
	)
}

export default ClusterGroup
