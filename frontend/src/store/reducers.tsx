// SPDX-License-Identifier: MIT
// SPDX-FileCopyrightText: 2010-2021 Dirk Riehle <dirk@riehle.org
// SPDX-FileCopyrightText: 2019 Georg Schwarz <georg. schwarz@fau.de>

import { combineReducers } from '@reduxjs/toolkit'
import globalSlice from './globalSlice'
import filterSlice from './filterSlice'
import requestTriggerSlice from '../routes/requestTriggerSlice'

export default combineReducers({
	globalControl: globalSlice,
	filterControl: filterSlice,
	triggerControl: requestTriggerSlice,
})
