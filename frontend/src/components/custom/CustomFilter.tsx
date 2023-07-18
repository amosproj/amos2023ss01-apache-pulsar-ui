// SPDX-License-Identifier: MIT
// SPDX-FileCopyrightText: 2023 Julian Tochman-Szewc <tochman-szewc@campus.tu-berlin.de>
// SPDX-FileCopyrightText: 2023 Shahraz Nasir <shahraz.nasir@campus.tu-berlin.de>
// SPDX-FileCopyrightText: 2023 Ziqi He <ziqi.he@fau.de>
import React, { useState } from 'react'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import CustomCheckbox from './CustomCheckbox'
import CustomRadio from './CustomRadio'
import CustomSearchbar from './CustomSearchbar'
import { useAppSelector } from '../../store/hooks'
import { selectAllFilters, selectOptions } from '../../store/filterSlice'
import { Topology } from '../../enum'
import { filteredBySearchQuery } from '../../Helpers'

/**
 * The CustomFilter component provides filters for each topology level/page.
 * It allows users to filter topologies on different levels. The lower the topology level, the greater
 * will be the number of filter options available to the user. For example, Namespaces can also be
 * filtered based on Tenants and Clusters. Conversely, Clusters can only be filtered among themselves.
 *
 * @component
 * @param currentView - The current view/page/topology that the user is on.
 * @returns a set of filters based on the page the user is visiting.
 */
