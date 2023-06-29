// SPDX-License-Identifier: MIT
// SPDX-FileCopyrightText: 2010-2021 Dirk Riehle <dirk@riehle.org
// SPDX-FileCopyrightText: 2019 Georg Schwarz <georg. schwarz@fau.de>

import React, { useState } from 'react'
import {
	Modal,
	Box,
	Typography,
	IconButton,
	Button,
	TextField,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import axios from 'axios'
import ModalInfo from './ModalInfo'
import config from '../../config'
import { ChevronRight } from '@mui/icons-material'
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

interface MessageModalProps {
	topic: string
}

interface MessageResponse {
	messages: MessageInfo[]
}

const MessageModal: React.FC<MessageModalProps> = ({ topic }) => {
	const [open, setOpen] = useState(false)
	const [amount, setAmount] = useState<number>(10)
	const [data, setData] = useState<MessageInfo[]>([])
	const [loading, setLoading] = useState<boolean>(true)
	const [error, setError] = useState<string | null>(null)

	const handleOpen = () => {
		fetchData()
		setOpen(true)
	}

	const handleClose = () => {
		setOpen(false)
	}

	const fetchData = () => {
		const url = config.backendUrl + '/api/messages'
		// Sending GET request
		axios
			.get<MessageResponse>(url, {
				params: {
					topic: topic,
					numMessages: amount,
				},
			})
			.then((response) => {
				setData(response.data.messages)
				setLoading(false)
			})
			.catch((error) => {
				console.log(error)
				setError(error.message)
				setLoading(false)
			})
	}
	const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setAmount(Number(event.target.value))
	}

	return (
		<>
			<Button
				endIcon={<ChevronRight />}
				variant={'contained'}
				onClick={handleOpen}
			>
				Drill down
			</Button>
			<Modal open={open} onClose={handleClose}>
				<Box
					sx={{
						backgroundColor: 'white', // set the background color to white
						width: '50%', // set width similar to DIN A4
						height: '297mm', // set height similar to DIN A4
						top: '100px',
						overflowY: 'auto', // set vertical scroll if necessary
						padding: '20px', // add padding inside the modal
						boxSizing: 'border-box', // make sure padding is included in the size
						position: 'relative', // relative positioning
						margin: '0 auto', // center the modal horizontally
						borderRadius: '20px',
						boxShadow: 24,
						'&::-webkit-scrollbar': {
							width: '10px',
						},
						'&::-webkit-scrollbar-track': {
							backgroundColor: '#f1f1f1',
							borderRadius: '20px',
						},
						'&::-webkit-scrollbar-thumb': {
							backgroundColor: '#888',
							borderRadius: '20px',
						},
						'&::-webkit-scrollbar-thumb:hover': {
							backgroundColor: '#555',
						},
						scrollbarWidth: 'thin',
						scrollbarColor: '#888 #f1f1f1',
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
					<div>
						<div style={{ display: 'flex', alignItems: 'center' }}>
							<h2 className="dashboard-title" style={{ marginRight: '10px' }}>
								Messages ({data.length})
							</h2>
							<TextField
								type="number"
								label="Nr. of messages requested"
								variant="outlined"
								value={amount}
								onChange={handleAmountChange}
								size="small"
								style={{ marginRight: '10px' }}
							/>
							<Button
								variant={'contained'}
								className="outlined-button"
								onClick={fetchData}
							>
								Reload
							</Button>
						</div>
						{loading ? (
							<div className="main-card"> Loading...</div>
						) : error ? (
							<div>Error: {error}</div>
						) : (
							<Masonry
								className="main-card-wrapper"
								items={data}
								config={{
									columns: [1, 2],
									gap: [34, 34],
									media: [1619, 1620],
								}}
								render={(message, index) => (
									<div
										className={
											data.length === 1 ? 'single-card main-card' : 'main-card'
										}
										key={index}
									>
										<MessageView key={index} data={message} />
									</div>
								)}
							/>
						)}
					</div>
				</Box>
			</Modal>
		</>
	)
}

export default MessageModal
