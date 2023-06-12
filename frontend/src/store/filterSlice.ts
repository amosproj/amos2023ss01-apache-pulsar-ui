// SPDX-License-Identifier: MIT
// SPDX-FileCopyrightText: 2010-2021 Dirk Riehle <dirk@riehle.org
// SPDX-FileCopyrightText: 2019 Georg Schwarz <georg. schwarz@fau.de>

import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '.'

export type FilterState = {
	cluster: string[]
	tenant: string[]
	namespace: string[]
	topic: string[]
	message: string[]
	displayedOptions: {
		allClusters: string[]
		allTenants: string[]
		allNamespaces: string[]
		allTopics: string[]
		allMessages: string[]
	}
}

type UpdateSingleFilter = {
	filterName: 'cluster' | 'tenant' | 'namespace' | 'topic' | 'message'
	id: string
}

type UpdateDisplayedOptions = {
	topologyLevel: 'cluster' | 'tenant' | 'namespace' | 'topic' | 'message'
	options: string[]
}

const initialState: FilterState = {
	cluster: [],
	tenant: [],
	namespace: [],
	topic: [],
	message: [],
	displayedOptions: {
		allClusters: [],
		allTenants: [],
		allNamespaces: [],
		allTopics: [],
		allMessages: [],
	},
}

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
		// Adds query to one single filter (cluster, tenant, namespace, topic)
		addFilter: (state, action: PayloadAction<UpdateSingleFilter>) => {
			const filterName = action.payload.filterName
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
					state.cluster.push(action.payload.id)
					break
				case 'tenant':
					state.tenant = initialState.tenant
					state.tenant.push(action.payload.id)
					break
				case 'namespace':
					state.namespace = initialState.namespace
					state.namespace.push(action.payload.id)
					break
				case 'topic':
					state.topic = initialState.topic
					state.topic.push(action.payload.id)
					break
				case 'message':
					state.message = initialState.message
					state.message.push(action.payload.id)
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
			state.message = initialState.message
		},
		updateDisplayedOptions: (
			state,
			action: PayloadAction<UpdateDisplayedOptions>
		) => {
			switch (action.payload.topologyLevel) {
				case 'cluster':
					state.displayedOptions.allClusters = action.payload.options
					break
				case 'tenant':
					state.displayedOptions.allTenants = action.payload.options
					break
				case 'namespace':
					state.displayedOptions.allNamespaces = action.payload.options
					break
				case 'topic':
					state.displayedOptions.allTopics = action.payload.options
					break
				case 'message':
					state.displayedOptions.allMessages = action.payload.options
					break
				default:
					console.log(
						'wrong type for updateDisplayedOptions with' +
							action.payload.topologyLevel +
							' ' +
							action.payload.options
					)
			}
		},
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

const selectOptions = (
	state: RootState
): {
	allClusters: string[]
	allTenants: string[]
	allNamespaces: string[]
	allTopics: string[]
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
	message: string[]
} => {
	return {
		cluster: state.filterControl.cluster,
		tenant: state.filterControl.tenant,
		namespace: state.filterControl.namespace,
		topic: state.filterControl.topic,
		message: state.filterControl.message,
	}
}

export {
	selectCluster,
	selectNamespace,
	selectTenant,
	selectTopic,
	selectOptions,
	selectAllFilters,
}

export const {
	setCluster,
	setTenant,
	setNamespace,
	setTopic,
	addFilter,
	deleteFilter,
	addFilterByDrillDown,
	resetAllFilters,
	updateDisplayedOptions,
} = filterSlice.actions

export default filterSlice.reducer
