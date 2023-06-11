// SPDX-License-Identifier: MIT
// SPDX-FileCopyrightText: 2010-2021 Dirk Riehle <dirk@riehle.org
// SPDX-FileCopyrightText: 2019 Georg Schwarz <georg. schwarz@fau.de>

import React, { useState } from 'react'
import { Button, CardActions, Collapse } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import { useAppDispatch } from '../../store/hooks'
import { addFilter } from '../../store/filterSlice'
import { useNavigate } from 'react-router-dom'

const ClusterView: React.FC<ClusterViewProps> = ({ data }) => {
	const { id }: ClusterInfo = data
	const [expanded, setExpanded] = useState(false)
	const [details, setDetails] = useState<ClusterDetail>()

	const dispatch = useAppDispatch()
	const navigate = useNavigate()

	const handleDrillDown = () => {
		dispatch(addFilter({ filterName: 'cluster', id: id }))
		navigate('/tenant')
	}

	const fetchData = () => {
		const url = 'http://localhost:8081/api/cluster/' + data.id

		/*
				// Sending GET request
				axios
					.get<ClusterDetail>(url, {  })
					.then((response) => {
						setDetails(response.data)
						setLoading(false)
					})
					.catch((error) => {
						setError(error.message)
						setLoading(false)
					})
					*/
	}
	const handleExpand = () => {
		if (!data) fetchData()
		setExpanded(!expanded)
	}
	return (
		<div className="flex flex-col card-content">
			<h2 className="uppercase">{id}</h2>
			<div className="grey-line"></div>
			<Collapse in={expanded} timeout="auto" unmountOnExit>
				<div className="flex card-inner">
					<div className="flex flex-col card-col card-col-1">
						{/*
						<div className="flex flex-col card-info">
							<p className="text-black">
								Brokers:{' '}
								<span className="text-blue">
									{data?.brokers && data?.brokers?.length > 0
										? data.brokers?.length
										: 0}
								</span>
							</p>
							<p className="text-black">
								Bookies:{' '}
								<span className="text-blue">
									{data?.bookies
										? data.bookies.length
											? data.bookies.length
											: 0
										: 0}
								</span>
							</p>
						</div>
						<div className="grey-line"></div>
						<div className="flex flex-col card-info">
							<p className="text-black">
								Namespaces:{' '}
								<span className="text-blue">
									{data?.amountOfNamespaces ? data.amountOfNamespaces : 0}
								</span>
							</p>
							<p className="text-black">
								Topics:{' '}
								<span className="text-blue">
									{data?.amountOfTopics ? data.amountOfTopics : 0}
								</span>
							</p>
						</div>
						<div className="grey-line"></div>
						<div className="flex flex-col card-info">
							<p className="text-black">
								Service URL:{' '}
								<span className="text-blue">
									{data?.serviceUrl ? data.serviceUrl : 'N/A'}
								</span>
							</p>
							<p className="text-black">
								Broker Service URL:{' '}
								<span className="text-blue">
									{data?.brokerServiceUrl ? data.brokerServiceUrl : 'N/A'}
								</span>
							</p>
								</div>
							*/}
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
