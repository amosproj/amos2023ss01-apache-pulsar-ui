// SPDX-License-Identifier: MIT
// SPDX-FileCopyrightText: 2010-2021 Dirk Riehle <dirk@riehle.org
// SPDX-FileCopyrightText: 2019 Georg Schwarz <georg. schwarz@fau.de>

import React, { useState } from 'react'
import CustomSearchbar from './custom/CustomSearchbar'
import FilterListIcon from '@mui/icons-material/FilterList'
import CustomFilter from './custom/CustomFilter'
import { useAppDispatch } from '../store/hooks'
import { setNav } from '../store/globalSlice'
import {
	instanceOfSampleTopic,
	instanceOfSampleMessage,
	flattenClustersToTenants,
	flattenNamespacesToTopics,
	flattenTenantsToNamespaces,
} from '../Helpers'
import { Routes, Route, Link, Navigate, Outlet } from 'react-router-dom'
import ClusterGroup from './pages/cluster'
import NamespaceGroup from './pages/namespace'
import TenantGroup from './pages/tenant'
import TopicGroup from './pages/topic'
import { FilterState, addFilter, resetAllFilters } from '../store/filterSlice'
// import {
// 	setCluster,
// 	setTenant,
// 	setNamespace,
// 	setTopic,
// 	addFilter,
// 	deleteFilter,
// } from '../store/filterSlice'

