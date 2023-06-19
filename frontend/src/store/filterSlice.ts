// SPDX-License-Identifier: MIT
// SPDX-FileCopyrightText: 2010-2021 Dirk Riehle <dirk@riehle.org
// SPDX-FileCopyrightText: 2019 Georg Schwarz <georg. schwarz@fau.de>

import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '.'
import axios from 'axios'
import { ResponseCluster } from '../components/pages/cluster'
import { ResponseTenant } from '../components/pages/tenant'
import { ResponseNamespace } from '../components/pages/namespace'
import { ResponseTopic } from '../components/pages/topic'

export type HierarchyInPulsar =
	| 'cluster'
	| 'tenant'
	| 'namespace'
	| 'topic'
	| 'message'
	| 'producer'
	| 'subscription'

export type FilterState = {
	cluster: string[]
	tenant: string[]
	namespace: string[]
	topic: string[]
	producer: string[]
	subscription: string[]
	message: string[]
	displayedOptions: {
		allClusters: string[]
		allTenants: string[]
		allNamespaces: string[]
		allTopics: string[]
		allProducers: string[]
		allSubscriptions: string[]
		allMessages: string[]
	}
	view: UpdateSingleFilter['filterName']
}

export type UpdateSingleFilter = {
	filterName: HierarchyInPulsar
	id: string
}

type UpdateDisplayedOptions = {
	// topologyLevel: 'cluster' | 'tenant' | 'namespace' | 'topic' | 'message'
	topologyLevel: HierarchyInPulsar
	options: string[]
}

const initialState: FilterState = {
	cluster: [],
	tenant: [],
	namespace: [],
	topic: [],
	producer: [],
	subscription: [],
	message: [],
	displayedOptions: {
		allClusters: [],
		allTenants: [],
		allNamespaces: [],
		allTopics: [],
		allProducers: [],
		allSubscriptions: [],
		allMessages: [],
	},
	view: 'cluster',
}

const backendInstance = axios.create({
	baseURL: 'http://localhost:8081/api',
	timeout: 5000,
})

const clusterOptionThunk = createAsyncThunk(
	'filterController/clusterOption',
	async () => {
		const response = await backendInstance.get('/cluster/all')
		return response.data
	}
)
const tenantOptionThunk = createAsyncThunk(
	'filterController/tenantOption',
	async () => {
		const response = await backendInstance.get('/tenant/all')
		return response.data
	}
)
const namespaceOptionThunk = createAsyncThunk(
	'filterController/namespaceOption',
	async () => {
		const response = await backendInstance.get('/namespace/all')
		return response.data
	}
)
const topicOptionThunk = createAsyncThunk(
	'filterController/topicOption',
	async () => {
		const response = await backendInstance.get('/topic/all')
		return response.data
	}
)
const fetchOptionsThunk = createAsyncThunk(
	'filterController/fetchOptions',
	async (_, thunkAPI) => {
		const { dispatch } = thunkAPI
		// dispatch both thunks and wait for them to complete
		await Promise.all([
			dispatch(clusterOptionThunk()),
			dispatch(tenantOptionThunk()),
			dispatch(namespaceOptionThunk()),
			dispatch(topicOptionThunk()),
		])
	}
)

