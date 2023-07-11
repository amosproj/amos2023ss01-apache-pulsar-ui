// SPDX-License-Identifier: MIT
// SPDX-FileCopyrightText: 2010-2021 Dirk Riehle <dirk@riehle.org
// SPDX-FileCopyrightText: 2019 Georg Schwarz <georg. schwarz@fau.de>

import React, { useState } from 'react'
import { Modal, Box, Typography, IconButton } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import axios from 'axios'
import config from '../../config'

interface ConsumerModalProps {
	consumer: {
		topicName: string
		consumerName: string
	}
}

/**
 * ConsumerModal is a react component for displaying information in pulsar.
 * !!! Currently this component is replaced by ConsumerAccordion.
 *
 * @component
 * @param  consumer
 * @param  consumer.topicName - The name of topic it belongs to.
 * @param  consumer.consumerName - The name of current consumer.
 * @returns The rendered ConsumerModal component.
 */
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
		const url = config.backendUrl + `/api/topic/consumer/${consumerName}`

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
