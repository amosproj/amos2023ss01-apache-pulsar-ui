// SPDX-License-Identifier: MIT
// SPDX-FileCopyrightText: 2010-2021 Dirk Riehle <dirk@riehle.org
// SPDX-FileCopyrightText: 2019 Georg Schwarz <georg. schwarz@fau.de>

import React, { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../../store/hooks'
import axios from 'axios'
import {
	selectCluster,
	selectTenant,
	updateDisplayedOptions,
} from '../../../store/filterSlice'
import TenantView from './TenantView'

interface ResponseTenant {
	tenants: TenantInfo[]
}

const TenantGroup: React.FC = () => {
	const [data, setData] = useState<TenantInfo[]>([])
	const [error, setError] = useState<string | null>(null)
	const [loading, setLoading] = useState<boolean>(true)
	const clusterFilter = useAppSelector(selectCluster)
	const tenantFilter = useAppSelector(selectTenant)
	const url = 'http://localhost:8081/api/tenant/all'
	const dispatch = useAppDispatch()

	useEffect(() => {
		// Query parameters
		const params = {
			//clusters: clusterFilter.toString().replace(/,/g, '&'),
			tenants: tenantFilter.toString().replace(/,/g, '&'),
		}

		// Sending GET request
		axios
			.get<ResponseTenant>(url, { params })
			.then((response) => {
				setData(response.data.tenants)
				setLoading(false)
				dispatch(
					updateDisplayedOptions({
						topologyLevel: 'tenant',
						options: response.data.tenants.map((tenant) => tenant.name),
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
			<h2 className="dashboard-title">Available Tenants</h2>
			{loading ? (
				<div className="main-card"> Loading...</div>
			) : error ? (
				<div>Error: {error}</div>
			) : (
				<div>
					{data.map((tenant, index) => (
						<div className="main-card" key={index}>
							<TenantView key={index} data={tenant} />
						</div>
					))}
				</div>
			)}
		</div>
	)
}

export default TenantGroup
