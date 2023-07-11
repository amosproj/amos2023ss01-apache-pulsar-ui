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
 * MessageModal is a react component for displaying message information in pulsar.
 *
 * The following information is shown in MessageModal:
 * messageId: the id of the message
 * topic: the topic this message belongs to
 * payload: payload this message contains
 * schema:
 * namespace: the name space this message belongs to
 * tenant: the tenant this message belongs to
 * publishTime:
 * producer: the producer this message belongs to
 *
 * @component
 * @param topic - The name of topic
 * @returns The rendered MessageModal component.
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

	const handleScroll = (event: any) => {
		const messageBox = event.currentTarget
		const scrollableHeight = messageBox.scrollHeight - messageBox.clientHeight
		const scrollPercentage = (messageBox.scrollTop / scrollableHeight) * 100

		setScrollTop(scrollPercentage)
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
				<Box className="message-box-wrapper">
					<Box className="message-box" onScroll={handleScroll}>
						<IconButton className="close-modal-button" onClick={handleClose}>
							<CloseIcon />
						</IconButton>
						<div className="message-filter-wrapper">
							<div className="custom-scrollbar-wrapper">
								<div
									className="custom-scrollbar"
									style={{ height: scrollTop + '%' }}
								></div>
							</div>
							<h2 className="message-title">Messages ({data.length})</h2>
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
