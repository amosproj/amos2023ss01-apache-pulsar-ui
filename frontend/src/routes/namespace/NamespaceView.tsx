// SPDX-License-Identifier: MIT
// SPDX-FileCopyrightText: 2010-2021 Dirk Riehle <dirk@riehle.org
// SPDX-FileCopyrightText: 2019 Georg Schwarz <georg. schwarz@fau.de>

import React, { useState } from 'react'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import ChevronRight from '@mui/icons-material/ChevronRight'
import { Collapse, CardActions, Button } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { addFilterByDrilling, resetAllFilters } from '../../store/filterSlice'
import { useAppDispatch } from '../../store/hooks'
import axios from 'axios'
import { addCommaSeparator } from '../../Helpers'
import config from '../../config'
import { Topology } from '../../enum'

/**
 * NamespaceView is a React component for visualizing namespace details.
 * It shows key properties of a namespace such as its id, related tenants and numberOfTopics,
 * and allows for the navigation to the detailed view.
 *
 * @component
 * @param data - The data object containing the cluster information.
 * @returns The rendered ClusterView component.
 */
const NamespaceView: React.FC<NamespaceViewProps> = ({ data }) => {
	const { id, tenant, numberOfTopics }: NamespaceInfo = data

	const [expanded, setExpanded] = useState(false)
	const [details, setDetails] = useState<NamespaceDetail>()
	const dispatch = useAppDispatch()
	const navigate = useNavigate()

	const fetchData = () => {
		const url = config.backendUrl + '/api/namespace/'

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
		dispatch(addFilterByDrilling({ filterName: Topology.NAMESPACE, id: id }))
		navigate('/topic')
	}
	const handleDrillUp = () => {
		dispatch(resetAllFilters())
		dispatch(addFilterByDrilling({ filterName: Topology.TENANT, id: tenant }))
		navigate('/tenant')
	}
	const handleDrillDownToTopic = (itemId: string) => {
		dispatch(addFilterByDrilling({ filterName: Topology.TOPIC, id: itemId }))
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
				<div className="flex flex-col card-col">
					<div className="flex card-info">
						<p className="text-black">
							Tenant:<br></br>
							<span className="text-blue">
								<a href="#" onClick={handleDrillUp}>
									{tenant ? tenant : 'N/A'}
								</a>
							</span>
						</p>
						<p className="text-black">
							Number of Topics:<br></br>
							<span className="text-grey">{numberOfTopics}</span>
						</p>
					</div>
				</div>
			</div>
			<div className="grey-line"></div>
			<Collapse in={expanded} timeout="auto" unmountOnExit>
				<div className="flex card-inner">
					<div className="flex flex-col card-col">
						<div className="flex card-info">
							<p className="text-black">
								Boundaries:<br></br>
								{details?.bundlesData.boundaries.map(
									(item: string, index: number) => (
										<span key={index} className="text-grey">
											{item}
											{addCommaSeparator(
												index,
												details.bundlesData.boundaries.length
											)}
										</span>
									)
								)}
							</p>
							<p className="text-black">
								Bundles:<br></br>
								<span className="text-grey">
									{details?.bundlesData.numBundles
										? details.bundlesData.numBundles
										: 0}
								</span>
							</p>
							<p className="text-black">
								Message TTL:<br></br>
								<span className="text-grey">
									{details?.messagesTTL ? details?.messagesTTL : 'None'}
								</span>
							</p>
							<p className="text-black">
								Retention time:<br></br>
								<span className="text-grey">
									{details?.retentionPolicies?.retentionTimeInMinutes
										? details?.retentionPolicies.retentionTimeInMinutes +
										  ' minutes'
										: 'None'}
								</span>
							</p>
							<p className="text-black">
								Retention size:<br></br>
								<span className="text-grey">
									{details?.retentionPolicies?.retentionSizeInMB
										? details?.retentionPolicies.retentionSizeInMB + ' MB'
										: 'None'}
								</span>
							</p>
						</div>
						<div className="grey-line"></div>
						<div className="flex card-info">
							{details?.topics.length !== 0 ? (
								<div className="items-list">
									<p className="text-black">Topics:</p>
									<ul>
										{details?.topics.map((item: string, index: number) => (
											<li key={index}>
												<span key={index} className="text-blue">
													<a
														href="#"
														onClick={() => handleDrillDownToTopic(item)}
													>
														- {item}{' '}
													</a>
												</span>
											</li>
										))}
									</ul>
								</div>
							) : (
								<p className="text-black">
									Topics: <br></br>
									<span className="text-grey">None</span>
								</p>
							)}
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
							variant={'contained'}
							className="outlined-button"
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

export default NamespaceView
