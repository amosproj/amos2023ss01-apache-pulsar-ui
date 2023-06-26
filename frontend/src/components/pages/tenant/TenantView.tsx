// SPDX-License-Identifier: MIT
// SPDX-FileCopyrightText: 2010-2021 Dirk Riehle <dirk@riehle.org
// SPDX-FileCopyrightText: 2019 Georg Schwarz <georg. schwarz@fau.de>

import React, { useState } from 'react'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import ChevronRight from '@mui/icons-material/ChevronRight'
import { Collapse, CardActions, Button } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { addFilterByDrillDown } from '../../../store/filterSlice'
import { useAppDispatch } from '../../../store/hooks'
import axios from 'axios'
import { addCommaSeparator } from '../../../Helpers'
import config from '../../../config'

const TenantView: React.FC<TenantViewProps> = ({ data }) => {
	const { name, tenantInfo }: TenantInfo = data

	const [expanded, setExpanded] = useState(false)
	const [details, setDetails] = useState<TenantDetail>()
	const dispatch = useAppDispatch()
	const navigate = useNavigate()

	const fetchData = () => {
		const url = config.backendUrl + '/api/tenant/'

		// Sending GET request
		const params = {
			tenantName: name,
		}
		axios
			.get<TenantDetail>(url, { params })
			.then((response) => {
				setDetails(response.data)
			})
			.catch((error) => {
				console.log(error)
			})
	}

	const handleDrillDown = () => {
		dispatch(addFilterByDrillDown({ filterName: 'tenant', id: name }))
		navigate('/namespace')
	}
	const handleExpand = () => {
		if (!details) fetchData()
		setExpanded(!expanded)
	}

	return (
		<div className="flex flex-col card-content">
			<h2 className="uppercase">{name}</h2>
			<div className="flex card-inner">
				<div className="flex flex-col card-col">
					<div className="flex card-info">
						<p className="text-black">
							Admin Roles:<br></br>
							<span className="text-blue">
								{tenantInfo.adminRoles && tenantInfo.adminRoles.length > 0 ? (
									tenantInfo.adminRoles.map((item: string, index: number) => (
										<span key={index}>
											{item}
											{addCommaSeparator(
												index,
												tenantInfo.adminRoles.length
											)}{' '}
										</span>
									))
								) : (
									<span>N/A </span>
								)}
							</span>
						</p>
						<p className="text-black">
							Allowed Clusters:<br></br>
							<span className="text-blue">
								{tenantInfo.allowedClusters &&
									tenantInfo.allowedClusters.length > 0 &&
									tenantInfo.allowedClusters.map(
										(item: string, index: number) => (
											<span key={index}>
												{item}
												{addCommaSeparator(
													index,
													tenantInfo.allowedClusters.length
												)}{' '}
											</span>
										)
									)}
							</span>
						</p>
					</div>
					<div className="grey-line"></div>
				</div>
			</div>
			<div className="grey-line"></div>
			<Collapse in={expanded} timeout="auto" unmountOnExit>
				<div className="flex card-inner">
					<div className="flex flex-col card-col">
						<div className="flex card-info">
							<p className="text-black">
								Namespaces:<br></br>
								{details?.namespaces.map((item: string, index: number) => (
									<span key={index} className="text-blue">
										{item}
										{addCommaSeparator(index, details.namespaces.length)}
									</span>
								))}
							</p>
							<p className="text-black">
								Amount of Namespaces:<br></br>
								<span className="text-blue">{details?.amountOfNamespaces}</span>
							</p>
						</div>
					</div>
				</div>
			</Collapse>
			<div className="flex justify-between card-buttons-container">
				{' '}
				<CardActions disableSpacing>
					{expanded ? (
						<Button
							variant={'contained'}
							className="outlined-button"
							onClick={handleExpand}
							endIcon={<ExpandLessIcon />}
						>
							Hide
						</Button>
					) : (
						<Button
							className="outlined-button"
							variant={'contained'}
							onClick={handleExpand}
							endIcon={<ExpandMoreIcon />}
						>
							Show details
						</Button>
					)}
					<Button
						endIcon={<ChevronRight />}
						variant={'contained'}
						onClick={handleDrillDown}
					>
						Drill down
					</Button>
				</CardActions>
			</div>
		</div>
	)
}

export default TenantView
