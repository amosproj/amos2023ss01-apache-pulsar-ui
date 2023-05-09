// SPDX-License-Identifier: MIT
// SPDX-FileCopyrightText: 2010-2021 Dirk Riehle <dirk@riehle.org
// SPDX-FileCopyrightText: 2019 Georg Schwarz <georg. schwarz@fau.de>

import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../../store'

export type FormControllerState = {
	topic: string
	message: string
}

const initialState: FormControllerState = {
	topic: '',
	message: '',
}

// eslint-disable-next-line
const formControllerSlice = createSlice({
	name: 'formControl',
	initialState,
	reducers: {
		setTopic: (state: FormControllerState, action: PayloadAction<string>) => {
			state.topic = action.payload
		},
		setMessage: (state: FormControllerState, action: PayloadAction<string>) => {
			state.message = action.payload
		},
	},
})

const { actions, reducer } = formControllerSlice

const selectTopic = (state: RootState): string => state.formControl.topic

const selectMessage = (state: RootState): string => state.formControl.message

export const { setTopic, setMessage } = actions

export { selectTopic, selectMessage }

export default reducer
