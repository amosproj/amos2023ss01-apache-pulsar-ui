// SPDX-License-Identifier: MIT
// SPDX-FileCopyrightText: 2010-2021 Dirk Riehle <dirk@riehle.org
// SPDX-FileCopyrightText: 2019 Georg Schwarz <georg. schwarz@fau.de>

import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '.'

type FilterState = {
	cluster: string[]
	tenant: string[]
	namespace: string[]
	topic: string[]
}

const initialState: FilterState = {
	cluster: [],
	tenant: [],
	namespace: [],
	topic: [],
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

export const { setCluster, setTenant, setNamespace, setTopic } =
	filterSlice.actions

export default filterSlice.reducer
