import React from 'react'
import ClusterView from './views/ClusterView'
import NamespaceView from './views/NamespaceView'
import TopicView from './views/TopicView'
import MessageView from './views/MessageView'
import TenantView from './views/TenantView'

const Card: React.FC<CardProps> = ({ data, handleClick }) => {
	function instanceOfSampleCluster(
		object:
			| SampleCluster
			| SampleTenant
			| SampleNamespace
			| SampleTopic
			| SampleMessage
	): object is SampleCluster {
		return 'tenants' in object
	}

	function instanceOfSampleNamespace(
		object:
			| SampleCluster
			| SampleTenant
			| SampleNamespace
			| SampleTopic
			| SampleMessage
	): object is SampleNamespace {
		return 'topics' in object
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

	function instanceOfSampleTenant(
		object:
			| SampleCluster
			| SampleTenant
			| SampleNamespace
			| SampleTopic
			| SampleMessage
	): object is SampleTenant {
		return 'tenantInfo' in object
	}

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

	return (
		<div className="main-card">
			{instanceOfSampleCluster(data) ? (
				<ClusterView handleClick={handleClick} data={data}></ClusterView>
			) : instanceOfSampleTenant(data) ? (
				<TenantView handleClick={handleClick} data={data}></TenantView>
			) : instanceOfSampleNamespace(data) ? (
				<NamespaceView handleClick={handleClick} data={data}></NamespaceView>
			) : instanceOfSampleTopic(data) ? (
				<TopicView handleClick={handleClick} data={data}></TopicView>
			) : instanceOfSampleMessage(data) ? (
				<MessageView data={data}></MessageView>
			) : (
				<div></div>
			)}
		</div>
	)
}

export default Card
