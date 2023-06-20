// SPDX-License-Identifier: MIT
// SPDX-FileCopyrightText: 2010-2021 Dirk Riehle <dirk@riehle.org
// SPDX-FileCopyrightText: 2019 Georg Schwarz <georg. schwarz@fau.de>

import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../../store'

export type RequestTriggerState = {
	trigger: boolean
}

const initialState: RequestTriggerState = {
	trigger: false,
}

// Slice is mainly used to trigger the reload of the pages.
// Separated from the other Slices to specifically avoid any sudden state changes by other reducers etc that would mess with the reload.
const requestTriggerSlice = createSlice({
	name: 'triggerControl',
	initialState,
	reducers: {
		triggerRequest: (state) => {
			state.trigger = !state.trigger
		},
	},
})

const { actions, reducer } = requestTriggerSlice

const selectTrigger = (state: RootState): boolean =>
	state.triggerControl.trigger

export const { triggerRequest } = actions

export { selectTrigger }

export default reducer
