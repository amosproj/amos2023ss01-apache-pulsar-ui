import React from 'react'
import ClusterView from './views/ClusterView'
import NamespaceView from './views/NamespaceView'
import TopicView from './views/TopicView'
import TenantView from './views/TenantView'

const Card: React.FC<CardProps> = ({ data }) => {
	function instanceOfSampleCluster(
		object: SampleCluster | SampleTenant | SampleNamespace | SampleTopic
	): object is SampleCluster {
		return 'tenants' in object
	}

	function instanceOfSampleNamespace(
		object: SampleCluster | SampleTenant | SampleNamespace | SampleTopic
	): object is SampleNamespace {
		return 'topics' in object
	}

	function instanceOfSampleTopic(
		object: SampleCluster | SampleTenant | SampleNamespace | SampleTopic
	): object is SampleTopic {
		return 'topicStatsDto' in object
	}

	function instanceOfSampleTenant(
		object: SampleCluster | SampleTenant | SampleNamespace | SampleTopic
	): object is SampleTenant {
		return 'tenantInfo' in object
	}

	return (
		<div className="main-card">
			{instanceOfSampleCluster(data) ? (
				<ClusterView data={data}></ClusterView>
			) : instanceOfSampleTenant(data) ? (
				<TenantView data={data}></TenantView>
			) : instanceOfSampleNamespace(data) ? (
				<NamespaceView data={data}></NamespaceView>
			) : instanceOfSampleTopic(data) ? (
				<TopicView data={data}></TopicView>
			) : (
				<div></div>
			)}
		</div>
	)
}

export default Card
