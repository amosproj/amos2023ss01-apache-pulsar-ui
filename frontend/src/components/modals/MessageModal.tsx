// SPDX-License-Identifier: MIT
// SPDX-FileCopyrightText: 2010-2021 Dirk Riehle <dirk@riehle.org
// SPDX-FileCopyrightText: 2019 Georg Schwarz <georg. schwarz@fau.de>

import React, { useState } from 'react'
import { Modal, Box, IconButton, Button, TextField } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import axios from 'axios'
import config from '../../config'
import { ChevronRight } from '@mui/icons-material'
import MessageView from '../../routes/message/MessageView'
import { Masonry } from 'react-plock'

interface MessageModalProps {
	topic: string
}

interface MessageResponse {
	messages: MessageInfo[]
}

/**
 * The MessageModal component provides consumer details.
 * The following information is shown:
 * MessageId - The id of the message.
 * Topic - The topic this message belongs to.
 * Payload - Payload this message contains.
 * Schema
 * Namespace - The name space this message belongs to.
 * Tenant - The tenant this message belongs to.
 * PublishTime
 * Producer - The producer this message belongs to.
 *
 * @component
 * @param topic - The name of topic.
 * @returns a scrollable modal including the messages associated to a specific topic.
 */
const MessageModal: React.FC<MessageModalProps> = ({ topic }) => {
	const [open, setOpen] = useState(false)
	const [amount, setAmount] = useState<number>(10)
	const [inputValue, setInputValue] = useState<string>('10')
	const [data, setData] = useState<MessageInfo[]>([])
	const [loading, setLoading] = useState<boolean>(true)
	const [error, setError] = useState<string | null>(null)
	const [scrollTop, setScrollTop] = useState(0)

	const handleOpen = () => {
		fetchData()
		setOpen(true)
		setScrollTop(0)
	}

	const handleClose = () => {
		setOpen(false)
	}

	// Sets the vertical length percentage of the custom scrollbar
	const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
		// Get the modal box inner element
		const messageBox = event.currentTarget

		// Determine the percentage of vertical length for the custom scrollbar based on total box height
		const scrollableHeight = messageBox.scrollHeight - messageBox.clientHeight
		const scrollPercentage = (messageBox.scrollTop / scrollableHeight) * 100

		// Update state
		setScrollTop(scrollPercentage)
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

	// Sanitizes the input of the message amount field
	const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const value = event.target.value
		setInputValue(value) // set the inputValue state

		if (value === '') {
			return // allow empty input but don't update amount
		}

		// Convert input value to a number
		let newAmount = Number(value)

		// Take the absolute value
		newAmount = Math.abs(newAmount)

		// Round it down to nearest integer
		newAmount = Math.floor(newAmount)

		// Set the minimum possible value to 1
		newAmount = Math.max(1, newAmount)

		// Update state
		setAmount(newAmount)
		setInputValue(newAmount.toString())
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
				<Box className="modal-box">
					<Box className="modal-box-inner" onScroll={handleScroll}>
						<IconButton className="close-modal-button" onClick={handleClose}>
							<CloseIcon />
						</IconButton>
						<div className="modal-content messages-container">
							<div className="custom-scrollbar-wrapper">
								<div
									className="custom-scrollbar"
									style={{ height: scrollTop + '%' }}
								></div>
							</div>
							<h2 className="modal-title">Messages ({data.length})</h2>
							<div className="message-filter">
								<TextField
									type="number"
									label="Nr. of messages requested"
									variant="outlined"
									value={inputValue}
									onChange={handleAmountChange}
									size="small"
								/>
								<Button
									variant={'contained'}
									className="outlined-button"
									onClick={fetchData}
								>
									Reload
								</Button>
							</div>
						</div>
						{loading ? (
							<div className="main-card"> Loading...</div>
						) : error ? (
							<div>Error: {error}</div>
						) : data.length === 0 ? (
							<div className="main-card">
								{' '}
								No messages found for topic &ldquo;{topic}&ldquo;
							</div>
						) : (
							<div id="message-list">
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
												data.length === 1
													? 'single-card main-card'
													: 'main-card'
											}
											key={index}
										>
											<MessageView key={index} data={message} />
										</div>
									)}
								/>
							</div>
						)}
					</Box>
				</Box>
			</Modal>
		</>
	)
}

export default MessageModal
