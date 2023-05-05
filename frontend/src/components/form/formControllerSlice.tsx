// SPDX-License-Identifier: MIT
// SPDX-FileCopyrightText: 2010-2021 Dirk Riehle <dirk@riehle.org
// SPDX-FileCopyrightText: 2019 Georg Schwarz <georg. schwarz@fau.de>

import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import axios from 'axios'
import { RootState } from '../../store'

export type formControllerState = {
	data: Array<MessageList>
	topic: string
	message: string
}

const initialState: formControllerState = {
	data: [],
	topic: '',
	message: '',
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

interface UpdateForData {
	message: string
	topic: string
}

const formControllerSlice = createSlice({
	name: 'formControl',
	initialState,
	reducers: {
		setData: (state, action: PayloadAction<Array<MessageList>>) => {
			state.data = action.payload
		},
		updateData: (state, action: PayloadAction<UpdateForData>) => {
			state.data.map((single) => {
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
		setTopic: (state, action: PayloadAction<string>) => {
			state.topic = action.payload
		},
		setMessage: (state, action: PayloadAction<string>) => {
			state.message = action.payload
		},
	},
	extraReducers: (builder) => {
		builder.addCase(fetchDataThunk.fulfilled, (state, action) => {
			state.data = action.payload
		})
		builder.addCase(fetchDataThunk.rejected, (state) => {
			state.data = []
			console.log('fetch data rejected')
		})
	},
})

const { actions, reducer } = formControllerSlice

const selectData = (state: RootState): Array<MessageList> =>
	state.formControl.data

const selectTopic = (state: RootState): string => state.formControl.topic

const selectMessage = (state: RootState): string => state.formControl.message

export const { updateData, setData, setTopic, setMessage } = actions

export { selectData, selectTopic, selectMessage, fetchDataThunk }

export default reducer
