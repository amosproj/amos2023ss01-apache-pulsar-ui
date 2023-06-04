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
	completeData: Array<SampleCluster>
	completeMessages: Array<SampleMessage>
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
	changeFunc: (
		id: string,
		element: 'cluster' | 'tenant' | 'namespace' | 'topic' | 'message'
	) => void
	selected: boolean
}

interface formProps {
	data: Array<MessageList>
	triggerUpdate(message: string, topic: string): void
}

interface ClusterViewProps {
	data: SampleCluster
	handleClick: (
		e: React.MouseEvent<HTMLElement>,
		currentEl: SampleCluster | SampleTenant | SampleNamespace | SampleTopic
	) => void
}

interface TenantViewProps {
	data: SampleTenant
	handleClick: (
		e: React.MouseEvent<HTMLElement>,
		currentEl: SampleCluster | SampleTenant | SampleNamespace | SampleTopic
	) => void
}

interface NamespaceViewProps {
	data: SampleNamespace
	handleClick: (
		e: React.MouseEvent<HTMLElement>,
		currentEl: SampleCluster | SampleTenant | SampleNamespace | SampleTopic
	) => void
}

interface TopicViewProps {
	data: SampleTopic
	handleClick: (
		e: React.MouseEvent<HTMLElement>,
		currentEl: SampleCluster | SampleTenant | SampleNamespace | SampleTopic
	) => void
}

interface MessageViewProps {
	data: SampleMessage
}

interface CustomFilterProps {
	selectedClusters: string[]
	selectedTenants: string[]
	selectedNamespaces: string[]
	selectedTopics: string[]
	selectedMessages: string[]
	data: Array<SampleCluster>
	messages: Array<SampleMessage>
	handleChange: (
		id: string,
		element: 'cluster' | 'tenant' | 'namespace' | 'topic' | 'message'
	) => void
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

//Slice interfaces
interface CounterState {
	value: number
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
