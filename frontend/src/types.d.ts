// SPDX-License-Identifier: MIT
// SPDX-FileCopyrightText: 2023 Julian Tochman-Szewc <tochman-szewc@campus.tu-berlin.de>
// SPDX-FileCopyrightText: 2023 Shahraz Nasir <shahraz.nasir@campus.tu-berlin.de>
// SPDX-FileCopyrightText: 2023 Ziqi He <ziqi.he@fau.de>
import { Topology } from './enum'

declare global {
	interface DashboardProps {
		children: ReactNode
	}

	interface FilterItem {
		id: string
		name: string
	}

	interface CustomCheckboxProps {
		id: string
		text: string
		topology: Topology
		selected: boolean
	}

	interface ClusterInfo {
		name: string
		numberOfTenants: number
		numberOfNamespaces: number
	}

	interface TenantInfo {
		name: string
		tenantInfo: {
			adminRoles: string[]
			allowedClusters: string[]
		}
		numberOfNamespaces: number
		numberOfTopics: number
	}

	interface NamespaceInfo {
		id: string
		tenant: string
		numberOfTopics: number
	}

	interface TopicInfo {
		name: string
		namespace: string
		tenant: string
		subscriptions: string[]
		producers: string[]
		messagesSendToTopic: number
	}

	interface ClusterDetail {
		name: string
		tenants: string[]
		brokers: string[]
		amountOfBrokers: number
		brokerServiceUrl: string
		serviceUrl: string
	}

	interface TenantDetail {
		name: string
		namespaces: string[]
		tenantInfo: {
			adminRoles: string[]
			allowedClusters: string[]
		}
	}

	interface NamespaceDetail {
		id: string
		topics: string[]
		tenant: string
		bundlesData: {
			boundaries: string[]
			numBundles: number
		}
		amountOfTopics: number
		messagesTTL: number
		retentionPolicies: {
			retentionTimeInMinutes: number
			retentionSizeInMB: number
		}
	}

	interface TopicDetail {
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
		schemaInfos: SchemaInfo[]
		persistent: boolean
	}

	interface SchemaInfo {
		name: string
		version: number
		type: string
		properties: {
			additionalProp1: string
			additionalProp2: string
			additionalProp3: string
		}
		schemaDefinition: string
		timestamp: string
	}

	interface ProducerDetails {
		id: number
		name: string
		messagesDto: MessageDto[]
		amountOfMessages: number
		address: string
		averageMsgSize: number
		clientVersion: string
		connectedSince: string
	}

	interface MessageDto {
		messageId: string
		topic: string
		payload: string
		schema: string
		namespace: string
		tenant: string
		publishTime: number
		producer: string
	}

	interface ConsumerDetails {
		name: string
		address: string
		availablePermits: number
		bytesOutCounter: number
		clientVersion: string
		connectedSince: string
		lastAckedTimestamp: number
		lastConsumedTimestamp: number
		messageOutCounter: number
		unackedMessages: number
		blockedConsumerOnUnackedMsgs: boolean
	}

	interface MessageStandard {
		id: string
	}

	interface ClusterViewProps {
		data: ClusterInfo
	}

	interface TenantViewProps {
		data: TenantInfo
	}

	interface NamespaceViewProps {
		data: NamespaceInfo
	}

	interface TopicViewProps {
		data: TopicInfo
	}

	interface MessageViewProps {
		data: MessageInfo
	}
	interface MessageInfo {
		messageId: string
		topic: string
		payload: string
		schema: string
		namespace: string
		tenant: string
		publishTime: number
		producer: string
	}

	interface CustomFilterProps {
		currentView:
			| Topology.CLUSTER
			| Topology.TENANT
			| Topology.NAMESPACE
			| Topology.TOPIC
			| undefined
			| null
			| string
	}

	interface CustomSearchProps {
		setSearchQuery: React.Dispatch<React.SetStateAction<string>>
		placeholder: string
	}

	interface UpdateForData {
		message: string
		topic: string
	}
}
