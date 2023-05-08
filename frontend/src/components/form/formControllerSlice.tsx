// SPDX-License-Identifier: MIT
// SPDX-FileCopyrightText: 2010-2021 Dirk Riehle <dirk@riehle.org
// SPDX-FileCopyrightText: 2019 Georg Schwarz <georg. schwarz@fau.de>

import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import axios from 'axios'
import { RootState } from '../../store'

export type FormControllerState = {
	data: Array<MessageList>
	topic: string
	message: string
}

const initialState: FormControllerState = {
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

// eslint-disable-next-line
const formControllerSlice = createSlice({
	name: 'formControl',
	initialState,
	reducers: {
		setData: (
			state: FormControllerState,
			action: PayloadAction<Array<MessageList>>
		) => {
			state.data = action.payload
		},
		updateData: (
			state: FormControllerState,
			action: PayloadAction<UpdateForData>
		) => {
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
		setTopic: (state: FormControllerState, action: PayloadAction<string>) => {
			state.topic = action.payload
		},
		setMessage: (state: FormControllerState, action: PayloadAction<string>) => {
			state.message = action.payload
		},
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
