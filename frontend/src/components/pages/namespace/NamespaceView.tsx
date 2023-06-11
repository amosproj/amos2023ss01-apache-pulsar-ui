// SPDX-License-Identifier: MIT
// SPDX-FileCopyrightText: 2010-2021 Dirk Riehle <dirk@riehle.org
// SPDX-FileCopyrightText: 2019 Georg Schwarz <georg. schwarz@fau.de>

import React, { useState } from 'react'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import { Collapse, CardActions, Button } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { addFilter } from '../../../store/filterSlice'
import { useAppDispatch } from '../../../store/hooks'
import axios from 'axios'

const NamespaceView: React.FC<NamespaceViewProps> = ({ data }) => {
	const { id, tenant }: NamespaceInfo = data

	const [expanded, setExpanded] = useState(false)
	const [details, setDetails] = useState<NamespaceDetail>()
	const dispatch = useAppDispatch()
	const navigate = useNavigate()

	const fetchData = () => {
		const url = 'http://localhost:8081/api/namespace/'

		// Sending GET request
		const params = {
			name: id,
		}
		axios
			.get<NamespaceDetail>(url, { params })
			.then((response) => {
				setDetails(response.data)
			})
			.catch((error) => {
				console.log(error)
			})
	}

	const handleDrillDown = () => {
		dispatch(addFilter({ filterName: 'namespace', id: id }))
		navigate('/topic')
	}
	const handleExpand = () => {
		if (!details) fetchData()
		setExpanded(!expanded)
	}

	return (
		<div className="flex flex-col card-content">
			<h2 className="uppercase">{id}</h2>
			<div className="flex card-inner">
				<div className="flex flex-col card-col card-col-1">
					<div className="flex flex-col card-info">
						<p className="text-black">
							Tenant:{' '}
							<span className="text-blue">{tenant ? tenant : 'N/A'}</span>
						</p>
					</div>
				</div>
			</div>
			<div className="grey-line"></div>
			<Collapse in={expanded} timeout="auto" unmountOnExit>
				<div className="flex card-inner">
					<div className="flex flex-col card-col card-col-1">
						<div className="flex flex-col card-info">
							<p className="text-black">
								Boundaries:{' '}
								{details?.bundlesData.boundaries.map(
									(item: string, index: number) => (
										<span key={index} className="text-blue">
											{item},{' '}
										</span>
									)
								)}
							</p>
							<p className="text-black">
								Bundles:{' '}
								<span className="text-blue">
									{details?.bundlesData.numBundles
										? details.bundlesData.numBundles
										: 0}
								</span>
							</p>
							<p className="text-black">
								Message TTL:{' '}
								<span className="text-blue">
									{details?.messagesTTL ? details?.messagesTTL : 'None'}
								</span>
							</p>
							<p className="text-black">
								Retention time:{' '}
								<span className="text-blue">
									{details?.retentionPolicies?.retentionTimeInMinutes
										? details?.retentionPolicies.retentionTimeInMinutes +
										  ' minutes'
										: 'None'}
								</span>
							</p>
							<p className="text-black">
								Retention size:{' '}
								<span className="text-blue">
									{details?.retentionPolicies?.retentionSizeInMB
										? details?.retentionPolicies.retentionSizeInMB + ' MB'
										: 'None'}
								</span>
							</p>
						</div>
						<div className="grey-line"></div>
						<div className="flex flex-col card-info">
							{details?.amountOfTopics !== 0 ? (
								<div>
									<p className="text-black">Topics: </p>
									<ul>
										{details?.topics.map((item: string, index: number) => (
											<li key={index}>
												<span key={index} className="text-blue">
													- {item}{' '}
												</span>
											</li>
										))}
									</ul>
								</div>
							) : (
								<p className="text-black">
									Topics: <span className="text-blue">None</span>
								</p>
							)}
							<p className="text-black">
								Amount of Topics:{' '}
								<span className="text-blue">
									{details?.amountOfTopics ? details.amountOfTopics : 0}
								</span>
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
							style={{ marginRight: '10px' }}
							onClick={handleExpand}
							endIcon={<ExpandLessIcon />}
						>
							Hide
						</Button>
					) : (
						<Button
							variant={'contained'}
							style={{ marginRight: '10px' }}
							onClick={handleExpand}
							endIcon={<ExpandMoreIcon />}
						>
							show details
						</Button>
					)}
					<Button variant={'contained'} onClick={handleDrillDown}>
						drill down
					</Button>
				</CardActions>
			</div>
		</div>
	)
}

export default NamespaceView