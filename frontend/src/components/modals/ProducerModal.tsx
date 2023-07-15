// SPDX-License-Identifier: MIT
// SPDX-FileCopyrightText: 2010-2021 Dirk Riehle <dirk@riehle.org
// SPDX-FileCopyrightText: 2019 Georg Schwarz <georg. schwarz@fau.de>

import React, { useState } from 'react'
import { Modal, Box, Typography, IconButton, Divider } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import axios from 'axios'
import InformationText from './InformationText'
import config from '../../config'
import { convertTimestampToDateTime } from '../../Helpers'

interface ProducerModalProps {
	producer: {
		producerName: string
		topicName: string
	}
}

interface MessageResponse {
	messages: MessageInfo[]
}

/**
 * The ProducerModal component provides producer details.
 * The following information is shown:
 * Address - Address of this producer.
 * AverageMsgSize - Average message size published by this producer.
 * ClientVersion - Client library version.
 * ConnectedSince - Timestamp of connection.
 * ProducerId - Id of this publisher.
 * ProducerName - Producer name.
 *
 * @component
 * @param producer
 * @param producer.producerName - The name of producer.
 * @param producer.topicName - The name of topic it belongs to.
 * @returns a modal including in-depth information regarding a specific producer.
 */
const ProducerModal: React.FC<ProducerModalProps> = ({ producer }) => {
	const { producerName, topicName } = producer

	const [open, setOpen] = useState(false)
	const [producerDetails, setProducerDetails] = useState<ProducerDetails>()
	const [messages, setMessages] = useState<MessageInfo[]>([])
	const [producerError, setProducerError] = useState<string | null>(null)
	const [messagesError, setMessagesError] = useState<string | null>(null)

	const handleOpen = () => {
		fetchData()
		setOpen(true)
	}

	const handleClose = () => {
		setOpen(false)
	}

	/**
	 * Fetch producer detail data from producer endpoint.
	 */
	const fetchProducerDetail = () => {
		const url = config.backendUrl + `/api/topic/producer/${producerName}`
		const params = {
			topic: topicName,
		}
		return axios.get<ProducerDetails>(url, { params })
	}

	/**
	 * Fetch message information of current producer displayed in this modal.
	 * @param numMessages number of messages to fetch from endpoint.
	 */
	const fetchProducerMessages = (numMessages = 10) => {
		const url = config.backendUrl + '/api/messages/'
		const params = {
			topic: topicName,
			numMessages,
			producers: producerName,
		}
		return axios.get<MessageResponse>(url, { params })
	}

	/**
	 * Fetch all data and set data.
	 */
	const fetchData = () => {
		fetchProducerMessages()
			.then((response) => {
				setMessages(response.data.messages)
			})
			.catch((error) => {
				setProducerError(error.message)
			})

		fetchProducerDetail()
			.then((response) => {
				setProducerDetails(response.data)
			})
			.catch((error) => {
				setMessagesError(error.message)
			})
	}

	return (
		<>
			<span
				className="text-blue"
				onClick={handleOpen}
				style={{ cursor: 'pointer' }}
			>
				{producer.producerName}
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
						borderRadius: '25px',
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
					{producerError || (
						<>
							<Typography variant="h5" gutterBottom>
								Producer: {producer.producerName}
							</Typography>
							<InformationText
								title={'Producer ID'}
								detailedInfo={producerDetails?.id}
							/>
							<InformationText
								title={'Address'}
								detailedInfo={producerDetails?.address}
							/>
							<InformationText
								title={'Average message size'}
								detailedInfo={producerDetails?.averageMsgSize}
							/>
							<InformationText
								title={'Client version'}
								detailedInfo={producerDetails?.clientVersion}
							/>
							<InformationText
								title={'Connected since'}
								detailedInfo={producerDetails?.connectedSince}
							/>
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

export default ProducerModal
