// SPDX-License-Identifier: MIT
// SPDX-FileCopyrightText: 2010-2021 Dirk Riehle <dirk@riehle.org>
// SPDX-FileCopyrightText: 2019 Georg Schwarz <georg.schwarz@fau.de>

import { PayloadAction, createSlice } from '@reduxjs/toolkit'

export type endpointState = {
	endpoint: string
	isEndpointError: boolean
}

const initialState: endpointState = {
	endpoint: '',
	isEndpointError: true,
}

const endpointSlice = createSlice({
	name: 'endpoint',
	initialState,
	reducers: {
		setEndpoint: (state: endpointState, action: PayloadAction<string>) => {
			// The correctness of endpoint will be checked in the <EndpointForm/> component.
			// Here the isEndpointError is for conditional rendering.
			// When the endpoint is passed to the reducer, the landing page will be gone.
			state.endpoint = action.payload
			state.isEndpointError = false
		},
	},
})

export const { setEndpoint } = endpointSlice.actions
export default endpointSlice.reducer