const Dashboard: React.FC<DashboardProps> = ({
	completeData,
	completeMessages,
	view,
	children,
}) => {
	const [searchQuery, setSearchQuery] = useState('')
	const [clusterQuery, setClusterQuery] = useState<string[]>([])
	const [tenantQuery, setTenantQuery] = useState<string[]>([])
	const [namespaceQuery, setNamespaceQuery] = useState<string[]>([])
	const [topicQuery, setTopicQuery] = useState<string[]>([])
	const [messageQuery, setMessageQuery] = useState<string[]>([])
	const dispatch = useAppDispatch()

	/*
	const divideData = (sampleData: Array<SampleCluster>) => {
		if (view == 'tenant') {
			return allTenants
		} else if (view == 'namespace') {
			return allNamespaces
		} else if (view === 'topic') {
			return allTopics
		} else if (view === 'message') {
			return completeMessages
		} else return sampleData
	}

	const includeItemsByFilterQuery = (
		ids: string[],
		sample:
			| any
			| Array<SampleCluster>
			| Array<SampleTenant>
			| Array<SampleNamespace>
			| Array<SampleTopic>
			| Array<SampleMessage>
	) => {
		if (ids.length > 0) {
			let newSample = []
			newSample = sample.filter(
				(
					c:
						| SampleCluster
						| SampleTenant
						| SampleNamespace
						| SampleTopic
						| SampleMessage
				) =>
					instanceOfSampleTopic(c)
						? ids.includes(c.localName)
						: ids.includes(c.id)
			)
			return newSample
		} else return sample
	}

	const includeItemsBySearchQuery = (
		query: string,
		sample:
			| any
			| Array<SampleCluster>
			| Array<SampleTenant>
			| Array<SampleNamespace>
			| Array<SampleTopic>
			| Array<SampleMessage>
	) => {
		if (query) {
			return sample.filter(
				(
					d:
						| SampleCluster
						| SampleTenant
						| SampleNamespace
						| SampleTopic
						| SampleMessage
				) => {
					if (instanceOfSampleMessage(d)) {
						return d.payload.includes(query)
					} else if (instanceOfSampleTopic(d)) {
						return d.localName.includes(query)
					} else return d.id.includes(query)
				}
			)
		} else return sample
	}

	const getMessagesByFilters = (
		sampleClusters: Array<SampleCluster>,
		sampleTenants: Array<SampleTenant>,
		sampleNamespaces: Array<SampleNamespace>,
		sampleTopics: Array<SampleTopic>,
		sampleMessages: Array<SampleMessage>
	) => {
		const newDataIds = sampleClusters.map((c: SampleCluster) => c.id)
		const newTenantsIds = sampleTenants.map((t: SampleTenant) => t.id)
		const newNamespacesIds = sampleNamespaces.map((n: SampleNamespace) => n.id)
		const newTopicsIds = sampleTopics.map((t: SampleTopic) => t.id)
		let newMessages = []
		newMessages = sampleMessages.filter(function (m: SampleMessage) {
			return (
				newDataIds.includes(m.cluster) &&
				newTenantsIds.includes(m.tenant) &&
				newNamespacesIds.includes(m.namespace) &&
				newTopicsIds.includes(m.topic)
			)
		})
		return newMessages
	}

	const applySearchbarQuery = (
		searchQuery: string,
		clusterData: Array<SampleCluster>,
		tenantData: Array<SampleTenant>,
		namespaceData: Array<SampleNamespace>,
		topicData: Array<SampleTopic>,
		messageData: Array<SampleMessage>
	) => {
		if (view === 'cluster') {
			return includeItemsBySearchQuery(searchQuery, clusterData)
		} else if (view === 'tenant') {
			return includeItemsBySearchQuery(searchQuery, tenantData)
		} else if (view === 'namespace') {
			return includeItemsBySearchQuery(searchQuery, namespaceData)
		} else if (view === 'topic') {
			return includeItemsBySearchQuery(searchQuery, topicData)
		} else if (view === 'message') {
			return includeItemsBySearchQuery(searchQuery, messageData)
		} else return clusterData
	}
	*/
	/*
		const filterData = (
			query: string,
			sampleData: Array<SampleCluster>,
			sampleMessages: Array<SampleMessage>
		) => {
			//Case 1: no filter or search is applied
			if (
				clusterQuery.length <= 0 &&
				tenantQuery.length <= 0 &&
				namespaceQuery.length <= 0 &&
				topicQuery.length <= 0 &&
				messageQuery.length <= 0 &&
				!query
			) {
				return divideData(sampleData)
			} //Case 2: a filter or search is applied
			else {
				//We select only the Clusters included in the cluster query state (clusterQuery)
				const newClusters = includeItemsByFilterQuery(clusterQuery, sampleData)
				//We dig deeper and get the Tenants of the filtered Clusters, we then flatten the array
				let newTenants = flattenClustersToTenants(newClusters)
				//We select only the Tenants included in the tenant query state (tenantQuery)
				newTenants = includeItemsByFilterQuery(tenantQuery, newTenants)
				//We dig deeper and get the Namespaces of the filtered Tenants, we then flatten the array
				let newNamespaces = flattenTenantsToNamespaces(newTenants)
				//We select only the Namespaces included in the namespace query state (namespaceQuery)
				newNamespaces = includeItemsByFilterQuery(namespaceQuery, newNamespaces)
				//We dig deeper and get the Topics of the filtered Namespaces, we then flatten the array
				let newTopics = flattenNamespacesToTopics(newNamespaces)
				//We select only the Topics included in the topic query state (topicQuery)
				newTopics = includeItemsByFilterQuery(topicQuery, newTopics)
				//In the function below, we use the ids of the filtered Clusters, Tenants,
				//Namespaces, and Topics to derive inderctly which messages need to be displayed
				let newMessages = getMessagesByFilters(
					newClusters,
					newTenants,
					newNamespaces,
					newTopics,
					sampleMessages
				)
				//Finally, we select only the Messages included in the message query state (messageQuery)
				newMessages = includeItemsByFilterQuery(messageQuery, newMessages)
	
				//Lastly, we use the applySearchbarQuery function to filter our new data based
				//on what's inserted in the main searchbar
				const newData = applySearchbarQuery(
					query,
					newClusters,
					newTenants,
					newNamespaces,
					newTopics,
					newMessages
				)
	
				return newData
			}
		}
	*/
	/*
		let dataFiltered:
			| Array<SampleCluster>
			| Array<SampleTenant>
			| Array<SampleNamespace>
			| Array<SampleTopic>
			| Array<SampleMessage> = completeData
	
		if (view) {
			//This is the data that will be displayed in the frontend, it is the output of our "filterData" function
			dataFiltered = filterData(searchQuery, completeData, completeMessages)
		}
	*/
	//This function moves from one view to another on click, it takes the id of the clicked element, and
	//uses this information to set the clicked id as selected filter in the next view by using the "handleChange" function
	const handleClick = (
		e: React.MouseEvent<HTMLElement>,
		currentEl: SampleCluster | SampleTenant | SampleNamespace | SampleTopic
	) => {
		e.preventDefault()
		//Save ID
		let selectedId = currentEl.id
		if (instanceOfSampleTopic(currentEl)) {
			selectedId = currentEl.localName
		}
		if (view === 'cluster') {
			//Update filters
			handleChange(selectedId, view)
			//Switch view
			dispatch(setNav('tenant'))
		} else if (view === 'tenant') {
			handleChange(selectedId, view)
			dispatch(setNav('namespace'))
		} else if (view === 'namespace') {
			handleChange(selectedId, view)
			dispatch(setNav('topic'))
		} else if (view === 'topic') {
			handleChange(selectedId, view)
			dispatch(setNav('message'))
		}
	}

	//This function adds the selected id to the query state variables, in this way
	//we keep track on what's included in the filter
	const handleChange = (
		id: string,
		filterName: 'cluster' | 'tenant' | 'namespace' | 'topic' | 'message'
	) => {
		dispatch(addFilter({ filterName: filterName, id: id }))
	}

	const resetFilters = () => {
		dispatch(resetAllFilters())
	}

	/*
	//This function should decide wether to display the "Reset all filters" button on a certain view
	//or not, this is necessary because a user could be f.e. on a Topic View, apply some filters for the
	//Topics, and then switch back to the Cluster View, in this case the button should disappear
	const checkQueryLength = (
		currentView:
			| 'cluster'
			| 'tenant'
			| 'namespace'
			| 'topic'
			| 'message'
			| null
			| string
			| undefined
	) => {
		if (currentView === 'cluster' && clusterQuery.length > 0) {
			return true
		} else if (
			currentView === 'tenant' &&
			(tenantQuery.length > 0 || clusterQuery.length > 0)
		) {
			return true
		} else if (
			currentView === 'namespace' &&
			(namespaceQuery.length > 0 ||
				tenantQuery.length > 0 ||
				clusterQuery.length > 0)
		) {
			return true
		} else if (
			currentView === 'topic' &&
			(topicQuery.length > 0 ||
				namespaceQuery.length > 0 ||
				tenantQuery.length > 0 ||
				clusterQuery.length > 0)
		) {
			return true
		} else if (
			currentView === 'message' &&
			(messageQuery.length > 0 ||
				topicQuery.length > 0 ||
				namespaceQuery.length > 0 ||
				tenantQuery.length > 0 ||
				clusterQuery.length > 0)
		) {
			return true
		} else return false
	}
*/

	//const dashboardTitle = view + 's'

	return (
		<div data-testid="main-dashboard" className="main-dashboard">
			<div className="primary-dashboard">{children}</div>
			<div className="secondary-dashboard">
				<CustomSearchbar
					placeholder={'Search'}
					setSearchQuery={setSearchQuery}
				/>
				<span
					className="reset-all-filter-button"
					onClick={() => resetFilters()}
				>
					Reset all filters
				</span>
				<div className="filters-wrapper">
					<h2 className="dashboard-title">Filters</h2>
					<FilterListIcon style={{ fill: '#A4A4A4' }} />
				</div>
				<CustomFilter
					selectedClusters={clusterQuery}
					selectedTenants={tenantQuery}
					selectedNamespaces={namespaceQuery}
					selectedTopics={topicQuery}
					selectedMessages={messageQuery}
					messages={completeMessages}
					data={completeData}
					handleChange={handleChange}
					currentView={view}
				/>
			</div>
		</div>
	)
}

export default Dashboard
