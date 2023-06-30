// SPDX-License-Identifier: MIT
// SPDX-FileCopyrightText: 2010-2021 Dirk Riehle <dirk@riehle.org
// SPDX-FileCopyrightText: 2019 Georg Schwarz <georg. schwarz@fau.de>

import React, { useState } from 'react'
import { Modal, Box, Typography, IconButton } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import axios from 'axios'
import ModalInfo from './ModalInfo'
import config from '../../config'
import MessageView from '../pages/message/MessageView'
import { Masonry } from 'react-plock'

/**
The following information is shown in the producer information popup:
Address: Address of this publisher.
AverageMsgSize: Average message size published by this publisher.
ClientVersion: Client library version.
ConnectedSince: Timestamp of connection.
ProducerId: Id of this publisher.
ProducerName: Producer name.
*/

interface ProducerModalProps {
	producer: {
		producerName: string
		topicName: string
	}
}

interface MessageResponse {
	messages: MessageInfo[]
}

const ProducerModal: React.FC<ProducerModalProps> = ({ producer }) => {
	const { producerName, topicName } = producer

	const [open, setOpen] = useState(false)
	const [producerDetails, setProducerDetails] = useState<ProducerDetails>()
	const [messages, setMessages] = useState<MessageInfo[]>([])

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
				console.log(error)
			})

		fetchProducerDetail()
			.then((response) => {
				setProducerDetails(response.data)
			})
			.catch((error) => {
				console.log(error)
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
					<Typography variant="h5" gutterBottom>
						Producer: {producer.producerName}
					</Typography>
					<ModalInfo title={'Producer ID'} detailedInfo={producerDetails?.id} />
					<ModalInfo
						title={'Address'}
						detailedInfo={producerDetails?.address}
					/>
					<ModalInfo
						title={'Average message size'}
						detailedInfo={producerDetails?.averageMsgSize}
					/>
					<ModalInfo
						title={'Client version'}
						detailedInfo={producerDetails?.clientVersion}
					/>
					<ModalInfo
						title={'Connected since'}
						detailedInfo={producerDetails?.connectedSince}
					/>
					{messages.length > 0 ? (
						<>
							<ModalInfo title="Messages" detailedInfo=" " />
							<Masonry
								className="main-card-wrapper"
								items={messages}
								config={{
									columns: [1, 2],
									gap: [34, 34],
									media: [1619, 1620],
								}}
								render={(message, index) => (
									<div
										className={
											messages.length === 1
												? 'single-card main-card'
												: 'main-card'
										}
										key={index}
									>
										<MessageView key={index} data={message} />
									</div>
								)}
							/>
						</>
					) : (
						<ModalInfo title="Messages" detailedInfo="" />
					)}
				</Box>
			</Modal>
		</>
	)
}

export default ProducerModal
