// SPDX-License-Identifier: MIT
// SPDX-FileCopyrightText: 2010-2021 Dirk Riehle <dirk@riehle.org
// SPDX-FileCopyrightText: 2019 Georg Schwarz <georg. schwarz@fau.de>

import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import axios from 'axios'
import { RootState } from '.'
import { modifyData } from './modifyData-temp'

export type View = {
	selectedNav: string | null
	filteredId: number | string | null
}

export type globalState = {
	showLP: boolean
	view: View
	data: Array<MessageList>
	endpoint: string
	rawClusterData: any
	rawTopicData: any
	clusterData: any
}

const initialState: globalState = {
	showLP: true,
	view: {
		selectedNav: null,
		filteredId: null,
	},
	data: [],
	endpoint: '',
	rawClusterData: [],
	rawTopicData: {},
	clusterData: [],
}

const backendInstance = axios.create({
	baseURL: 'http://localhost:8081/api',
	timeout: 1000,
})

const fetchRawClusterDataThunk = createAsyncThunk(
	'globalController/fetchData',
	async () => {
		const response = await backendInstance.get('/cluster')
		return response.data
	}
)

const fetchRawTopicDataThunk = createAsyncThunk(
	'globalController/fetchTopic',
	async () => {
		const response = await backendInstance.get('/topic/all')
		return response.data
	}
)

const combineAsyncThunk = createAsyncThunk(
	'globalController/combineData',
	async (_, thunkAPI) => {
		const { dispatch } = thunkAPI
		// dispatch both thunks and wait for them to complete
		console.log('dasdasd')
		await Promise.all([
			dispatch(fetchRawClusterDataThunk()),
			dispatch(fetchRawTopicDataThunk()),
		])
	}
)

// eslint-disable-next-line
const globalSlice = createSlice({
	name: 'globalControl',
	initialState,
	reducers: {
		moveToApp: (state) => {
			state.showLP = false
		},
		backToLP: () => initialState,
		setNav: (state, action: PayloadAction<string>) => {
			state.view.selectedNav = action.payload
		},
		setView: (state, action: PayloadAction<View>) => {
			state.view = action.payload
		},
		setData: (
			state: globalState,
			action: PayloadAction<Array<MessageList>>
		) => {
			state.data = action.payload
		},
		updateData: (state: globalState, action: PayloadAction<UpdateForData>) => {
			state.data.map((single: MessageList) => {
				if (single.id === action.payload.topic) {
					const tempId = action.payload.topic + (single.messages.length + 1)
					const newMessage = {
						id: tempId,
						value: action.payload.message,
						topic: action.payload.topic,
					}
					single.messages = [...single.messages, newMessage]
				}
				return single
			})
		},
		setEndpoint: (state: globalState, action: PayloadAction<string>) => {
			state.endpoint = action.payload
		},
	},
	extraReducers: (builder) => {
		builder.addCase(fetchRawClusterDataThunk.fulfilled, (state, action) => {
			state.rawClusterData = JSON.parse(JSON.stringify(action.payload))
		})
		builder.addCase(fetchRawClusterDataThunk.rejected, (state) => {
			console.log('fetch raw cluster data failed')
		})
		builder.addCase(fetchRawTopicDataThunk.fulfilled, (state, action) => {
			state.rawTopicData = JSON.parse(JSON.stringify(action.payload))
		})
		builder.addCase(fetchRawTopicDataThunk.rejected, (state) => {
			console.log('fetch raw topic data failed')
		})
		builder.addCase(combineAsyncThunk.fulfilled, (state, action) => {
			//combine raw data to meet dummy data structure and save it in clusterData
			state.clusterData = modifyData(state.rawClusterData, state.rawTopicData)
			console.log('clusterData now:')
			console.log(state.clusterData)
		})
		builder.addCase(combineAsyncThunk.rejected, (state, action) => {
			console.log('combine Async thunk failed')
			state.clusterData = []
			state.rawClusterData = []
			state.rawTopicData = {}
		})
	},
})

const { actions, reducer } = globalSlice

const selectData = (state: RootState): Array<MessageList> =>
	state.globalControl.data

const selectView = (state: RootState): View => state.globalControl.view

const selectShowLP = (state: RootState): boolean => state.globalControl.showLP

const selectEndpoint = (state: RootState): string =>
	state.globalControl.endpoint

const selectClusterData = (state: RootState): any =>
	state.globalControl.clusterData

export const {
	moveToApp,
	backToLP,
	setNav,
	setView,
	updateData,
	setData,
	setEndpoint,
} = actions

export {
	selectShowLP,
	selectEndpoint,
	selectData,
	selectView,
	selectClusterData,
	combineAsyncThunk,
}

export default reducer
