// SPDX-License-Identifier: MIT
// SPDX-FileCopyrightText: 2023 Julian Tochman-Szewc <tochman-szewc@campus.tu-berlin.de>
// SPDX-FileCopyrightText: 2023 Shahraz Nasir <shahraz.nasir@campus.tu-berlin.de>
// SPDX-FileCopyrightText: 2023 Ziqi He <ziqi.he@fau.de>
import React, { useEffect, useState } from 'react'
import { useAppSelector } from '../../store/hooks'
import axios from 'axios'
import ClusterView from './ClusterView'
import { selectTrigger } from '../requestTriggerSlice'
import config from '../../config'
import { Masonry } from 'react-plock'
import FlushCacheButton from '../../components/buttons/FlushCacheButton'

export interface ResponseCluster {
	clusters: ClusterInfo[]
}

/**
 * The ClusterGroup component groups the clusters included within the dashboard inside a masonry.
 * Displays the ClusterView cards, title, loading window and network error.
 *
 * @component
 * @returns a masonry containing ClusterView cards.
 */
const ClusterGroup: React.FC = () => {
	const [data, setData] = useState<ClusterInfo[]>([])
	const [error, setError] = useState<string | null>(null)
	const [loading, setLoading] = useState<boolean>(true)
	const url = config.backendUrl + '/api/cluster/all'
	const trigger = useAppSelector(selectTrigger)

	// Sends get request to /cluster/all for general information everytime the trigger value changes
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
			<div className="flex dashboard-header">
				<div>
					<h2 className="dashboard-title">
						Available Clusters ({data.length})
					</h2>
					<h3 className="dashboard-subtitle">
						Tenants: {sumElements(data, 'numberOfTenants')}, Namespaces:{' '}
						{sumElements(data, 'numberOfNamespaces')}
					</h3>
				</div>
				<FlushCacheButton />
			</div>
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
							<ClusterView key={index} data={cluster} />
						</div>
					)}
				/>
			)}
		</div>
	)
}

const sumElements = (
	clusters: ClusterInfo[],
	field: 'numberOfTenants' | 'numberOfNamespaces'
) => clusters.map((element) => element[field]).reduce((a, b) => a + b, 0)

export default ClusterGroup
