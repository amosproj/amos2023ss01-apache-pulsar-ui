// SPDX-License-Identifier: MIT
// SPDX-FileCopyrightText: 2010-2021 Dirk Riehle <dirk@riehle.org
// SPDX-FileCopyrightText: 2019 Georg Schwarz <georg. schwarz@fau.de>

import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import axios from 'axios'
import { RootState } from '.'

export type View = {
	selectedNav: string | null
	filteredId: number | string | null
}

export type globalState = {
	showLP: boolean
	view: View
	data: Array<MessageList>
	endpoint: string
}

const initialState: globalState = {
	showLP: true,
	view: {
		selectedNav: null,
		filteredId: null,
	},
	data: [],
	endpoint: '',
}

const backendInstance = axios.create({
	baseURL: 'https://127.0.0.1/8081',
	timeout: 1000,
})

const fetchDataThunk = createAsyncThunk(
	'formController/fetchData',
	async () => {
		const response = await backendInstance.get('/data')
		return response.data
	}
)

// eslint-disable-next-line
const globalSlice = createSlice({
	name: 'globalControl',
	initialState,
	reducers: {
		moveToApp: (state) => {
			state.showLP = false
			console.log('sdsd')
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
})

const { actions, reducer } = globalSlice

const selectData = (state: RootState): Array<MessageList> =>
	state.globalControl.data

const selectView = (state: RootState): View => state.globalControl.view

const selectShowLP = (state: RootState): boolean => state.globalControl.showLP

const selectEndpoint = (state: RootState): string =>
	state.globalControl.endpoint

export const {
	moveToApp,
	backToLP,
	setNav,
	setView,
	updateData,
	setData,
	setEndpoint,
} = actions

export { selectShowLP, selectEndpoint, selectData, selectView, fetchDataThunk }

export default reducer