const CustomFilter: React.FC<CustomFilterProps> = ({ currentView }) => {
	// The options constant includes the data we already received from the backend API.
	const options = useAppSelector(selectOptions)
	// The filters constant includes the list of elements determining the applied filters.
	const filters = useAppSelector(selectAllFilters)
	const [clusterSearchQuery, setClusterSearchQuery] = useState('')
	const [namespaceSearchQuery, setNamespaceSearchQuery] = useState('')
	const [tenantSearchQuery, setTenantSearchQuery] = useState('')
	const [topicSearchQuery, setTopicSearchQuery] = useState('')
	const [producerSearchQuery, setProducerSearchQuery] = useState('')
	const [subscriptionSearchQuery, setSubscriptionSearchQuery] = useState('')

	// Inside each filter accordion, we only display the elements that contain the query from the searchbar.
	const filteredClusters = filteredBySearchQuery(
		clusterSearchQuery,
		options.allClusters
	)
	const filteredTenants = filteredBySearchQuery(
		tenantSearchQuery,
		options.allTenants
	)
	const filteredNamespaces = filteredBySearchQuery(
		namespaceSearchQuery,
		options.allNamespaces
	)
	const filteredTopics = filteredBySearchQuery(
		topicSearchQuery,
		options.allTopics
	)
	const filteredProducers = filteredBySearchQuery(
		producerSearchQuery,
		options.allProducers
	)
	const filteredSubscriptions = filteredBySearchQuery(
		subscriptionSearchQuery,
		options.allSubscriptions
	)

	// We exclude or include specific filters based on the view level.
	const viewLevelOne = currentView === 'topic' || currentView === 'message'
	const viewLevelTwo =
		currentView === 'namespace' ||
		currentView === 'topic' ||
		currentView === 'message'
	const viewLevelThree =
		currentView === 'tenant' ||
		currentView === 'namespace' ||
		currentView === 'topic' ||
		currentView === 'message'

	return (
		<div className="flex flex-col">
			<Accordion>
				<AccordionSummary
					expandIcon={<ExpandMoreIcon />}
					aria-controls="panel1a-content"
				>
					<h3 className="filter-title">Clusters</h3>
				</AccordionSummary>
				<AccordionDetails>
					<CustomSearchbar
						placeholder={'Search Clusters'}
						setSearchQuery={setClusterSearchQuery}
					></CustomSearchbar>
					<div className="flex flex-col mt-4 filter-wrapper">
						{filteredClusters &&
							filteredClusters.length > 0 &&
							filteredClusters.map((item: string, index: number) => (
								<CustomCheckbox
									key={'checkbox-cluster' + index}
									text={item}
									id={item}
									topology={Topology.CLUSTER}
									selected={filters.cluster.includes(item) ? true : false}
								></CustomCheckbox>
							))}
					</div>
				</AccordionDetails>
			</Accordion>
			{viewLevelThree && (
				<Accordion>
					<AccordionSummary
						expandIcon={<ExpandMoreIcon />}
						aria-controls="panel1a-content"
					>
						<h3 className="filter-title">Tenants</h3>
					</AccordionSummary>
					<AccordionDetails>
						<CustomSearchbar
							placeholder={'Search Tenants'}
							setSearchQuery={setTenantSearchQuery}
						></CustomSearchbar>
						<div className="flex flex-col mt-4">
							{filteredTenants &&
								filteredTenants.length > 0 &&
								filteredTenants.map((item: string, index: number) => (
									<CustomCheckbox
										key={'checkbox-tenant' + index}
										text={item}
										id={item}
										topology={Topology.TENANT}
										selected={filters.tenant.includes(item) ? true : false}
									></CustomCheckbox>
								))}
						</div>
					</AccordionDetails>
				</Accordion>
			)}
			{viewLevelTwo && (
				<Accordion>
					<AccordionSummary
						expandIcon={<ExpandMoreIcon />}
						aria-controls="panel1a-content"
					>
						<h3 className="filter-title">Namespaces</h3>
					</AccordionSummary>
					<AccordionDetails>
						<CustomSearchbar
							placeholder={'Search Namespaces'}
							setSearchQuery={setNamespaceSearchQuery}
						></CustomSearchbar>
						<div className="flex flex-col mt-4 filter-wrapper">
							{filteredNamespaces &&
								filteredNamespaces.length > 0 &&
								filteredNamespaces.map((item: string, index: number) => (
									<CustomCheckbox
										key={'checkbox-namespace' + index}
										text={item}
										id={item}
										topology={Topology.NAMESPACE}
										selected={filters.namespace.includes(item) ? true : false}
									></CustomCheckbox>
								))}
						</div>
					</AccordionDetails>
				</Accordion>
			)}
			{viewLevelOne && (
				<>
					<Accordion>
						<AccordionSummary
							expandIcon={<ExpandMoreIcon />}
							aria-controls="panel1a-content"
						>
							<h3 className="filter-title">Topics</h3>
						</AccordionSummary>
						<AccordionDetails>
							<CustomSearchbar
								placeholder={'Search Topics'}
								setSearchQuery={setTopicSearchQuery}
							></CustomSearchbar>
							<div className="flex flex-col mt-4 filter-wrapper">
								{filteredTopics &&
									filteredTopics.length > 0 &&
									filteredTopics.map((item: string, index: number) => (
										<CustomCheckbox
											key={'checkbox-topic' + index}
											text={item}
											id={item}
											topology={Topology.TOPIC}
											selected={filters.topic.includes(item) ? true : false}
										></CustomCheckbox>
									))}
							</div>
						</AccordionDetails>
					</Accordion>
					<Accordion>
						<AccordionSummary
							expandIcon={<ExpandMoreIcon />}
							aria-controls="panel1a-content"
						>
							<h3 className="filter-title">Producers</h3>
						</AccordionSummary>
						<AccordionDetails>
							<CustomSearchbar
								placeholder={'Search Producers'}
								setSearchQuery={setProducerSearchQuery}
							></CustomSearchbar>
							<div className="flex flex-col mt-4 filter-wrapper">
								{filteredProducers &&
									filteredProducers.length > 0 &&
									filteredProducers.map((item: string, index: number) => (
										<CustomRadio
											key={'checkbox-topic' + index}
											text={item}
											id={item}
											topology={Topology.PRODUCER}
											selected={filters.producer.includes(item) ? true : false}
										></CustomRadio>
									))}
							</div>
						</AccordionDetails>
					</Accordion>
					<Accordion>
						<AccordionSummary
							expandIcon={<ExpandMoreIcon />}
							aria-controls="panel1a-content"
						>
							<h3 className="filter-title">Subscriptions</h3>
						</AccordionSummary>
						<AccordionDetails>
							<CustomSearchbar
								placeholder={'Search Subscriptions'}
								setSearchQuery={setSubscriptionSearchQuery}
							></CustomSearchbar>
							<div className="flex flex-col mt-4 filter-wrapper">
								{filteredSubscriptions &&
									filteredSubscriptions.length > 0 &&
									filteredSubscriptions.map((item: string, index: number) => (
										<CustomCheckbox
											key={'checkbox-topic' + index}
											text={item}
											id={item}
											topology={Topology.SUBSCRIPTION}
											selected={
												filters.subscription.includes(item) ? true : false
											}
										></CustomCheckbox>
									))}
							</div>
						</AccordionDetails>
					</Accordion>
				</>
			)}
		</div>
	)
}

export default CustomFilter
