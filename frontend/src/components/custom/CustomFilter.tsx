// SPDX-License-Identifier: MIT
// SPDX-FileCopyrightText: 2010-2021 Dirk Riehle <dirk@riehle.org
// SPDX-FileCopyrightText: 2019 Georg Schwarz <georg. schwarz@fau.de>

import React, { useState } from 'react'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import CustomCheckbox from './CustomCheckbox'
import CustomSearchbar from './CustomSearchbar'
import { useAppSelector } from '../../store/hooks'
import { selectAllFilters, selectOptions } from '../../store/filterSlice'

const CustomFilter: React.FC<CustomFilterProps> = ({
	messages,
	currentView,
}) => {
	const options = useAppSelector(selectOptions)
	const filters = useAppSelector(selectAllFilters)
	const [clusterSearchQuery, setClusterSearchQuery] = useState('')
	const [namespaceSearchQuery, setNamespaceSearchQuery] = useState('')
	const [tenantSearchQuery, setTenantSearchQuery] = useState('')
	const [topicSearchQuery, setTopicSearchQuery] = useState('')
	const [messageSearchQuery, setMessageSearchQuery] = useState('')

	/*
	function instanceOfSampleMessage(
		object:
			| SampleCluster
			| SampleTenant
			| SampleNamespace
			| SampleTopic
			| SampleMessage
	): object is SampleMessage {
		return 'payload' in object
	}

	function instanceOfSampleTopic(
		object:
			| SampleCluster
			| SampleTenant
			| SampleNamespace
			| SampleTopic
			| SampleMessage
	): object is SampleTopic {
		return 'topicStatsDto' in object
	}
	*/
	/*
	const allTenants = options.allTenants

	const allNamespaces = options.allNamespaces

	const allTopics = options.allTopics

	const filteredCheckboxes = (
		searchQuery: string,
		completeArray:
			| Array<SampleMessage>
			| Array<SampleCluster>
			| Array<SampleTenant>
			| Array<SampleNamespace>
			| Array<SampleTopic>
			| any
	) => {
		if (searchQuery === '') {
			return completeArray
		} else {
			let filteredArr = []
			filteredArr = completeArray.filter(
				(
					d:
						| SampleCluster
						| SampleTenant
						| SampleNamespace
						| SampleTopic
						| SampleMessage
				) => {
					if (instanceOfSampleMessage(d)) {
						return d.payload.includes(searchQuery)
					} else if (instanceOfSampleTopic(d)) {
						return d.localName.includes(searchQuery)
					} else return d.id.includes(searchQuery)
				}
			)
			return filteredArr
		}
	}

	const filteredClusters = filteredCheckboxes(clusterSearchQuery, data)
	const filteredTenants = filteredCheckboxes(tenantSearchQuery, allTenants)
	const filteredNamespaces = filteredCheckboxes(
		namespaceSearchQuery,
		allNamespaces
	)
	const filteredTopics = filteredCheckboxes(topicSearchQuery, allTopics)
	const filteredMessages = filteredCheckboxes(messageSearchQuery, messages)
	*/
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
					<div className="flex flex-col mt-4">
						{options.allClusters &&
							options.allClusters.length > 0 &&
							options.allClusters.map((item: string, index: number) => (
								<CustomCheckbox
									key={'checkbox-cluster' + Math.floor(Math.random() * 999999)}
									text={item}
									id={item}
									typology={'cluster'}
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
							{options.allTenants &&
								options.allTenants.length > 0 &&
								options.allTenants.map((item: string) => (
									<CustomCheckbox
										key={'checkbox-tenant' + Math.floor(Math.random() * 999999)}
										text={item}
										id={item}
										typology={'tenant'}
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
						<div className="flex flex-col mt-4">
							{options.allNamespaces &&
								options.allNamespaces.length > 0 &&
								options.allNamespaces.map((item: string) => (
									<CustomCheckbox
										key={
											'checkbox-namespace' + Math.floor(Math.random() * 999999)
										}
										text={item}
										id={item}
										typology={'namespace'}
										selected={filters.namespace.includes(item) ? true : false}
									></CustomCheckbox>
								))}
						</div>
					</AccordionDetails>
				</Accordion>
			)}
			{viewLevelOne && (
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
						<div className="flex flex-col mt-4">
							{options.allTopics &&
								options.allTopics.length > 0 &&
								options.allTopics.map((item: string) => (
									<CustomCheckbox
										key={'checkbox-topic' + Math.floor(Math.random() * 999999)}
										text={item}
										id={item}
										typology={'topic'}
										selected={filters.topic.includes(item) ? true : false}
									></CustomCheckbox>
								))}
						</div>
					</AccordionDetails>
				</Accordion>
			)}
			{currentView === 'message' && (
				<Accordion>
					<AccordionSummary
						expandIcon={<ExpandMoreIcon />}
						aria-controls="panel1a-content"
					>
						<h3 className="filter-title">Messages</h3>
					</AccordionSummary>
					<AccordionDetails>
						<CustomSearchbar
							placeholder={'Search Messages'}
							setSearchQuery={setMessageSearchQuery}
						></CustomSearchbar>
						<div className="flex flex-col mt-4">
							{options.allMessages &&
								options.allMessages.length > 0 &&
								options.allMessages.map((item: string) => (
									<CustomCheckbox
										key={
											'checkbox-message' + Math.floor(Math.random() * 999999)
										}
										text={item}
										id={item}
										typology={'message'}
										selected={filters.message.includes(item) ? true : false}
									></CustomCheckbox>
								))}
						</div>
					</AccordionDetails>
				</Accordion>
			)}
		</div>
	)
}

export default CustomFilter
