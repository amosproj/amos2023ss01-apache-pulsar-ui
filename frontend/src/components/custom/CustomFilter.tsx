// SPDX-License-Identifier: MIT
// SPDX-FileCopyrightText: 2010-2021 Dirk Riehle <dirk@riehle.org
// SPDX-FileCopyrightText: 2019 Georg Schwarz <georg. schwarz@fau.de>

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

const CustomFilter: React.FC<CustomFilterProps> = ({ currentView }) => {
	// Options are what we've got from apis so far.
	const options = useAppSelector(selectOptions)
	// filters are displayed in filters.
	const filters = useAppSelector(selectAllFilters)
	const [clusterSearchQuery, setClusterSearchQuery] = useState('')
	const [namespaceSearchQuery, setNamespaceSearchQuery] = useState('')
	const [tenantSearchQuery, setTenantSearchQuery] = useState('')
	const [topicSearchQuery, setTopicSearchQuery] = useState('')
	const [producerSearchQuery, setProducerSearchQuery] = useState('')
	const [subscriptionSearchQuery, setSubscriptionSearchQuery] = useState('')

	const filteredCheckboxes = (searchQuery: string, completeArray: string[]) => {
		let filteredArr = []
		filteredArr = completeArray.filter((item: string) => {
			return item.includes(searchQuery)
		})
		return filteredArr
	}

	const filteredClusters = filteredCheckboxes(
		clusterSearchQuery,
		options.allClusters
	)
	const filteredTenants = filteredCheckboxes(
		tenantSearchQuery,
		options.allTenants
	)
	const filteredNamespaces = filteredCheckboxes(
		namespaceSearchQuery,
		options.allNamespaces
	)
	const filteredTopics = filteredCheckboxes(topicSearchQuery, options.allTopics)
	const filteredProducers = filteredCheckboxes(
		producerSearchQuery,
		options.allProducers
	)
	const filteredSubscriptions = filteredCheckboxes(
		subscriptionSearchQuery,
		options.allSubscriptions
	)

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
									key={'checkbox-cluster' + Math.floor(Math.random() * 999999)}
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
								filteredTenants.map((item: string) => (
									<CustomCheckbox
										key={'checkbox-tenant' + Math.floor(Math.random() * 999999)}
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
								filteredNamespaces.map((item: string) => (
									<CustomCheckbox
										key={
											'checkbox-namespace' + Math.floor(Math.random() * 999999)
										}
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
									filteredTopics.map((item: string) => (
										<CustomCheckbox
											key={
												'checkbox-topic' + Math.floor(Math.random() * 999999)
											}
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
									filteredProducers.map((item: string) => (
										<CustomRadio
											key={
												'checkbox-topic' + Math.floor(Math.random() * 999999)
											}
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
									filteredSubscriptions.map((item: string) => (
										<CustomCheckbox
											key={
												'checkbox-topic' + Math.floor(Math.random() * 999999)
											}
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
