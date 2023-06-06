// SPDX-License-Identifier: MIT
// SPDX-FileCopyrightText: 2010-2021 Dirk Riehle <dirk@riehle.org
// SPDX-FileCopyrightText: 2019 Georg Schwarz <georg. schwarz@fau.de>

import { combineReducers } from '@reduxjs/toolkit'
import formControllerSlice from '../components/form/formControllerSlice'
import globalSlice from './globalSlice'

export default combineReducers({
	globalControl: globalSlice,
	formControl: formControllerSlice,
})
