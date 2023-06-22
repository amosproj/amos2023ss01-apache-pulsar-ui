// SPDX-License-Identifier: MIT
// SPDX-FileCopyrightText: 2010-2021 Dirk Riehle <dirk@riehle.org
// SPDX-FileCopyrightText: 2019 Georg Schwarz <georg. schwarz@fau.de>

import React, { useState } from 'react'
import { Modal, Box, Typography, IconButton } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import axios from 'axios'
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

	const handleOpen = () => {
		fetchData()
		setOpen(true)
	}

	const handleClose = () => {
		setOpen(false)
	}

	const fetchData = () => {
		const url = config.backendUrl + `/api/topic/producer/${producerName}`

		// Sending GET request
		const params = {
			topic: topicName,
		}
		axios
			.get<ProducerDetails>(url, { params })
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
				{producer.producerName},{' '}
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
						Producer name: {producer.producerName}
					</Typography>
					<Typography variant="body1" gutterBottom>
						Producer ID: {producerDetails?.id}
					</Typography>
					<Typography variant="body1" gutterBottom>
						Address: {producerDetails?.address}
					</Typography>
					<Typography variant="body1" gutterBottom>
						Average message size: {producerDetails?.averageMsgSize}
					</Typography>
					<Typography variant="body1" gutterBottom>
						Client version: {producerDetails?.clientVersion}
					</Typography>
					<Typography variant="body1" gutterBottom>
						Connected since: {producerDetails?.connectedSince}
					</Typography>
				</Box>
			</Modal>
		</>
	)
}

export default ProducerModal
