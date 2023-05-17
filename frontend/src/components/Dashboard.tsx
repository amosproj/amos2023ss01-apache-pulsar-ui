import Card from './Card'
import React, { useState } from 'react'
import CustomSearchbar from './custom/CustomSearchbar'
import FilterListIcon from '@mui/icons-material/FilterList'
import CustomFilter from './custom/CustomFilter'
import { useAppDispatch } from '../store/hooks'
import { setNav } from '../store/globalSlice'

const Dashboard: React.FC<DashboardProps> = ({ completeData, view }) => {
	const [searchQuery, setSearchQuery] = useState('')
	const [clusterQuery, setClusterQuery] = useState<string[]>([])
	const [tenantQuery, setTenantQuery] = useState<string[]>([])
	const [namespaceQuery, setNamespaceQuery] = useState<string[]>([])
	const [topicQuery, setTopicQuery] = useState<string[]>([])
	const dispatch = useAppDispatch()

	const filterData = (query: string, sampleData: Array<SampleCluster>) => {
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
		if (
			clusterQuery.length <= 0 &&
			tenantQuery.length <= 0 &&
			namespaceQuery.length <= 0 &&
			topicQuery.length <= 0 &&
			!query
		) {
			let res:
				| Array<SampleCluster>
				| Array<SampleTenant>
				| Array<SampleNamespace>
				| Array<SampleTopic> = sampleData

			if (view == 'tenant') {
				res = allTenants
			} else if (view == 'namespace') {
				res = allNamespaces
			} else if (view === 'topic') {
				res = allTopics
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

			if (tenantQuery.length > 0) {
				newTenants = newTenants.filter((c: SampleTenant) =>
					tenantQuery.includes(c.id)
				)
			}

			let newNameSpaces = newTenants
				.map((tenant) => tenant.namespaces)
				.filter((el) => el.length > 0)
				.flat()

			if (namespaceQuery.length > 0) {
				newNameSpaces = newNameSpaces.filter((c: SampleNamespace) =>
					namespaceQuery.includes(c.id)
				)
			}

			let newTopics = newNameSpaces
				.map((n) => n.topics)
				.filter((el) => el.length > 0)
				.flat()

			if (topicQuery.length > 0) {
				newTopics = newTopics.filter((c: SampleTopic) =>
					topicQuery.includes(c.id)
				)
			}

			if (view === 'cluster') {
				if (query) {
					return newData.filter((d: SampleCluster) => d.id.includes(query))
				} else return newData
			} else if (view === 'tenant') {
				if (query) {
					return newTenants.filter((d: SampleTenant) => d.id.includes(query))
				} else return newTenants
			} else if (view === 'namespace') {
				if (query) {
					return newNameSpaces.filter((d: SampleNamespace) =>
						d.id.includes(query)
					)
				} else return newNameSpaces
			} else if (view === 'topic') {
				if (query) {
					return newTopics.filter((d: SampleTopic) => d.id.includes(query))
				} else return newTopics
			} else return newData
		}
	}

	const dataFiltered:
		| Array<SampleCluster>
		| Array<SampleTenant>
		| Array<SampleNamespace>
		| Array<SampleTopic> = filterData(searchQuery, completeData)

	const handleClick = (
		e: any,
		currentEl: SampleCluster | SampleTenant | SampleNamespace | SampleTopic,
		currentView: 'cluster' | 'tenant' | 'namespace' | 'topic'
	) => {
		e.preventDefault()
		if (currentView === 'cluster') {
			const clusterId = currentEl.id
			handleChange(clusterId, currentView)
			dispatch(setNav('tenant'))
		} else if (currentView === 'tenant') {
			const tenantId = currentEl.id
			handleChange(tenantId, currentView)
			dispatch(setNav('namespace'))
		} else if (currentView === 'namespace') {
			const namespaceId = currentEl.id
			handleChange(namespaceId, currentView)
			dispatch(setNav('topic'))
		} else if (currentView === 'topic') {
			const topicId = currentEl.id
			handleChange(topicId, currentView)
			dispatch(setNav(currentView))
		} else return
	}

	const handleChange = (
		id: string,
		element: 'cluster' | 'tenant' | 'namespace' | 'topic'
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
		}
	}

	const resetAllFilters = () => {
		setClusterQuery([])
		setTenantQuery([])
		setNamespaceQuery([])
		setTopicQuery([])
	}

	/*const resetClusterFilters = (e: any) => {
		e.preventDefault()
		setClusterQuery([])
	}

	const resetNamespaceFilters = (e: any) => {
		e.preventDefault()
		setNamespaceQuery([])
	}

	const resetTopicFilters = (e: any) => {
		e.preventDefault()
		setTopicQuery([])
	}*/

	const checkQueryLength = (
		currentView: 'cluster' | 'tenant' | 'namespace' | 'topic'
	) => {
		if (currentView === 'cluster' && clusterQuery.length > 0) {
			return true
		} else if (currentView === 'tenant' && tenantQuery.length > 0) {
			return true
		} else if (currentView === 'namespace' && namespaceQuery.length > 0) {
			return true
		} else if (currentView === 'topic' && topicQuery.length > 0) {
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
							) => (
								<a
									key={item.id + Math.floor(Math.random() * 999999)}
									href="#"
									onClick={(e) => handleClick(e, item, view)}
								>
									<Card data={item}></Card>
								</a>
							)
						)}
				</div>
				<div className="secondary-dashboard w-full">
					<CustomSearchbar setSearchQuery={setSearchQuery} />
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
