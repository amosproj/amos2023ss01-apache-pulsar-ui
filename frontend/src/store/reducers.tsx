// SPDX-License-Identifier: MIT
// SPDX-FileCopyrightText: 2023 Julian Tochman-Szewc <tochman-szewc@campus.tu-berlin.de>
// SPDX-FileCopyrightText: 2023 Shahraz Nasir <shahraz.nasir@campus.tu-berlin.de>
// SPDX-FileCopyrightText: 2023 Ziqi He <ziqi.he@fau.de>
import { combineReducers } from '@reduxjs/toolkit'
import globalSlice from './globalSlice'
import filterSlice from './filterSlice'
import requestTriggerSlice from '../routes/requestTriggerSlice'

export default combineReducers({
	globalControl: globalSlice,
	filterControl: filterSlice,
	triggerControl: requestTriggerSlice,
})
