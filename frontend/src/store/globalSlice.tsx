// SPDX-License-Identifier: MIT
// SPDX-FileCopyrightText: 2023 Julian Tochman-Szewc <tochman-szewc@campus.tu-berlin.de>
// SPDX-FileCopyrightText: 2023 Shahraz Nasir <shahraz.nasir@campus.tu-berlin.de>
// SPDX-FileCopyrightText: 2023 Ziqi He <ziqi.he@fau.de>
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '.'
import { Topology } from '../enum'

export type View = {
	selectedNav: Topology
	filteredId: number | string | null
}

export type globalState = {
	view: View
}

const initialState: globalState = {
	view: {
		selectedNav: Topology.CLUSTER,
		filteredId: null,
	},
}

const globalSlice = createSlice({
	name: 'globalControl',
	initialState,
	reducers: {
		setNav: (state, action: PayloadAction<Topology>) => {
			state.view.selectedNav = action.payload
		},
		setView: (state, action: PayloadAction<View>) => {
			state.view = action.payload
		},
	},
})

const { actions, reducer } = globalSlice

const selectView = (state: RootState): View => state.globalControl.view

export const { setNav, setView } = actions

export { selectView }

export default reducer
