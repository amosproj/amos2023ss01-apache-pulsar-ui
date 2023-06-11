// SPDX-License-Identifier: MIT
// SPDX-FileCopyrightText: 2010-2021 Dirk Riehle <dirk@riehle.org
// SPDX-FileCopyrightText: 2019 Georg Schwarz <georg. schwarz@fau.de>

import React, { useEffect, useState } from 'react'
import { useAppSelector } from '../../../store/hooks'
import axios from 'axios'
import { selectCluster, selectTenant } from '../../../store/filterSlice'
import TenantView from '../../views/TenantView'

interface ResponseTenant {
	tenants: TenantInfo[]
}

const TenantGroup: React.FC = () => {
	const [data, setData] = useState<TenantInfo[]>([])
	const [error, setError] = useState<string | null>(null)
	const [loading, setLoading] = useState<boolean>(true)
	const clusterFilter = useAppSelector(selectCluster)
	const tenantFilter = useAppSelector(selectTenant)
	const url = 'http://localhost:8081/api/tenant'

	useEffect(() => {
		// Query parameters
		const params = {
			cluster: clusterFilter,
			tenant: tenantFilter,
		}

		// Sending GET request
		axios
			.get<ResponseTenant>(url, { params })
			.then((response) => {
				setData(response.data.tenants)
				setLoading(false)
			})
			.catch((error) => {
				setError(error.message)
				setLoading(false)
			})
	}, [])

	return (
		<div>
			<h2 className="dashboard-title">Available Tenants</h2>
			<div className="main-card">
				{loading ? (
					<div>Loading...</div>
				) : error ? (
					<div>Error: {error}</div>
				) : (
					<div>
						{data.map((tenant, index) => (
							<TenantView key={index} data={tenant} />
						))}
					</div>
				)}
			</div>
		</div>
	)
}

export default TenantGroup
