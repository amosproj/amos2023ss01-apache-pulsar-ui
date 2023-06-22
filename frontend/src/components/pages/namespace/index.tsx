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
} from '../../../store/filterSlice'
import NamespaceView from './NamespaceView'
import { selectTrigger } from '../requestTriggerSlice'
import config from '../../../config'

export interface ResponseNamespace {
	namespaces: NamespaceInfo[]
}

/**
 * Card group component for the namespace type.
 * Displays the NamespaceView cards, title, loading window and network error.
 * @returns Rendered namespace view cards for the dashboard component
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
			<h2 className="dashboard-title">Available Namespaces</h2>
			{loading ? (
				<div className="main-card"> Loading...</div>
			) : error ? (
				<div>Error: {error}</div>
			) : (
				<div>
					{data.map((namespace, index) => (
						<div className="main-card" key={index}>
							<NamespaceView key={index} data={namespace} />
						</div>
					))}
				</div>
			)}
		</div>
	)
}

export default NamespaceGroup
