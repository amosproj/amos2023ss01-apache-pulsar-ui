// SPDX-License-Identifier: MIT
// SPDX-FileCopyrightText: 2010-2021 Dirk Riehle <dirk@riehle.org
// SPDX-FileCopyrightText: 2019 Georg Schwarz <georg. schwarz@fau.de>

import React, { useState } from 'react'
import { Button, CardActions, Collapse } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import { useAppDispatch } from '../../../store/hooks'
import { addFilterByDrillDown } from '../../../store/filterSlice'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import config from '../../../config'

const ClusterView: React.FC<ClusterViewProps> = ({ data }) => {
	const { id }: ClusterInfo = data
	const [expanded, setExpanded] = useState(false)
	const [details, setDetails] = useState<ClusterDetail>()

	const dispatch = useAppDispatch()
	const navigate = useNavigate()

	const handleDrillDown = () => {
		dispatch(addFilterByDrillDown({ filterName: 'cluster', id: id }))
		navigate('/tenant')
	}

	const fetchData = () => {
		const url = config.backendUrl + '/api/cluster/'

		// Sending GET request
		const params = {
			clusterName: id,
		}
		axios
			.get<ClusterDetail>(url, { params })
			.then((response) => {
				setDetails(response.data)
			})
			.catch((error) => {
				console.log(error)
			})
	}
	const handleExpand = () => {
		if (!details) fetchData()
		setExpanded(!expanded)
	}
	return (
		<div className="flex flex-col card-content">
			<h2 className="uppercase">{id}</h2>
			<div className="grey-line"></div>
			<Collapse in={expanded} timeout="auto" unmountOnExit>
				<div className="flex card-inner">
					<div className="flex flex-col card-col card-col-1">
						<div className="flex flex-col card-info">
							<p className="text-black">
								Amount of Brokers:{' '}
								<span className="text-blue">{details?.amountOfBrokers}</span>
							</p>
							<p className="text-black">
								Brokers:{' '}
								{details?.brokers.map((item: string, index: number) => (
									<span key={index} className="text-blue">
										{item},{' '}
									</span>
								))}
							</p>
						</div>
						<div className="grey-line"></div>
						<div className="flex flex-col card-info">
							<p className="text-black">
								Amount of Tenants:{' '}
								<span className="text-blue">{details?.amountOfTenants}</span>
							</p>
							<p className="text-black">
								Tenants:{' '}
								{details?.tenants.map((item: string, index: number) => (
									<span key={index} className="text-blue">
										{item},{' '}
									</span>
								))}
							</p>
						</div>
						<div className="grey-line"></div>
						<div className="flex flex-col card-info">
							<p className="text-black">
								Service URL:{' '}
								<span className="text-blue">
									{details?.serviceUrl ? details.serviceUrl : 'N/A'}
								</span>
							</p>
							<p className="text-black">
								Broker Service URL:{' '}
								<span className="text-blue">
									{details?.brokerServiceUrl ? details.brokerServiceUrl : 'N/A'}
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

export default ClusterView
