import React from 'react'
import ClusterView from './views/ClusterView'
import NamespaceView from './views/NamespaceView'
import TopicView from './views/TopicView'
import MessageView from './views/MessageView'
import TenantView from './views/TenantView'
import {
	instanceOfSampleCluster,
	instanceOfSampleTenant,
	instanceOfSampleNamespace,
	instanceOfSampleTopic,
	instanceOfSampleMessage,
} from '../Helpers'

const Card: React.FC<CardProps> = ({ data, handleClick }) => {
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
