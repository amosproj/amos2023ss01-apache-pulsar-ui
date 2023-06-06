// SPDX-License-Identifier: MIT
// SPDX-FileCopyrightText: 2010-2021 Dirk Riehle <dirk@riehle.org
// SPDX-FileCopyrightText: 2019 Georg Schwarz <georg. schwarz@fau.de>

import React, { useState } from 'react'
import ProducerModal from '../modals/ProducerModal'
import { Collapse, CardActions, Button } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'

const TopicView: React.FC<TopicViewProps> = ({ data, handleClick }) => {
	/*
	const topicConsumers = data?.topicStatsDto?.subscriptions
		.map((item: SampleSubscription) => item.consumers)
		.filter((el: Array<string>) => el && el.length > 0)
		.flat()
	*/
	const topicProducers = data?.topicStatsDto?.producers

	const [expanded, setExpanded] = useState(false)

	const handleExpand = () => {
		//TODO if(!data) fetch detailed data
		setExpanded(!expanded)
	}
	return (
		<div className="flex flex-col card-content">
			<h2>{data?.localName}</h2>
			<div className="flex card-inner">
				<div className="flex flex-col card-col card-col-1">
					<div className="flex flex-col card-info">
						<p className="text-black">
							Cluster:{' '}
							<span className="text-blue">
								{data?.cluster ? data.cluster : 'N/A'}
							</span>
						</p>
						<p className="text-black">
							Tenant:{' '}
							<span className="text-blue">
								{data?.tenant ? data.tenant : 'N/A'}
							</span>
						</p>
						<p className="text-black">
							Namespace:{' '}
							<span className="text-blue">
								{data?.namespace ? data.namespace : 'N/A'}
							</span>
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
								Producers:{' '}
								<span className="text-blue">
									{topicProducers &&
										topicProducers.length > 0 &&
										topicProducers.map((item: string) => (
											<ProducerModal
												key={'producer-' + Math.floor(Math.random() * 999999)}
												producer={{
													producerName: item,
													topicList: ['SampleTopic1', 'SampleTopic2'],
													messageList: ['SampleMessage1', 'SampleMessage2'],
												}}
											/>
										))}
								</span>
							</p>
							<p className="text-black">
								Consumers:{' '}
								<span className="text-blue">
									{/*topicConsumers &&
									topicConsumers.length > 0 &&
									topicConsumers.map((item: string, index: number) => (
										<ConsumerModal
											key={'consumer-' + Math.floor(Math.random() * 999999)}
											consumer={{
												consumerName: item,
												topicList: ['SampleTopic1', 'SampleTopic2'],
												messageList: ['SampleMessage1', 'SampleMessage2'],
											}}
										/>
										))*/}
								</span>
							</p>
						</div>
						<div className="grey-line"></div>
						<div className="flex flex-col card-info">
							<p className="text-black">
								Produced messages:{' '}
								<span className="text-blue">
									{data?.topicStatsDto?.producedMesages
										? data.topicStatsDto.producedMesages
										: 0}
								</span>
							</p>
							<p className="text-black">
								Average message size:{' '}
								<span className="text-blue">
									{data?.topicStatsDto?.averageMessageSize
										? data.topicStatsDto.averageMessageSize
										: 0}
								</span>
							</p>
							<p className="text-black">
								Storage size:{' '}
								<span className="text-blue">
									{data?.topicStatsDto?.storageSize
										? data.topicStatsDto.storageSize
										: 0}
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
					<Button variant={'contained'} onClick={(e) => handleClick(e, data)}>
						drill down
					</Button>
				</CardActions>
			</div>
		</div>
	)
}

export default TopicView
