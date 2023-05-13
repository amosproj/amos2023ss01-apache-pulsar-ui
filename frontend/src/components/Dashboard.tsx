import Card from './Card'
import React, { useState } from 'react'
import CustomSearchbar from './custom/CustomSearchbar'
import FilterListIcon from '@mui/icons-material/FilterList'
import CustomFilter from './custom/CustomFilter'

const Dashboard: React.FC<DashboardProps> = ({ completeData, view }) => {
	const [searchQuery, setSearchQuery] = useState('')
	const [clusterQuery, setClusterQuery] = useState<string[]>([])
	const [namespaceQuery, setNamespaceQuery] = useState<string[]>([])
	const [topicQuery, setTopicQuery] = useState<string[]>([])

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
			namespaceQuery.length <= 0 &&
			topicQuery.length <= 0 &&
			!query
		) {
			let res: any[] = sampleData

			if (view == 'namespace') {
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
			const newTenants = newData
				.map((item) => item.tenants)
				.filter((el) => el.length > 0)
				.flat()

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

	const handleChange = (
		id: string,
		element: 'cluster' | 'namespace' | 'topic'
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

	const dashboardTitle = view + 's'

	return (
		<div className="flex main-card main-dashboard">
			<div className="primary-dashboard">
				<h2 className="text-black dashboard-title">
					Available {dashboardTitle}
				</h2>
				{dataFiltered &&
					dataFiltered.length > 0 &&
					dataFiltered.map(
						(
							item: SampleCluster | SampleTenant | SampleNamespace | SampleTopic
						) => (
							<a
								key={item.id + Math.floor(Math.random() * 999999)}
								href="#"
								//onClick={(e) => updateFilter(e, item)}
							>
								<Card data={item}></Card>
							</a>
						)
					)}
			</div>
			<div className="secondary-dashboard w-full">
				<CustomSearchbar setSearchQuery={setSearchQuery} />
				<div className="flex filters-wrapper">
					<h2 className="text-black dashboard-title">Filters</h2>
					<FilterListIcon style={{ fill: '#A4A4A4' }} />
				</div>
				<CustomFilter data={completeData} handleChange={handleChange} />
			</div>
		</div>
	)
}

export default Dashboard
