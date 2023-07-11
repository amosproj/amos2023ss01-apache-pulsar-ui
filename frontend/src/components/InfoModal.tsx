// SPDX-License-Identifier: MIT
// SPDX-FileCopyrightText: 2010-2021 Dirk Riehle <dirk@riehle.org
// SPDX-FileCopyrightText: 2019 Georg Schwarz <georg. schwarz@fau.de>

import * as React from 'react'
import { Box, Modal, IconButton, Button } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import ChevronRight from '@mui/icons-material/ChevronRight'
import InfoRoundedIcon from '@mui/icons-material/InfoRounded'
import logo from '../assets/images/team-logo-no-margins.png'
import FilterListIcon from '@mui/icons-material/FilterList'
import BarChartIcon from '@mui/icons-material/BarChart'
import SearchIcon from '@mui/icons-material/Search'

/**
 * InfoModal is a React component that provides an informative modal interface.
 * It handles opening and closing of the modal and displays information about the project mission.
 *
 * @component
 * @returns The rendered InfoModal component.
 */
export const InfoModal: React.FC = () => {
	const [open, setOpen] = React.useState(false)

	const handleClickOpen = () => {
		setOpen(true)
	}

	const handleClose = () => {
		setOpen(false)
	}

	return (
		<div className="info-modal-wrapper">
			<Button
				startIcon={<InfoRoundedIcon />}
				onClick={handleClickOpen}
				style={{ color: 'white' }}
			></Button>
			<Modal
				open={open}
				onClose={handleClose}
				aria-labelledby="modal-modal-title"
				aria-describedby="modal-modal-description"
			>
				<Box className="modal-box">
					<Box className="modal-box-inner flex">
						<IconButton className="close-modal-button" onClick={handleClose}>
							<CloseIcon />
						</IconButton>
						<div className="modal-content items-center">
							<img className="info-logo" src={logo} alt="logo" />
							<div className="project-description flex flex-col items-center">
								<h2 className="modal-title">Mission</h2>
								<p>
									Our mission consists of building a Web-UI that can easily be
									used by users that have some experience with managing and
									maintaining Apache Pulsar installations to understand and work
									on their infrastructure
								</p>
							</div>
							<div className="triple-icon-text">
								<div className="single-icon-text">
									<SearchIcon />
									<p>
										Explore clusters, tenants, namespace, and topics by drilling
										at different topology levels.
									</p>
								</div>
								<div className="single-icon-text">
									<BarChartIcon />
									<p>
										View and analyze both general and detailed real-time
										information about clusters of your interest.
									</p>
								</div>
								<div className="single-icon-text">
									<FilterListIcon />
									<p>
										Use the filters listed in the dashboard to customize your
										search and get data of your interest.
									</p>
								</div>
							</div>
							<Button
								className="more-info-button"
								endIcon={<ChevronRight />}
								variant={'contained'}
							>
								<a
									href="https://github.com/amosproj/amos2023ss01-apache-pulsar-ui/wiki/User-Documentation"
									target="blank"
								>
									Learn More
								</a>
							</Button>
						</div>
					</Box>
				</Box>
			</Modal>
		</div>
	)
}
