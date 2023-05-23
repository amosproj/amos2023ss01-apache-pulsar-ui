import React, { useState } from 'react'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import CustomCheckbox from './CustomCheckbox'
import CustomSearchbar from './CustomSearchbar'

const CustomFilter: React.FC<CustomFilterProps> = ({
	data,
	handleChange,
	selectedClusters,
	selectedTenants,
	selectedNamespaces,
	selectedTopics,
	selectedMessages,
	messages,
	currentView,
}) => {
	const [clusterSearchQuery, setClusterSearchQuery] = useState('')
	const [namespaceSearchQuery, setNamespaceSearchQuery] = useState('')
	const [tenantSearchQuery, setTenantSearchQuery] = useState('')
	const [topicSearchQuery, setTopicSearchQuery] = useState('')
	const [messageSearchQuery, setMessageSearchQuery] = useState('')

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

	const allTenants = data
		.map((item) => item.tenants)
		.filter((el) => el.length > 0)
		.flat()

	const allNamespaces = allTenants
		.map((tenant) => tenant.namespaces)
		.filter((el) => el.length > 0)
		.flat()

	const allTopics = allNamespaces
		.map((namespace) => namespace.topics)
		.filter((el) => el.length > 0)
		.flat()

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
				) =>
					instanceOfSampleMessage(d)
						? d.payload.includes(searchQuery)
						: d.id.includes(searchQuery)
			)
			console.log(filteredArr)
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
						{filteredClusters &&
							filteredClusters.length > 0 &&
							filteredClusters.map((item: SampleCluster) => (
								<CustomCheckbox
									key={item.id + Math.floor(Math.random() * 999999)}
									text={item.id}
									id={item.id}
									typology={'cluster'}
									changeFunc={handleChange}
									selected={selectedClusters.includes(item.id) ? true : false}
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
								filteredTenants.map((item: SampleTenant) => (
									<CustomCheckbox
										key={item.id + Math.floor(Math.random() * 999999)}
										text={item.id}
										id={item.id}
										typology={'tenant'}
										changeFunc={handleChange}
										selected={selectedTenants.includes(item.id) ? true : false}
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
							{filteredNamespaces &&
								filteredNamespaces.length > 0 &&
								filteredNamespaces.map((item: SampleNamespace) => (
									<CustomCheckbox
										key={item.id + Math.floor(Math.random() * 999999)}
										text={item.id}
										id={item.id}
										typology={'namespace'}
										changeFunc={handleChange}
										selected={
											selectedNamespaces.includes(item.id) ? true : false
										}
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
							{filteredTopics &&
								filteredTopics.length > 0 &&
								filteredTopics.map((item: SampleTopic) => (
									<CustomCheckbox
										key={item.id + Math.floor(Math.random() * 999999)}
										text={item.id}
										id={item.id}
										typology={'topic'}
										changeFunc={handleChange}
										selected={selectedTopics.includes(item.id) ? true : false}
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
							{filteredMessages &&
								filteredMessages.length > 0 &&
								filteredMessages.map((item: SampleMessage) => (
									<CustomCheckbox
										key={item.id + Math.floor(Math.random() * 999999)}
										text={item.payload}
										id={item.id}
										typology={'message'}
										changeFunc={handleChange}
										selected={selectedMessages.includes(item.id) ? true : false}
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
