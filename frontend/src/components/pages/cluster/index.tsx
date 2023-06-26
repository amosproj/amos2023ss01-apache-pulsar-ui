// SPDX-License-Identifier: MIT
// SPDX-FileCopyrightText: 2010-2021 Dirk Riehle <dirk@riehle.org
// SPDX-FileCopyrightText: 2019 Georg Schwarz <georg. schwarz@fau.de>

import React, { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../../store/hooks'
import axios from 'axios'
import ClusterView from './ClusterView'
import { selectCluster } from '../../../store/filterSlice'
import { selectTrigger } from '../requestTriggerSlice'
import { Masonry } from 'react-plock'

export interface ResponseCluster {
	clusters: string[]
}

/**
 * Card group component for the cluster type.
 * Displays the ClusterView cards, title, loading window and network error.
 * @returns Rendered cluster view cards for the dashboard component
 */
const ClusterGroup: React.FC = () => {
	const [data, setData] = useState<string[]>([])
	const [error, setError] = useState<string | null>(null)
	const [loading, setLoading] = useState<boolean>(true)
	const url = 'http://localhost:8081/api/cluster/all'
	const trigger = useAppSelector(selectTrigger)

	//Sends get request to /cluster/all for general information everytime the trigger value changes
	useEffect(() => {
		// Sending GET request
		axios
			.get<ResponseCluster>(url)
			.then((response) => {
				setData(response.data.clusters)
				setLoading(false)
			})
			.catch((error) => {
				setError(error.message)
				setLoading(false)
			})
	}, [trigger])

	return (
		<div>
			<h2 className="dashboard-title">Available Clusters</h2>
			{loading ? (
				<div className="main-card"> Loading...</div>
			) : error ? (
				<div>Error: {error}</div>
			) : (
				<Masonry
					className="main-card-wrapper"
					items={data}
					config={{
						columns: [1, 2],
						gap: [34, 34],
						media: [1619, 1620],
					}}
					render={(cluster, index) => (
						<div
							className={
								data.length === 1 ? 'single-card main-card' : 'main-card'
							}
							key={index}
						>
							<ClusterView key={index} data={{ id: cluster }} />
						</div>
					)}
				/>
			)}
		</div>
	)
}

export default ClusterGroup
