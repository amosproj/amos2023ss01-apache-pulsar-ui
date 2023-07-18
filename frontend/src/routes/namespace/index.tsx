// SPDX-License-Identifier: MIT
// SPDX-FileCopyrightText: 2023 Julian Tochman-Szewc <tochman-szewc@campus.tu-berlin.de>
// SPDX-FileCopyrightText: 2023 Shahraz Nasir <shahraz.nasir@campus.tu-berlin.de>
// SPDX-FileCopyrightText: 2023 Ziqi He <ziqi.he@fau.de>
import React, { useEffect, useState } from 'react'
import { useAppSelector } from '../../store/hooks'
import axios from 'axios'
import {
	selectCluster,
	selectNamespace,
	selectTenant,
} from '../../store/filterSlice'
import NamespaceView from './NamespaceView'
import { selectTrigger } from '../requestTriggerSlice'
import config from '../../config'
import { Masonry } from 'react-plock'
import FlushCacheButton from '../../components/buttons/FlushCacheButton'

export interface ResponseNamespace {
	namespaces: NamespaceInfo[]
}

/**
 * The NamespaceGroup component groups the namespaces included within the dashboard inside a masonry.
 * Displays the NamespaceView cards, title, loading window and network error.
 *
 * @component
 * @returns a masonry containing NamespaceView cards.
 */
const NamespaceGroup: React.FC = () => {
	const [data, setData] = useState<NamespaceInfo[]>([])
	const [error, setError] = useState<string | null>(null)
	const [loading, setLoading] = useState<boolean>(true)
	const clusterFilter = useAppSelector(selectCluster)
	const tenantFilter = useAppSelector(selectTenant)
	const namespaceFilter = useAppSelector(selectNamespace)
	const baseURL = config.backendUrl + '/api/namespace/all/'
	const trigger = useAppSelector(selectTrigger)

	// Sends get request to /namespace/all for general information everytime the trigger value changes
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

		// Joining all query parameters
		const query = [clusterQuery, tenantQuery, namespaceQuery]
			.filter((q) => q)
			.join('&')
		const url = `${baseURL}?${query}`
		// Sending GET request
		axios
			.get<ResponseNamespace>(url)
			.then((response) => {
				setData(response.data.namespaces)
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
						Available Namespaces ({data.length})
					</h2>
					<h3 className="dashboard-subtitle">Topics: {sumTopics(data)}</h3>
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
					render={(namespace, index) => (
						<div className="main-card" key={index}>
							<NamespaceView key={index} data={namespace} />
						</div>
					)}
				/>
			)}
		</div>
	)
}

const sumTopics = (namespaces: NamespaceInfo[]) =>
	namespaces.map((element) => element.numberOfTopics).reduce((a, b) => a + b, 0)

export default NamespaceGroup
