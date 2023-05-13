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
	data: SampleCluster | SampleTenant | SampleNamespace | SampleTopic
}

interface DashboardProps {
	completeData: Array<SampleCluster>
	view?: string | null
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

interface formProps {
	data: Array<MessageList>
	triggerUpdate(message: string, topic: string): void
}

interface ClusterViewProps {
	data: SampleCluster
}

interface NamespaceViewProps {
	data: SampleNamespace
}

interface TopicViewProps {
	data: SampleTopic
}

interface CustomFilterProps {
	data: Array<SampleCluster>
	handleChange: any
}

interface CustomSearchProps {
	setSearchQuery: any
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
	messagesTTL: string
	retentionPolicies: {
		retentionTimeInMinutes: number
		retentionSizeInMB: number
	}
}

type SampleTopic = {
	id: string
	localName: string
	namespace: string
	tenant: string
	cluster: string
	topicStatsDto: SampleTopicStats
	persistent: boolean
}

type SampleTopicStats = {
	subscriptions: Array<SampleSubscription>
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
