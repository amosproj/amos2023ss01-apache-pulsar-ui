// SPDX-License-Identifier: MIT
// SPDX-FileCopyrightText: 2010-2021 Dirk Riehle <dirk@riehle.org
// SPDX-FileCopyrightText: 2019 Georg Schwarz <georg. schwarz@fau.de>

import React, { useState } from 'react'
import { Modal, Box, Typography, IconButton } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import axios from 'axios'
import ModalInfo from './ModalInfo'
import config from '../../config'

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

const ProducerModal: React.FC<ProducerModalProps> = ({ producer }) => {
	const { producerName, topicName } = producer

	const [open, setOpen] = useState(false)
	const [producerDetails, setProducerDetails] = useState<ProducerDetails>()
	const [messages, setMessages] = useState<MessageDto>()

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
	const fetchProducerDetail = async () => {
		const url = config.backendUrl + `/api/topic/producer/${producerName}`
		// Set query param.
		const params = {
			topic: topicName,
		}
		// Send get request for producer api endpoint.
		try {
			const response = await axios.get<ProducerDetails>(url, { params })
			setProducerDetails(response.data)
		} catch (error) {
			console.log(error)
		}
	}

	/**
	 * Fetch message information of current producer displayed in this modal.
	 * @param numMessages number of messages to fetch from endpoint.
	 */
	const fetchProducerMessages = async (numMessages = 10) => {
		const url = config.backendUrl + '/api/messages/'
		// Set query params for messages.
		const params = {
			topic: topicName,
			numMessages,
			producers: producerName,
		}
		// Send get request to retrieve messages for this producer.
		try {
			const response = await axios.get<MessageDto>(url, { params })
			setMessages(response.data)
		} catch (error) {
			console.log(error)
		}
	}

	const fetchData = () => {
		Promise.all([fetchProducerDetail(), fetchProducerMessages()])
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
						maxWidth: 500,
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
				</Box>
			</Modal>
		</>
	)
}

export default ProducerModal
