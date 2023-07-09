// SPDX-License-Identifier: MIT
// SPDX-FileCopyrightText: 2010-2021 Dirk Riehle <dirk@riehle.org
// SPDX-FileCopyrightText: 2019 Georg Schwarz <georg. schwarz@fau.de>

import React, { useEffect } from 'react'
import FilterListIcon from '@mui/icons-material/FilterList'
import CustomFilter from './custom/CustomFilter'
import { useAppDispatch } from '../store/hooks'
import { useNavigate } from 'react-router-dom'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

import {
	fetchOptionsThunk,
	resetAllFilters,
	updateFilterAccordingToNav,
} from '../store/filterSlice'
import { triggerRequest } from '../routes/requestTriggerSlice'
import { Button } from '@mui/material'
import { DashboardProps } from '../types'
import { Topology } from '../enum'

const Dashboard: React.FC<DashboardProps> = ({ children }) => {
	const dispatch = useAppDispatch()
	const navigate = useNavigate()

	useEffect(() => {
		// used to navigate directly from / to /cluster
		if (location.pathname === '/') navigate('/cluster')
		// fetch all filter options once beforehand
		dispatch(fetchOptionsThunk())
		dispatch(updateFilterAccordingToNav(location.pathname as Topology))
	}, [])

	/**
	 * Resets all filters and triggers another page request to update the currently displayed cards
	 */
	const resetFilters = () => {
		dispatch(resetAllFilters())
		dispatch(triggerRequest())
	}

	return (
		<div data-testid="main-dashboard" className="main-dashboard">
			<div className="primary-dashboard">{children}</div>
			<div className="secondary-dashboard">
				<Button
					variant={'contained'}
					className="reset-all-filter-button"
					onClick={() => resetFilters()}
				>
					Reset all filters
				</Button>
				<div className="filters-wrapper">
					<h2 className="dashboard-title">Filters</h2>
					<FilterListIcon style={{ fill: '#A4A4A4' }} />
				</div>
				<div className="filters-wrapper filters-wrapper-mobile">
					<Accordion>
						<AccordionSummary
							expandIcon={<ExpandMoreIcon />}
							aria-controls="panel1a-content"
						>
							<h3 className="filter-title">Filters</h3>
						</AccordionSummary>
						<AccordionDetails>
							<div className="flex flex-col mt-4">
								<CustomFilter currentView={location.pathname.slice(1)} />
							</div>
						</AccordionDetails>
					</Accordion>
				</div>
				<div className="desktop-filters">
					<CustomFilter currentView={location.pathname.slice(1)} />
				</div>
			</div>
		</div>
	)
}

export default Dashboard
