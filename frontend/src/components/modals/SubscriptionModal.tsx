// SPDX-License-Identifier: MIT
// SPDX-FileCopyrightText: 2010-2021 Dirk Riehle <dirk@riehle.org
// SPDX-FileCopyrightText: 2019 Georg Schwarz <georg. schwarz@fau.de>

import React, { useState } from 'react'
import { Modal, Box, Typography, IconButton, Divider } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import axios from 'axios'
import ConsumerAccordion from './ConsumerAccordion'
import InformationText from './InformationText'
import config from '../../config'
import { convertTimestampToDateTime } from '../../Helpers'

export interface ResponseSubscription {
	name: string
	activeConsumer: string
	inactiveConsumers: string[]
	numberConsumers: number
	msgAckRate: number
	msgBacklog: number
	backlogSize: number
	msgOutCounter: number
	bytesOutCounter: number
	replicated: boolean
	type: string
}

interface SubscriptionModalProps {
	subscription: string
	topic: string
}

interface MessageResponse {
	messages: MessageInfo[]
}

/**
 * SubscriptionModal is a react component for displaying subscription information in pulsar.
 *
 * The following information is shown in the subscription information popup:
 * Consumers: List of connected consumers on this subscription w/ their stats.
 * -> When clicked, the corresponding consumer accordion is expanded
 * ConsumersCount: Number of total consumers
 * BacklogSize: Size of backlog in byte
 * MsgBacklog: Number of entries in the subscription backlog
 * BytesOutCounter: Total bytes delivered to consumer (bytes)
 * MsgOutCounter: Total messages delivered to consumer (msg)
 * isReplicated: Mark that the subscription state is kept in sync across different regions
 * Type: The subscription type as defined by SubscriptionType
 * Messages: 10 messages in this subscription
 *
 * @component
 * @param subscription - The name of subscription.
 * @param topic - The name of topic.
 * @returns The rendered SubscriptionModal component.
 */
const SubscriptionModal: React.FC<SubscriptionModalProps> = ({
	subscription,
	topic,
}) => {
	const [open, setOpen] = useState(false)
	const [subscriptionDetail, setSubscriptionDetail] =
		useState<ResponseSubscription>()
	const [messages, setMessages] = useState<MessageInfo[]>([])
	const [subscriptionError, setSubscriptionError] = useState<string | null>(
		null
	)
	const [messagesError, setMessageError] = useState<string | null>(null)
	const baseURL = config.backendUrl + '/api/topic/subscription/'

	const handleOpen = () => {
		fetchData()
		setOpen(true)
	}

	const handleClose = () => {
		setOpen(false)
	}

	/**
	 * Fetch detail info of subscription.
	 * @returns Promise of subscription detail data.
	 */
	const fetchSubscription = () => {
		// Query parameters
		const topicQuery = `topic=${topic}`

		// Joining all query parameters
		const query = [topicQuery]
		const url = `${baseURL + subscription}?${query}`
		// Sending GET request
		return axios.get<ResponseSubscription>(url)
	}

	/**
	 * Fetch message information of current producer displayed in this modal.
	 * @param numMessages number of messages to fetch from endpoint.
	 * @returns Promise of messages data.
	 */
	const fetchSubscriptionMessages = (numMessages = 10) => {
		const url = config.backendUrl + '/api/messages/'
		const params = {
			topic: topic,
			numMessages,
			subscription,
		}
		return axios.get<MessageResponse>(url, { params })
	}

	/**
	 * Fetch all data and set data.
	 */
	const fetchData = () => {
		fetchSubscription()
			.then((response) => {
				setSubscriptionDetail(response.data)
			})
			.catch((error) => {
				setSubscriptionError(error.message)
			})

		fetchSubscriptionMessages()
			.then((response) => setMessages(response.data.messages))
			.catch((error) => setMessageError(error.messages))
	}

	return (
		<>
			<span
				className="text-blue"
				onClick={handleOpen}
				style={{ cursor: 'pointer' }}
			>
				{subscription}
			</span>
			<Modal open={open} onClose={handleClose}>
				<Box
					sx={{
						position: 'absolute',
						top: '50%',
						left: '50%',
						transform: 'translate(-50%, -50%)',
						bgcolor: 'background.paper',
						boxShadow: 24,
						p: 4,
						maxWidth: 600,
						width: '100%',
						maxHeight: '80vh',
						overflowY: 'auto',
						borderRadius: '20px',
					}}
				>
					<IconButton
						sx={{
							position: 'absolute',
							right: 0,
							top: 0,
							color: 'grey.500',
							padding: '10px',
						}}
						onClick={handleClose}
					>
						<CloseIcon />
					</IconButton>
					<Typography variant="h5" component="h2" gutterBottom>
						Subscription: {subscription}
					</Typography>
					{subscriptionError || (
						<>
							<InformationText
								title="Backlog size"
								detailedInfo={subscriptionDetail?.backlogSize}
							/>
							<InformationText
								title="Message backlog"
								detailedInfo={subscriptionDetail?.msgBacklog}
							/>
							<InformationText
								title="Bytes out counter"
								detailedInfo={subscriptionDetail?.bytesOutCounter}
							/>
							<InformationText
								title="Message out counter"
								detailedInfo={subscriptionDetail?.msgOutCounter}
							/>
							<InformationText
								title="Is replicated"
								detailedInfo={subscriptionDetail?.replicated}
							/>
							<InformationText
								title="Type"
								detailedInfo={subscriptionDetail?.type}
							/>
							<InformationText
								title="Total number of consumers"
								detailedInfo={subscriptionDetail?.numberConsumers}
							/>
							{subscriptionDetail?.activeConsumer ? (
								<ConsumerAccordion
									consumerName={subscriptionDetail?.activeConsumer}
									topicName={topic}
									isActive={true}
								/>
							) : (
								<InformationText title="Active consumer" detailedInfo={''} />
							)}
							{subscriptionDetail?.inactiveConsumers &&
							subscriptionDetail?.inactiveConsumers.length > 0 ? (
								subscriptionDetail?.inactiveConsumers.map((consumer, index) => {
									return (
										<ConsumerAccordion
											consumerName={consumer}
											topicName={topic}
											isActive={false}
											key={index}
										/>
									)
								})
							) : (
								<InformationText title="Inactive consumers" detailedInfo={''} />
							)}
						</>
					)}
					{messagesError || messages.length > 0 ? (
						<>
							<InformationText title="Messages(10 latest)" detailedInfo=" " />
							{messages.map((message, index) => {
								return (
									<>
										<div key={index} className="modal-info">
											<p>
												Message ID:{' '}
												<span className="detail">{message.messageId}</span>
											</p>
											<p>
												Publish time:{' '}
												<span className="detail">
													{convertTimestampToDateTime(message.publishTime)}
												</span>
											</p>
										</div>
										<Divider />
									</>
								)
							})}
						</>
					) : (
						<InformationText title="Messages" detailedInfo="" />
					)}
				</Box>
			</Modal>
		</>
	)
}

export default SubscriptionModal
