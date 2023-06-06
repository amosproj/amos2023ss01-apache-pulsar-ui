// SPDX-License-Identifier: MIT
// SPDX-FileCopyrightText: 2010-2021 Dirk Riehle <dirk@riehle.org
// SPDX-FileCopyrightText: 2019 Georg Schwarz <georg. schwarz@fau.de>

export function instanceOfSampleCluster(
	object:
		| SampleCluster
		| SampleTenant
		| SampleNamespace
		| SampleTopic
		| SampleMessage
): object is SampleCluster {
	if (object) {
		return 'tenants' in object
	} else return false
}

export function instanceOfSampleNamespace(
	object:
		| SampleCluster
		| SampleTenant
		| SampleNamespace
		| SampleTopic
		| SampleMessage
): object is SampleNamespace {
	if (object) {
		return 'topics' in object
	} else return false
}

export function instanceOfSampleTopic(
	object:
		| SampleCluster
		| SampleTenant
		| SampleNamespace
		| SampleTopic
		| SampleMessage
): object is SampleTopic {
	if (object) {
		return 'topicStatsDto' in object
	} else return false
}

export function instanceOfSampleTenant(
	object:
		| SampleCluster
		| SampleTenant
		| SampleNamespace
		| SampleTopic
		| SampleMessage
): object is SampleTenant {
	if (object) {
		return 'tenantInfo' in object
	} else return false
}

export function instanceOfSampleMessage(
	object:
		| SampleCluster
		| SampleTenant
		| SampleNamespace
		| SampleTopic
		| SampleMessage
): object is SampleMessage {
	if (object) {
		return 'payload' in object
	} else return false
}

export const flattenClustersToTenants = (myClusters: Array<SampleCluster>) => {
	return myClusters
		.map((cluster) => cluster.tenants)
		.filter((el) => el.length > 0)
		.flat()
}

export const flattenTenantsToNamespaces = (myTenants: Array<SampleTenant>) => {
	return myTenants
		.map((tenant) => tenant.namespaces)
		.filter((el) => el.length > 0)
		.flat()
}

export const flattenNamespacesToTopics = (
	myNamespaces: Array<SampleNamespace>
) => {
	return myNamespaces
		.map((namespace) => namespace.topics)
		.filter((el) => el.length > 0)
		.flat()
}
