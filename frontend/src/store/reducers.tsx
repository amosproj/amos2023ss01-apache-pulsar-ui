// SPDX-License-Identifier: MIT
// SPDX-FileCopyrightText: 2010-2021 Dirk Riehle <dirk@riehle.org
// SPDX-FileCopyrightText: 2019 Georg Schwarz <georg. schwarz@fau.de>

import { combineReducers } from '@reduxjs/toolkit'
import formControllerSlice from '../components/form/formControllerSlice'
import counterReducer from '../components/sampleCounter/counterSlice'
import globalSlice from './globalSlice'
import endpointSlice from '../components/landing/endpointSlice'

export default combineReducers({
	globalControl: globalSlice,
	formControl: formControllerSlice,
	counter: counterReducer,
	endpoint: endpointSlice,
})
