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

const backendInstance = axios.create({
	baseURL: 'http://localhost:8081/api',
	timeout: 1000,
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
			state.message = initialState.message
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
	fetchOptionsThunk,
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
} = filterSlice.actions

export default filterSlice.reducer
