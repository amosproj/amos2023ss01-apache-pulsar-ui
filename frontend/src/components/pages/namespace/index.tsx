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
	updateDisplayedOptions,
} from '../../../store/filterSlice'
import NamespaceView from './NamespaceView'

interface ResponseNamespace {
	namespaces: NamespaceInfo[]
}

const NamespaceGroup: React.FC = () => {
	const [data, setData] = useState<NamespaceInfo[]>([])
	const [error, setError] = useState<string | null>(null)
	const [loading, setLoading] = useState<boolean>(true)
	const clusterFilter = useAppSelector(selectCluster)
	const tenantFilter = useAppSelector(selectTenant)
	const namespaceFilter = useAppSelector(selectNamespace)
	const url = 'http://localhost:8081/api/namespace/all/'
	const dispatch = useAppDispatch()

	useEffect(() => {
		// Query parameters
		const params = {
			//clusters: clusterFilter,
			tenants: tenantFilter.toString().replace(/,/g, '&'),
			namespaces: namespaceFilter.toString().replace(/,/g, '&'),
		}

		// Sending GET request
		axios
			.get<ResponseNamespace>(url, { params })
			.then((response) => {
				setData(response.data.namespaces)
				setLoading(false)
				dispatch(
					updateDisplayedOptions({
						topologyLevel: 'namespace',
						options: response.data.namespaces.map((namespace) => namespace.id),
					})
				)
			})
			.catch((error) => {
				setError(error.message)
				setLoading(false)
			})
	}, [])

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
