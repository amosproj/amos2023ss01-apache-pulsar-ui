import Card from './Card'
import React, { useState } from 'react'
import CustomSearchbar from './custom/CustomSearchbar'
import FilterListIcon from '@mui/icons-material/FilterList'
import CustomFilter from './custom/CustomFilter'
import { useAppDispatch } from '../store/hooks'
import { setNav } from '../store/globalSlice'

const Dashboard: React.FC<DashboardProps> = ({
	completeData,
	completeMessages,
	view,
}) => {
	const [searchQuery, setSearchQuery] = useState('')
	const [clusterQuery, setClusterQuery] = useState<string[]>([])
	const [tenantQuery, setTenantQuery] = useState<string[]>([])
	const [namespaceQuery, setNamespaceQuery] = useState<string[]>([])
	const [topicQuery, setTopicQuery] = useState<string[]>([])
	const [messageQuery, setMessageQuery] = useState<string[]>([])
	const dispatch = useAppDispatch()

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

	const divideData = (sampleData: Array<SampleCluster>) => {
		const allTenants = sampleData
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

		return [allTenants, allNamespaces, allTopics]
	}

	const includeItemsByIds = (
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
				) => ids.includes(c.id)
			)
			return newSample
		} else return sample
	}

	const includeItemsByQuery = (
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
				) =>
					instanceOfSampleMessage(d)
						? d.payload.includes(query)
						: d.id.includes(query)
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

	const filterData = (
		query: string,
		sampleData: Array<SampleCluster>,
		sampleMessages: Array<SampleMessage>
	) => {
		if (
			clusterQuery.length <= 0 &&
			tenantQuery.length <= 0 &&
			namespaceQuery.length <= 0 &&
			topicQuery.length <= 0 &&
			messageQuery.length <= 0 &&
			!query
		) {
			let res:
				| Array<SampleCluster>
				| Array<SampleTenant>
				| Array<SampleNamespace>
				| Array<SampleTopic>
				| Array<SampleMessage> = sampleData

			const [allTenants, allNamespaces, allTopics] = divideData(res)

			if (view == 'tenant') {
				res = allTenants
			} else if (view == 'namespace') {
				res = allNamespaces
			} else if (view === 'topic') {
				res = allTopics
			} else if (view === 'message') {
				res = sampleMessages
			}

			return res
		} else {
			let newData = sampleData
			if (clusterQuery.length > 0) {
				newData = sampleData.filter((c: SampleCluster) =>
					clusterQuery.includes(c.id)
				)
			}

			let newTenants = newData
				.map((item) => item.tenants)
				.filter((el) => el.length > 0)
				.flat()

			newTenants = includeItemsByIds(tenantQuery, newTenants)

			let newNamespaces = newTenants
				.map((tenant) => tenant.namespaces)
				.filter((el) => el.length > 0)
				.flat()

			newNamespaces = includeItemsByIds(namespaceQuery, newNamespaces)

			let newTopics = newNamespaces
				.map((n) => n.topics)
				.filter((el) => el.length > 0)
				.flat()

			newTopics = includeItemsByIds(topicQuery, newTopics)

			let newMessages = getMessagesByFilters(
				newData,
				newTenants,
				newNamespaces,
				newTopics,
				sampleMessages
			)

			newMessages = includeItemsByIds(messageQuery, newMessages)

			if (view === 'cluster') {
				return includeItemsByQuery(query, newData)
			} else if (view === 'tenant') {
				return includeItemsByQuery(query, newTenants)
			} else if (view === 'namespace') {
				return includeItemsByQuery(query, newNamespaces)
			} else if (view === 'topic') {
				return includeItemsByQuery(query, newTopics)
			} else if (view === 'message') {
				return includeItemsByQuery(query, newMessages)
			}

			return newData
		}
	}

	let dataFiltered:
		| Array<SampleCluster>
		| Array<SampleTenant>
		| Array<SampleNamespace>
		| Array<SampleTopic>
		| Array<SampleMessage> = completeData

	if (view) {
		dataFiltered = filterData(searchQuery, completeData, completeMessages)
	}

	const handleClick = (
		e: React.MouseEvent<HTMLElement>,
		currentEl: SampleCluster | SampleTenant | SampleNamespace | SampleTopic
	) => {
		e.preventDefault()
		if (view === 'cluster') {
			const clusterId = currentEl.id
			handleChange(clusterId, view)
			dispatch(setNav('tenant'))
		} else if (view === 'tenant') {
			const tenantId = currentEl.id
			handleChange(tenantId, view)
			dispatch(setNav('namespace'))
		} else if (view === 'namespace') {
			const namespaceId = currentEl.id
			handleChange(namespaceId, view)
			dispatch(setNav('topic'))
		} else if (view === 'topic') {
			const topicId = currentEl.id
			handleChange(topicId, view)
			dispatch(setNav('message'))
		}
	}

	const handleChange = (
		id: string,
		element: 'cluster' | 'tenant' | 'namespace' | 'topic' | 'message'
	) => {
		let newArr = []
		if (element === 'cluster') {
			if (clusterQuery.includes(id)) {
				newArr = [...clusterQuery]
				newArr = newArr.filter((e) => e !== id)
			} else {
				newArr = [...clusterQuery, id]
			}
			setClusterQuery(newArr)
		} else if (element === 'tenant') {
			if (tenantQuery.includes(id)) {
				newArr = [...tenantQuery]
				newArr = newArr.filter((e) => e !== id)
			} else {
				newArr = [...tenantQuery, id]
			}
			setTenantQuery(newArr)
		} else if (element === 'namespace') {
			if (namespaceQuery.includes(id)) {
				newArr = [...namespaceQuery]
				newArr = newArr.filter((e) => e !== id)
			} else {
				newArr = [...namespaceQuery, id]
			}
			setNamespaceQuery(newArr)
		} else if (element === 'topic') {
			if (topicQuery.includes(id)) {
				newArr = [...topicQuery]
				newArr = newArr.filter((e) => e !== id)
			} else {
				newArr = [...topicQuery, id]
			}
			setTopicQuery(newArr)
		} else if (element === 'message') {
			if (messageQuery.includes(id)) {
				newArr = [...messageQuery]
				newArr = newArr.filter((e) => e !== id)
			} else {
				newArr = [...messageQuery, id]
			}
			console.log(newArr)
			setMessageQuery(newArr)
		}
	}

	const resetAllFilters = () => {
		setClusterQuery([])
		setTenantQuery([])
		setNamespaceQuery([])
		setTopicQuery([])
		setMessageQuery([])
	}

	const checkQueryLength = (
		currentView: 'cluster' | 'tenant' | 'namespace' | 'topic' | 'message'
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

	const dashboardTitle = view + 's'
	if (view) {
		return (
			<div
				data-testid="main-dashboard"
				className="flex main-card main-dashboard"
			>
				<div className="primary-dashboard">
					<h2 className="text-black dashboard-title">
						Available {dashboardTitle}
					</h2>
					{dataFiltered &&
						dataFiltered.length > 0 &&
						dataFiltered.map(
							(
								item:
									| SampleCluster
									| SampleTenant
									| SampleNamespace
									| SampleTopic
									| SampleMessage
							) => (
								<Card
									handleClick={handleClick}
									key={item.id + Math.floor(Math.random() * 999999)}
									data={item}
								></Card>
							)
						)}
				</div>
				<div className="secondary-dashboard w-full">
					<CustomSearchbar
						placeholder={'Search'}
						setSearchQuery={setSearchQuery}
					/>
					{checkQueryLength(view) && (
						<span
							className="reset-all-filter-button"
							onClick={() => resetAllFilters()}
						>
							Reset all filters
						</span>
					)}
					<div className="flex filters-wrapper">
						<h2 className="text-black dashboard-title">Filters</h2>
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
	} else {
		return (
			<div className="flex main-card main-dashboard">
				<div className="primary-dashboard">
					<h2 className="text-black dashboard-title">
						Welcome to Apache Pulsar UI
					</h2>
				</div>
			</div>
		)
	}
}

export default Dashboard
