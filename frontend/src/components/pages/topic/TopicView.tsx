// SPDX-License-Identifier: MIT
// SPDX-FileCopyrightText: 2010-2021 Dirk Riehle <dirk@riehle.org
// SPDX-FileCopyrightText: 2019 Georg Schwarz <georg. schwarz@fau.de>

import React, { useState } from 'react'
import ProducerModal from '../../modals/ProducerModal'
import { Collapse, CardActions, Button } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import { useNavigate } from 'react-router-dom'
import { addFilterByDrillDown } from '../../../store/filterSlice'
import { useAppDispatch } from '../../../store/hooks'
import axios from 'axios'
import ConsumerModal from '../../modals/SubscriptionModal'

const TopicView: React.FC<TopicViewProps> = ({ data }) => {
	const { name, tenant, namespace, producers, subscriptions }: TopicInfo = data
	const [expanded, setExpanded] = useState(false)
	const [details, setDetails] = useState<TopicDetail>()
	const dispatch = useAppDispatch()
	const navigate = useNavigate()

	const fetchData = () => {
		const url = 'http://localhost:8081/api/topic/'

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
	const handleDrillDown = () => {
		dispatch(addFilterByDrillDown({ filterName: 'topic', id: name }))
		navigate('/message')
	}

	const handleExpand = () => {
		if (!details) fetchData()
		setExpanded(!expanded)
	}

	return (
		<div className="flex flex-col card-content">
			<h2>{name}</h2>
			<div className="flex card-inner">
				<div className="flex flex-col card-col card-col-1">
					<div className="flex flex-col card-info">
						<p className="text-black">
							Tenant:{' '}
							<span className="text-blue">{tenant ? tenant : 'N/A'}</span>
						</p>
						<p className="text-black">
							Namespace:{' '}
							<span className="text-blue">{namespace ? namespace : 'N/A'}</span>
						</p>
						<p className="text-black">
							Producers:{' '}
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
								<span className="text-blue">None</span>
							)}
						</p>
						<p className="text-black">
							Subscriptions:{' '}
							{subscriptions.length > 0 ? (
								subscriptions.map((item: string, index: number) => (
									<ConsumerModal
										key={index}
										subscription={{
											subscriptionName: item,
											topicList: ['SampleTopic1', 'SampleTopic2'],
											messageList: ['SampleMessage1', 'SampleMessage2'],
										}}
									/>
								))
							) : (
								<span className="text-blue">None</span>
							)}
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
								Owner Broker:{' '}
								<span className="text-blue">
									{details?.ownerBroker ? details.ownerBroker : 'N/A'}
								</span>
							</p>
						</div>
						<div className="grey-line"></div>
						<div className="flex flex-col card-info">
							<p className="text-black">
								Produced messages:{' '}
								<span className="text-blue">
									{details?.topicStatsDto.producedMesages
										? details?.topicStatsDto.producedMesages
										: 0}
								</span>
							</p>
							<p className="text-black">
								Consumed messages:{' '}
								<span className="text-blue">
									{details?.topicStatsDto.consumedMessages
										? details?.topicStatsDto.consumedMessages
										: 0}
								</span>
							</p>
							<p className="text-black">
								Average message size:{' '}
								<span className="text-blue">
									{details?.topicStatsDto?.averageMessageSize
										? details.topicStatsDto.averageMessageSize
										: 0}{' '}
									Bytes
								</span>
							</p>
							<p className="text-black">
								Storage size:{' '}
								<span className="text-blue">
									{details?.topicStatsDto?.storageSize
										? details.topicStatsDto.storageSize
										: 0}{' '}
									Bytes
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

export default TopicView
