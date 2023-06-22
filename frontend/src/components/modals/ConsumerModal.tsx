// SPDX-License-Identifier: MIT
// SPDX-FileCopyrightText: 2010-2021 Dirk Riehle <dirk@riehle.org
// SPDX-FileCopyrightText: 2019 Georg Schwarz <georg. schwarz@fau.de>

import React, { useState } from 'react'
import { Modal, Box, Typography, IconButton } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import axios from 'axios'

/** 
The following information is shown in the consumer information popup:

address: Address of this consumer
availablePermits: Number of available message permits for the consumer
BytesOutCounter: Total bytes delivered to consumer (bytes)
ClientVersion: Client library version
ConnectedSince: Timestamp of connection
ConsumerName: Name of the consumer
LastAckedTimestamp:
LastConsumedTimestamp:
MessageOutConter: Total messages delivered to consumer (msg).
UnackedMessages: Number of unacknowledged messages for the consumer, where an unacknowledged message is one that has been sent to the consumer but not yet acknowledged
isBlockedConsumerOnUnackedMsgs: Flag to verify if consumer is blocked due to reaching threshold of unacked messages
*/

interface ConsumerModalProps {
	consumer: {
		topicName: string
		consumerName: string
	}
}

const ConsumerModal: React.FC<ConsumerModalProps> = ({ consumer }) => {
	const { topicName, consumerName } = consumer

	const [open, setOpen] = useState(false)
	const [consumerDetails, setConsumerDetails] = useState<ConsumerDetails>()

	const handleOpen = () => {
		fetchData()
		setOpen(true)
	}

	const handleClose = () => {
		setOpen(false)
	}

	const fetchData = () => {
		const url = `http://backend:8081/api/topic/consumer/${consumerName}`

		// Sending GET request
		const params = {
			topic: topicName,
		}
		axios
			.get<ConsumerDetails>(url, { params })
			.then((response) => {
				setConsumerDetails(response.data)
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
				{consumer.consumerName},{' '}
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
						Consumer Name: {consumer.consumerName}
					</Typography>
					<Typography variant="body1" gutterBottom>
						Address:{' '}
						{consumerDetails?.address ? consumerDetails.address : 'N/A'}
					</Typography>
					<Typography variant="body1" gutterBottom>
						Available permits:{' '}
						{consumerDetails?.availablePermits
							? consumerDetails.availablePermits
							: 'N/A'}
					</Typography>
					<Typography variant="body1" gutterBottom>
						Bytes out counter:{' '}
						{consumerDetails?.bytesOutCounter
							? consumerDetails.bytesOutCounter
							: 'N/A'}
					</Typography>
					<Typography variant="body1" gutterBottom>
						Client version:{' '}
						{consumerDetails?.clientVersion
							? consumerDetails.clientVersion
							: 'N/A'}
					</Typography>
					<Typography variant="body1" gutterBottom>
						Connected since:{' '}
						{consumerDetails?.connectedSince
							? consumerDetails.connectedSince
							: 'N/A'}
					</Typography>
					<Typography variant="body1" gutterBottom>
						Last acked timestamp:{' '}
						{consumerDetails?.lastAckedTimestamp
							? consumerDetails.lastAckedTimestamp
							: 'N/A'}
					</Typography>
					<Typography variant="body1" gutterBottom>
						Last consumed timestamp:{' '}
						{consumerDetails?.lastConsumedTimestamp
							? consumerDetails.lastConsumedTimestamp
							: 'N/A'}
					</Typography>
					<Typography variant="body1" gutterBottom>
						Message out counter:{' '}
						{consumerDetails?.messageOutCounter
							? consumerDetails.messageOutCounter
							: 'N/A'}
					</Typography>
					<Typography variant="body1" gutterBottom>
						Unacked messages:{' '}
						{consumerDetails?.unackedMessages
							? consumerDetails.unackedMessages
							: 'N/A'}
					</Typography>
					<Typography variant="body1" gutterBottom>
						Blocked consumer on unacked msgs:{' '}
						{consumerDetails?.blockedConsumerOnUnackedMsgs
							? consumerDetails.blockedConsumerOnUnackedMsgs
								? 'true'
								: 'false'
							: 'N/A'}
					</Typography>
				</Box>
			</Modal>
		</>
	)
}

export default ConsumerModal
