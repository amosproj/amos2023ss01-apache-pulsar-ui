// SPDX-License-Identifier: MIT
// SPDX-FileCopyrightText: 2010-2021 Dirk Riehle <dirk@riehle.org
// SPDX-FileCopyrightText: 2019 Georg Schwarz <georg. schwarz@fau.de>

import React, { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import axios from 'axios'
import {
	selectCluster,
	selectNamespace,
	selectProducer,
	selectSubscription,
	selectTenant,
	selectTopic,
} from '../../store/filterSlice'
import TopicView from './TopicView'
import { selectTrigger } from '../requestTriggerSlice'
import config from '../../config'
import { Masonry } from 'react-plock'
import { Pagination } from '@mui/material'
import { Box } from '@mui/system'

export interface ResponseTopic {
	topics: TopicInfo[]
}

/**
 * Card group component for the topic type.
 * Displays the TopicView cards, title, loading window and network error.
 * @returns Rendered topic view cards for the dashboard component
 */
const TopicGroup: React.FC = () => {
	const [data, setData] = useState<TopicInfo[]>([])
	const [error, setError] = useState<string | null>(null)
	const [loading, setLoading] = useState<boolean>(true)

	const clusterFilter = useAppSelector(selectCluster)
	const tenantFilter = useAppSelector(selectTenant)
	const namespaceFilter = useAppSelector(selectNamespace)
	const producerFilter = useAppSelector(selectProducer)
	const subscriptionFilter = useAppSelector(selectSubscription)
	const topicFilter = useAppSelector(selectTopic)
	const baseURL = config.backendUrl + '/api/topic/all'
	const trigger = useAppSelector(selectTrigger)

	const [page, setPage] = useState(1) // Page state set to page 1 as current page
	const itemsPerPage = 20 // Set number of items per page

	const handleChangePage = (
		event: React.ChangeEvent<unknown>,
		value: number
	) => {
		setPage(value) // Set the current page
	}

	// Sends get request to /cluster/all for general information everytime the trigger value changes
	useEffect(() => {
		setPage(1)
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
		const producerQuery = producerFilter.map(
			(producer) => `producer=${producer}`
		)
		const subscriptionQuery = subscriptionFilter
			.map((subscription) => `subscriptions=${subscription}`)
			.join('&')
		const topicQuery = topicFilter.map((topic) => `topics=${topic}`).join('&')

		// Joining all query parameters
		const query = [
			clusterQuery,
			tenantQuery,
			namespaceQuery,
			topicQuery,
			producerQuery,
			subscriptionQuery,
		]
			.filter((q) => q)
			.join('&')
		const url = `${baseURL}?${query}`
		// Sending GET request
		axios
			.get<ResponseTopic>(url)
			.then((response) => {
				setData(response.data.topics)
				setLoading(false)
			})
			.catch((error) => {
				setError(error.message)
				setLoading(false)
			})
	}, [trigger])

	return (
		<div>
			<h2 className="dashboard-title">Available Topics ({data.length})</h2>
			<h3 className="dashboard-subtitle">
				Producers: {sumElements(data, 'producers')}, Subscriptions:{' '}
				{sumElements(data, 'subscriptions')}
			</h3>
			{loading ? (
				<div className="main-card"> Loading...</div>
			) : error ? (
				<div>Error: {error}</div>
			) : (
				<>
					<Masonry
						className="main-card-wrapper"
						// Slicing the items array based on the current page
						items={data.slice((page - 1) * itemsPerPage, page * itemsPerPage)}
						config={{
							columns: [1, 2],
							gap: [34, 34],
							media: [1619, 1620],
						}}
						render={(topic, index) => (
							<div
								className={
									data.length === 1 ? 'single-card main-card' : 'main-card'
								}
								key={index}
							>
								<TopicView key={index} data={topic} />
							</div>
						)}
					/>
					<Box display="flex" justifyContent="center" marginTop={2}>
						{/* Added Pagination component */}
						<Pagination
							count={Math.ceil(data.length / itemsPerPage)} // Calculate the number of pages
							page={page}
							onChange={handleChangePage}
							shape="rounded"
						/>
					</Box>
				</>
			)}
		</div>
	)
}

const sumElements = (
	topics: TopicInfo[],
	field: 'producers' | 'subscriptions'
) => topics.map((element) => element[field].length).reduce((a, b) => a + b, 0)

export default TopicGroup
