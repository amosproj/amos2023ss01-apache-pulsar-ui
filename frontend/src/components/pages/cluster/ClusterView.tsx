// SPDX-License-Identifier: MIT
// SPDX-FileCopyrightText: 2010-2021 Dirk Riehle <dirk@riehle.org
// SPDX-FileCopyrightText: 2019 Georg Schwarz <georg. schwarz@fau.de>

import React, { useState } from 'react'
import { Button, CardActions, Collapse } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import ChevronRight from '@mui/icons-material/ChevronRight'
import { useAppDispatch } from '../../../store/hooks'
import { addFilterByDrilling } from '../../../store/filterSlice'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import config from '../../../config'
import { addCommaSeparator } from '../../../Helpers'

const ClusterView: React.FC<ClusterViewProps> = ({ data }) => {
	const { name, numberOfNamespces, numberOfTenants }: ClusterInfo = data
	const [expanded, setExpanded] = useState(false)
	const [details, setDetails] = useState<ClusterDetail>()

	const dispatch = useAppDispatch()
	const navigate = useNavigate()

	const handleDrillDown = () => {
		dispatch(addFilterByDrilling({ filterName: 'cluster', id: name }))
		navigate('/tenant')
	}

	const handleDrillDownToTenant = (itemId: string) => {
		dispatch(addFilterByDrilling({ filterName: 'tenant', id: itemId }))
		navigate('/tenant')
	}

	const fetchData = () => {
		const url = config.backendUrl + '/api/cluster/'

		// Sending GET request
		const params = {
			clusterName: name,
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
			<h2 className="uppercase">{name}</h2>
			<div className="flex card-inner">
				<div className="flex flex-col card-col">
					<div className="flex card-info">
						<p className="text-black">
							Number of Tenants:<br></br>
							<span className="text-grey">{numberOfTenants}</span>
						</p>
						<p className="text-black">
							Number of Namespaces:<br></br>
							<span className="text-grey">{numberOfNamespces}</span>
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
								Amount of Brokers:<br></br>
								<span className="text-grey">{details?.amountOfBrokers}</span>
							</p>
							<p className="text-black">
								Brokers:<br></br>
								{details?.brokers.map((item: string, index: number) => (
									<span key={index} className="text-grey">
										{item},{' '}
									</span>
								))}
							</p>
						</div>
						<div className="grey-line"></div>
						<div className="flex card-info">
							<p className="text-black">
								Amount of Tenants:<br></br>
								<span className="text-grey">{details?.amountOfTenants}</span>
							</p>
							<p className="text-black">
								Tenants:<br></br>
								{details?.tenants.map((item: string, index: number) => (
									<span key={index} className="text-blue">
										<a href="#" onClick={() => handleDrillDownToTenant(item)}>
											{item}
										</a>
										{addCommaSeparator(index, details.tenants.length)}
									</span>
								))}
							</p>
						</div>
						<div className="grey-line"></div>
						<div className="flex card-info">
							<p className="text-black">
								Service URL:<br></br>
								<span className="text-grey">
									{details?.serviceUrl ? details.serviceUrl : 'N/A'}
								</span>
							</p>
							<p className="text-black">
								Broker Service URL:<br></br>
								<span className="text-grey">
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

export default ClusterView