const filterSlice = createSlice({
	name: 'filterControl',
	initialState,
	reducers: {
		setCluster: (state, action: PayloadAction<string[]>) => {
			state.cluster = action.payload
		},
		setTenant: (state, action: PayloadAction<string[]>) => {
			state.tenant = action.payload
		},
		setNamespace: (state, action: PayloadAction<string[]>) => {
			state.namespace = action.payload
		},
		setTopic: (state, action: PayloadAction<string[]>) => {
			state.topic = action.payload
		},
		setProducer: (state, action: PayloadAction<string[]>) => {
			state.producer = action.payload
		},
		setSubscription: (state, action: PayloadAction<string[]>) => {
			state.subscription = action.payload
		},
		// Adds query to one single filter (cluster, tenant, namespace, topic)
		addFilter: (state, action: PayloadAction<UpdateSingleFilter>) => {
			const filterName = action.payload.filterName
			state[filterName].push(action.payload.id)
		},
		// Adds query to one single
		addFilterWithRadio: (state, action: PayloadAction<UpdateSingleFilter>) => {
			const filterName = action.payload.filterName
			state[filterName] = []
			state[filterName].push(action.payload.id)
		},
		// Deletes query from one single filter (cluster, tenant, namespace, topic)
		deleteFilter: (state, action: PayloadAction<UpdateSingleFilter>) => {
			const filterName = action.payload.filterName
			const query = action.payload.id
			state[filterName] = state[filterName].filter((element) => {
				return element !== query
			})
		},
		addFilterByDrillDown: (
			state,
			action: PayloadAction<UpdateSingleFilter>
		) => {
			switch (action.payload.filterName) {
				case 'cluster':
					state.cluster = initialState.cluster
					state.cluster = [action.payload.id]
					break
				case 'tenant':
					state.tenant = initialState.tenant
					state.tenant = [action.payload.id]
					break
				case 'namespace':
					state.namespace = initialState.namespace
					state.namespace = [action.payload.id]
					break
				case 'topic':
					state.topic = initialState.topic
					state.topic = [action.payload.id]
					break
				case 'message':
					state.message = initialState.message
					state.message = [action.payload.id]
					break
				default:
					console.log(
						'wrong type for updateDisplayedOptions with' +
							action.payload.filterName +
							' ' +
							action.payload.id
					)
			}
		},
		resetAllFilters: (state) => {
			//to not accidently delete the displayed options:
			state.cluster = initialState.cluster
			state.tenant = initialState.tenant
			state.namespace = initialState.namespace
			state.topic = initialState.topic
			state.producer = initialState.producer
			state.subscription = initialState.subscription
			state.message = initialState.message
		},
		// the filtering of lower views do not apply to higher views,
		// those filters shall be reset when the user "goes up".
		updateFilterAccordingToNav: (
			state,
			action: PayloadAction<UpdateSingleFilter['filterName']>
		) => {
			const lastView = state.view
			const currentView = action.payload
			const pulsarHierarchyArr: UpdateSingleFilter['filterName'][] = [
				'cluster',
				'tenant',
				'namespace',
				'topic',
				'message',
			]
			const currentViewLevel = pulsarHierarchyArr.indexOf(currentView)
			const lastViewLevel = pulsarHierarchyArr.indexOf(lastView)
			// If the user goes to upper level in the pulasr hierarchy,
			// reset all filters below that "upper level".
			if (currentViewLevel < lastViewLevel) {
				const filtersToReset = pulsarHierarchyArr.slice(currentViewLevel + 1)
				// Resets all filters bellow the current view level.
				filtersToReset.forEach((filterName) => {
					console.log(filterName)
					state[filterName] = initialState[filterName]
				})
			}
			state.view = currentView
		},
	},
	extraReducers(builder) {
		builder.addCase(clusterOptionThunk.fulfilled, (state, action) => {
			const data: ResponseCluster = JSON.parse(JSON.stringify(action.payload))
			state.displayedOptions.allClusters = data.clusters
		})
		builder.addCase(tenantOptionThunk.fulfilled, (state, action) => {
			const data: ResponseTenant = JSON.parse(JSON.stringify(action.payload))
			state.displayedOptions.allTenants = data.tenants.map((item) => item.name)
		})
		builder.addCase(namespaceOptionThunk.fulfilled, (state, action) => {
			const data: ResponseNamespace = JSON.parse(JSON.stringify(action.payload))
			state.displayedOptions.allNamespaces = data.namespaces.map(
				(item) => item.id
			)
		})
		builder.addCase(topicOptionThunk.fulfilled, (state, action) => {
			const data: ResponseTopic = JSON.parse(JSON.stringify(action.payload))
			/*const producers: string[] = data.topics
				.flatMap((item) => item.producers)
				.flat()
				.filter((element, index) => {
					return producers.indexOf(element) === index
				})
			const subscriptions: string[] = data.topics
				.flatMap((item) => item.subscriptions)
				.flat()
				.filter((element, index) => {
					return producers.indexOf(element) === index
				})*/
			data.topics.forEach((topic) => {
				if (topic.producers) {
					state.displayedOptions.allProducers.push(...topic.producers)
					state.displayedOptions.allProducers =
						state.displayedOptions.allProducers
							.filter((e) => e !== 'undefined')
							.filter((element, index) => {
								return (
									state.displayedOptions.allProducers.indexOf(element) === index
								)
							})
				}
				if (topic.subscriptions) {
					state.displayedOptions.allSubscriptions.push(...topic.subscriptions)
					state.displayedOptions.allSubscriptions =
						state.displayedOptions.allSubscriptions
							.filter((e) => e !== 'undefined')
							.filter((element, index) => {
								return (
									state.displayedOptions.allSubscriptions.indexOf(element) ===
									index
								)
							})
				}
			})
			state.displayedOptions.allTopics = data.topics.map((item) => item.name)
		})
		builder.addCase(fetchOptionsThunk.fulfilled, (state) => {
			console.log('fetchOptions thunk worked')
		})
	},
})

// Selectors
const selectCluster = (state: RootState): string[] => {
	return state.filterControl.cluster
}
const selectTenant = (state: RootState): string[] => {
	return state.filterControl.tenant
}
const selectNamespace = (state: RootState): string[] => {
	return state.filterControl.namespace
}
const selectTopic = (state: RootState): string[] => {
	return state.filterControl.topic
}

const selectProducer = (state: RootState): string[] => {
	return state.filterControl.producer
}

const selectSubscription = (state: RootState): string[] => {
	return state.filterControl.subscription
}

const selectOptions = (
	state: RootState
): {
	allClusters: string[]
	allTenants: string[]
	allNamespaces: string[]
	allTopics: string[]
	allProducers: string[]
	allSubscriptions: string[]
	allMessages: string[]
} => {
	return state.filterControl.displayedOptions
}

const selectAllFilters = (
	state: RootState
): {
	cluster: string[]
	tenant: string[]
	namespace: string[]
	topic: string[]
	producer: string[]
	subscription: string[]
	message: string[]
} => {
	return {
		cluster: state.filterControl.cluster,
		tenant: state.filterControl.tenant,
		namespace: state.filterControl.namespace,
		topic: state.filterControl.topic,
		producer: state.filterControl.producer,
		subscription: state.filterControl.subscription,
		message: state.filterControl.message,
	}
}

export {
	selectCluster,
	selectNamespace,
	selectTenant,
	selectTopic,
	selectProducer,
	selectSubscription,
	selectOptions,
	selectAllFilters,
	fetchOptionsThunk,
}

export const {
	setCluster,
	setTenant,
	setNamespace,
	setTopic,
	setProducer,
	setSubscription,
	addFilter,
	addFilterWithRadio,
	deleteFilter,
	addFilterByDrillDown,
	resetAllFilters,
	updateFilterAccordingToNav,
} = filterSlice.actions

export default filterSlice.reducer
