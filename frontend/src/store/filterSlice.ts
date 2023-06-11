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
}

type UpdateSingleFilter = {
	filterName: 'cluster' | 'tenant' | 'namespace' | 'topic' | 'message'
	id: string
}

const initialState: FilterState = {
	cluster: [],
	tenant: [],
	namespace: [],
	topic: [],
	message: [],
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
		resetAllFilters: (state) => {
			state = initialState
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
export { selectCluster, selectNamespace, selectTenant, selectTopic }

export const {
	setCluster,
	setTenant,
	setNamespace,
	setTopic,
	addFilter,
	deleteFilter,
	resetAllFilters,
} = filterSlice.actions

export default filterSlice.reducer
