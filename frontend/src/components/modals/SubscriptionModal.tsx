// SPDX-License-Identifier: MIT
// SPDX-FileCopyrightText: 2010-2021 Dirk Riehle <dirk@riehle.org
// SPDX-FileCopyrightText: 2019 Georg Schwarz <georg. schwarz@fau.de>

import React, { useState } from 'react'
import { Modal, Box, Typography, IconButton, Divider } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import axios from 'axios'
import ConsumerAccordion from './ConsumerAccordion'
import ModalInfo from './ModalInfo'
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
							<ModalInfo
								title="Backlog size"
								detailedInfo={subscriptionDetail?.backlogSize}
							/>
							<ModalInfo
								title="Message backlog"
								detailedInfo={subscriptionDetail?.msgBacklog}
							/>
							<ModalInfo
								title="Bytes out counter"
								detailedInfo={subscriptionDetail?.bytesOutCounter}
							/>
							<ModalInfo
								title="Message out counter"
								detailedInfo={subscriptionDetail?.msgOutCounter}
							/>
							<ModalInfo
								title="Is replicated"
								detailedInfo={subscriptionDetail?.replicated}
							/>
							<ModalInfo title="Type" detailedInfo={subscriptionDetail?.type} />
							<ModalInfo
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
								<ModalInfo title="Active consumer" detailedInfo={''} />
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
								<ModalInfo title="Inactive consumers" detailedInfo={''} />
							)}
						</>
					)}
					{messagesError || messages.length > 0 ? (
						<>
							<ModalInfo title="Messages(10 latest)" detailedInfo=" " />
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
						<ModalInfo title="Messages" detailedInfo="" />
					)}
				</Box>
			</Modal>
		</>
	)
}

export default SubscriptionModal
