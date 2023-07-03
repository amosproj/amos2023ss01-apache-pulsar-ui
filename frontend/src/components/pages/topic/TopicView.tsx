// SPDX-License-Identifier: MIT
// SPDX-FileCopyrightText: 2010-2021 Dirk Riehle <dirk@riehle.org
// SPDX-FileCopyrightText: 2019 Georg Schwarz <georg. schwarz@fau.de>

import React, { useState } from 'react'
import ProducerModal from '../../modals/ProducerModal'
import { Collapse, CardActions, Button } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import ChevronRight from '@mui/icons-material/ChevronRight'
import { useNavigate } from 'react-router-dom'
import {
	addFilterByDrilling,
	resetAllFilters,
} from '../../../store/filterSlice'
import { useAppDispatch } from '../../../store/hooks'
import axios from 'axios'
import SubscriptionModal from '../../modals/SubscriptionModal'
import config from '../../../config'
import MessageModal from '../../modals/MessageModal'

const TopicView: React.FC<TopicViewProps> = ({ data }) => {
	const { name, tenant, namespace, producers, subscriptions }: TopicInfo = data
	const [expanded, setExpanded] = useState(false)
	const [details, setDetails] = useState<TopicDetail>()
	const dispatch = useAppDispatch()
	const navigate = useNavigate()

	const fetchData = () => {
		const url = config.backendUrl + '/api/topic/'

		// Sending GET request
		const params = {
			name: name,
		}
		axios
			.get<TopicDetail>(url, { params })
			.then((response) => {
				setDetails(response.data)
			})
			.catch((error) => {
				console.log(error)
			})
	}
	/*const handleDrillDown = () => {
		dispatch(addFilterByDrilling({ filterName: 'topic', id: name }))
		navigate('/message')
	}*/
	const handleDrillUpToNamespace = () => {
		dispatch(resetAllFilters())
		dispatch(addFilterByDrilling({ filterName: 'namespace', id: namespace }))
		navigate('/namespace')
	}
	const handleDrillUpToTenant = () => {
		dispatch(resetAllFilters())
		dispatch(addFilterByDrilling({ filterName: 'tenant', id: tenant }))
		navigate('/tenant')
	}
	const handleExpand = () => {
		if (!details) fetchData()
		setExpanded(!expanded)
	}

	return (
		<div className="flex flex-col card-content">
			<h2>{name}</h2>
			<div className="flex card-inner">
				<div className="flex flex-col card-col">
					<div className="flex card-info">
						<p className="text-black">
							Tenant:<br></br>
							<span className="text-blue">
								<a href="#" onClick={handleDrillUpToTenant}>
									{tenant ? tenant : 'N/A'}
								</a>
							</span>
						</p>
						<p className="text-black">
							Namespace:<br></br>
							<span className="text-blue">
								<a href="#" onClick={handleDrillUpToNamespace}>
									{namespace ? namespace : 'N/A'}
								</a>
							</span>
						</p>
						<p className="text-black">
							Producers:<br></br>
							{producers.length > 0 ? (
								producers.map((item: string, index: number) => (
									<ProducerModal
										key={index}
										producer={{
											producerName: item,
											topicName: name,
										}}
									/>
								))
							) : (
								<span className="text-grey">None</span>
							)}
						</p>
						<p className="text-black">
							Subscriptions:<br></br>
							{subscriptions.length > 0 ? (
								subscriptions.map((item: string, index: number) => (
									<SubscriptionModal
										key={index}
										subscription={item}
										topic={name}
									/>
								))
							) : (
								<span className="text-grey">None</span>
							)}
						</p>
					</div>
				</div>
			</div>
			<div className="grey-line"></div>
			<Collapse in={expanded} timeout="auto" unmountOnExit>
				<div className="flex card-inner">
					<div className="flex flex-col card-col">
						<div className="flex card-info">
							<p className="text-black timestamp-wrapper">
								Owner Broker:<br></br>
								<span className="text-grey">
									{details?.ownerBroker ? details.ownerBroker : 'N/A'}
								</span>
							</p>
						</div>
						<div className="grey-line"></div>
						<div className="flex card-info">
							<p className="text-black">
								Produced messages:<br></br>
								<span className="text-grey">
									{details?.topicStatsDto.producedMesages
										? details?.topicStatsDto.producedMesages
										: 0}
								</span>
							</p>
							<p className="text-black">
								Consumed messages:<br></br>
								<span className="text-grey">
									{details?.topicStatsDto.consumedMessages
										? details?.topicStatsDto.consumedMessages
										: 0}
								</span>
							</p>
							<p className="text-black">
								Average message size:<br></br>
								<span className="text-grey">
									{details?.topicStatsDto?.averageMessageSize
										? details.topicStatsDto.averageMessageSize
										: 0}{' '}
									Bytes
								</span>
							</p>
							<p className="text-black">
								Storage size:<br></br>
								<span className="text-grey">
									{details?.topicStatsDto?.storageSize
										? details.topicStatsDto.storageSize
										: 0}{' '}
									Bytes
								</span>
							</p>
						</div>
						{details?.schemaInfos[0] ? (
							details?.schemaInfos.map((schema: SchemaInfo, index: number) => (
								<div key={index}>
									<div className="grey-line"></div>
									<div className="flex card-info">
										<p className="text-black">
											Schema:<br></br>
											<span className="text-grey">{schema.name}</span>
										</p>
										<p className="text-black">
											Version:<br></br>
											<span className="text-grey">{schema.version}</span>
										</p>
										<p className="text-black">
											Type:<br></br>
											<span className="text-grey">{schema.type}</span>
										</p>
										<p className="text-black">
											Props:<br></br>
											<span className="text-grey">
												{schema.properties.additionalProp1
													? schema.properties.additionalProp1
													: 'N/A'}
											</span>
											<span className="text-grey">
												{schema.properties.additionalProp2
													? ', ' + schema.properties.additionalProp2
													: ''}
											</span>
											<span className="text-grey">
												{schema.properties.additionalProp3
													? ', ' + schema.properties.additionalProp3
													: ''}
											</span>
										</p>
										<div className="text-black schema-box-wrapper">
											Schema Definition:<br></br>
											<span className="schema-box">
												<pre>
													{JSON.stringify(
														JSON.parse(schema.schemaDefinition),
														null,
														2
													)}
												</pre>
											</span>
										</div>
										<p className="text-black timestamp-wrapper">
											Timestamp:<br></br>
											<span className="text-grey">{schema.timestamp}</span>
										</p>
									</div>
								</div>
							))
						) : (
							<>
								<div className="grey-line"></div>
								<div className="flex card-info">
									<p className="text-black">
										Schema:<br></br>
										<span className="text-grey">N/A</span>
									</p>
								</div>
							</>
						)}
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
					<MessageModal topic={name} />
				</CardActions>
			</div>
		</div>
	)
}

export default TopicView
