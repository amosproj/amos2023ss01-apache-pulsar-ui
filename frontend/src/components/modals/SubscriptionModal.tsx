// SPDX-License-Identifier: MIT
// SPDX-FileCopyrightText: 2010-2021 Dirk Riehle <dirk@riehle.org
// SPDX-FileCopyrightText: 2019 Georg Schwarz <georg. schwarz@fau.de>

import React, { useState } from 'react'
import { Modal, Box, Typography, IconButton } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import axios from 'axios'
import ConsumerAccordion from './ConsumerAccordion'
import ModalInfo from './ModalInfo'

export interface ResponseSubscription {
	name: string
	activeConsumer: string
	inactiveConsumers: string[]
	messages: [
		{
			messageId: string
			topic: string
			payload: string
			schema: string
			namespace: string
			tenant: string
			publishTime: number
			producer: string
		}
	]
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

const SubscriptionModal: React.FC<SubscriptionModalProps> = ({
	subscription,
	topic,
}) => {
	const [open, setOpen] = useState(false)
	const [data, setData] = useState<ResponseSubscription>()
	const [error, setError] = useState<string | null>(null)
	const baseURL = 'http://localhost:8081/api/topic/subscription/'

	const handleOpen = () => {
		fetchData()
		setOpen(true)
	}

	const handleClose = () => {
		setOpen(false)
	}

	// useEffect(() => {
	// 	// Query parameters
	// 	const topicQuery = `topic=${topic}`

	// 	// Joining all query parameters
	// 	const query = [topicQuery]
	// 	const url = `${baseURL + subscription}?${query}`
	// 	// Sending GET request
	// 	axios
	// 		.get<ResponseSubscription>(url)
	// 		.then((response) => {
	// 			setData(response.data)
	// 		})
	// 		.catch((error) => {
	// 			setError(error.message)
	// 		})
	// }, [])

	const fetchData = () => {
		// Query parameters
		const topicQuery = `topic=${topic}`

		// Joining all query parameters
		const query = [topicQuery]
		const url = `${baseURL + subscription}?${query}`
		// Sending GET request
		axios
			.get<ResponseSubscription>(url)
			.then((response) => {
				setData(response.data)
			})
			.catch((error) => {
				setError(error.message)
			})
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
					<Typography variant="h5" component="h2" gutterBottom>
						Subscription: {subscription}
					</Typography>
					<div>
						<ConsumerAccordion
							consumerName={data?.activeConsumer}
							topicName={topic}
						/>
					</div>
					<ModalInfo
						title="Number of consumers"
						detailedInfo={data?.numberConsumers}
					/>
					<ModalInfo title="Backlog size" detailedInfo={data?.backlogSize} />
					<ModalInfo title="Message backlog" detailedInfo={data?.msgBacklog} />
					<ModalInfo
						title="Bytes out counter"
						detailedInfo={data?.bytesOutCounter}
					/>
					<ModalInfo
						title="Message out counter"
						detailedInfo={data?.msgOutCounter}
					/>
					<ModalInfo title="Is replicated" detailedInfo={data?.replicated} />
					<ModalInfo title="Type" detailedInfo={data?.type} />
				</Box>
			</Modal>
		</>
	)
}

export default SubscriptionModal
