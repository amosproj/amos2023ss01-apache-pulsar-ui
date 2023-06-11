// SPDX-License-Identifier: MIT
// SPDX-FileCopyrightText: 2010-2021 Dirk Riehle <dirk@riehle.org>
// SPDX-FileCopyrightText: 2019 Georg Schwarz <georg.schwarz@fau.de>

interface Topic {
	id: string
	cluster: string
	name: string
	localName: string
	namespace: string
	tenant: string
	ownerBroker: string
	topicStatsDto: {
		subscriptions: string[]
		producers: string[]
		numberSubscriptions: number
		numberProducers: number
		producedMesages: number
		consumedMessages: number
		averageMessageSize: number
		storageSize: number
	}
	producedMessages: number
	consumedMessages: number
	messagesDto: []
	persistent: boolean
}

interface TopicData {
	topics: Array<Topic>
}

/**
 * Takes in standard cluster data from sprint release 5 and converts it to dummy data structure
 * @param cluster
 * @returns modified data
 */
/*export const modifyData = (
	clusters: Array<SampleCluster>,
	topics: TopicData
): Array<SampleCluster> => {
	const newData = clusters.map((cluster: SampleCluster) => {
		const clusterCopy = { ...cluster }
		let newCluster = addClusterAndTenant(clusterCopy)
		newCluster = replaceTopicStrings(clusterCopy, topics)
		return newCluster
	})

	return newData
}
*/
/**
 * Takes in standard cluster from sprint release 5 and converts it to dummy data structure
 * @param cluster
 * @returns modified cluster
 */
/*
const addClusterAndTenant = (cluster: SampleCluster): SampleCluster => {
	// Add 'cluster' property to tenants
	cluster.tenants = cluster.tenants.map((tenant) => {
		// Add 'cluster' property to tenant
		const tenantWithCluster = { ...tenant, cluster: cluster.id }

		// Add 'cluster' and 'tenant' property to namespaces
		tenantWithCluster.namespaces = tenant.namespaces.map((namespace) => ({
			...namespace,
			cluster: cluster.id,
			tenant: tenant.id,
		}))

		return tenantWithCluster
	})

	return cluster
}

const replaceTopicStrings = (
	cluster: SampleCluster,
	topics: TopicData
): SampleCluster => {
	const topicsMap = new Map(topics.topics.map((topic) => [topic.name, topic]))

	// Replace topic strings with topic objects. non strings stay the same
	cluster.tenants.forEach((tenant) => {
		tenant.namespaces.forEach((namespace) => {
			namespace.topics = namespace.topics.map((topicName) => {
				if (typeof topicName !== 'string') return topicName
				const topic = topicsMap.get(topicName)
				if (topic) return topic
				else return topicName
			})
			const filteredTopics: string[] = []
			namespace.topics = namespace.topics.filter((topic) => {
				const pass = typeof topic !== 'string'
				if (!pass) {
					filteredTopics.push(topic)
				}
				return pass
			})
			if (!filteredTopics) console.log('Filtered out topics: ', filteredTopics)
		})
	})

	return cluster
}
*/
