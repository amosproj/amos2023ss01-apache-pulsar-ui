// SPDX-License-Identifier: MIT
// SPDX-FileCopyrightText: 2010-2021 Dirk Riehle <dirk@riehle.org
// SPDX-FileCopyrightText: 2019 Georg Schwarz <georg. schwarz@fau.de>

// Demo interfaces (MessageList was for Topics, Message needs to be updated)
interface MessageList {
	id: string
	name: string
	messages: Array<Message>
}

interface Message {
	id: string
	value: string
}

// Component Prop Interfaces
interface CardProps {
	data:
		| SampleCluster
		| SampleTenant
		| SampleNamespace
		| SampleTopic
		| SampleMessage
	handleClick: (
		e: React.MouseEvent<HTMLElement>,
		currentEl: SampleCluster | SampleTenant | SampleNamespace | SampleTopic
	) => void
}

interface DashboardProps {
	completeMessages: Array<SampleMessage>
	children: ReactNode
	view?:
		| 'cluster'
		| 'tenant'
		| 'namespace'
		| 'topic'
		| 'message'
		| string
		| null
}

interface CustomAccordionProps {
	data: Array<MessageList>
}

interface CustomSelectProps<T> {
	data: Array<MessageList>
	onChange: (event: SelectChangeEvent<T>) => void
	value: T
	label: string
	error: boolean
}

interface CustomCheckboxProps {
	id: string
	text: string
	typology: 'cluster' | 'tenant' | 'namespace' | 'topic' | 'message'
	selected: boolean
}

interface formProps {
	data: Array<MessageList>
	triggerUpdate(message: string, topic: string): void
}

interface ClusterInfo {
	id: string
}

interface TenantInfo {
	name: string
	tenantInfo: {
		adminRoles: string[]
		allowedClusters: string[]
	}
}

interface NamespaceInfo {
	id: string
	tenant: string
}

interface TopicInfo {
	name: string
	namespace: string
	tenant: string
}
interface ClusterDetail {
	name: string
	tenants: string[]
	brokers: string[]
	amountOfTenants: number
	amountOfBrokers: number
	brokerServiceUrl: string
	serviceUrl: string
}

interface TenantDetail {
	name: string
	namespaces: string[]
	amountOfNamespaces: number
	tenantInfo: {
		adminRoles: string[]
		allowedClusters: string[]
	}
}

interface NamespaceDetail {
	id: string
	topics: string[]
	tenant: string
	amountOfTopics: number
	bundlesData: {
		boundaries: string[]
		numBundles: number
	}
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
	messagesDto: [
		{
			messageId: string
			topic: string
			payload: string
			schema: string
			namespace: string
			tenant: string
			publishTime: number
			producer: string
		}
	]
	persistent: boolean
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
	data: SampleMessage
}

interface CustomFilterProps {
	messages: Array<SampleMessage>
	currentView:
		| 'cluster'
		| 'tenant'
		| 'namespace'
		| 'topic'
		| 'message'
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

// Data Types
type SampleCluster = {
	id: string
	tenants: Array<SampleTenant>
	brokers: Array<string>
	bookies?: Array<string>
	amountOfTenants: number
	amountOfNamespaces: number
	amountOfTopics: number
	amountOfBrokers: number
	brokerServiceUrl: string
	serviceUrl: string
}

type SampleTenant = {
	id: string
	namespaces: Array<SampleNamespace>
	amountOfNamespaces: number
	amountOfTopics: number
	cluster: string
	tenantInfo: { adminRoles: Array<string>; allowedClusters: Array<string> }
}

type SampleNamespace = {
	id: string
	topics: Array<SampleTopic>
	cluster: string
	tenant: string
	amountOfTopics: number
	bundlesData: { boundaries: Array<string>; numBundles: number }
	messagesTTL: number | null
	retentionPolicies: {
		retentionTimeInMinutes: number
		retentionSizeInMB: number
	}
}

type SampleTopic = {
	id: string
	name: string
	localName: string
	namespace: string
	tenant: string
	cluster: string
	topicStatsDto: SampleTopicStats
	persistent: boolean
}

type SampleTopicStats = {
	subscriptions: Array<string>
	producers: Array<string>
	numberSubscriptions: number
	numberProducers: number
	producedMesages: number
	consumedMessages: number
	averageMessageSize: number
	storageSize: number
}

type SampleSubscription = {
	name: string
	consumers: Array<string>
	numberConsumers: number
}

type SampleMessage = {
	id: string
	payload: string
	schema: string
	cluster: string
	tenant: string
	namespace: string
	topic: string
	publishTime: string
}
