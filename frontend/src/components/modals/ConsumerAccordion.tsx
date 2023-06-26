// SPDX-License-Identifier: MIT
// SPDX-FileCopyrightText: 2010-2021 Dirk Riehle <dirk@riehle.org
// SPDX-FileCopyrightText: 2019 Georg Schwarz <georg. schwarz@fau.de>

import React, { useState } from 'react'
import {
	Typography,
	Accordion,
	AccordionSummary,
	AccordionDetails,
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import axios from 'axios'
import ModalInfo from './ModalInfo'

interface ConsumerAccordionProps {
	consumerName: string | undefined
	topicName: string
}

const ConsumerAccordion: React.FC<ConsumerAccordionProps> = ({
	consumerName,
	topicName,
}) => {
	const [consumerDetails, setConsumerDetails] = useState<ConsumerDetails>()
	const [isExpanded, setExpanded] = useState<boolean>(false)

	const handleAccordionChange = (
		event: React.SyntheticEvent,
		isExpanded: boolean
	): void => {
		setExpanded(isExpanded)
		if (isExpanded && consumerName) {
			fetchData()
		}
	}

	const fetchData = () => {
		const url = `http://localhost:8081/api/topic/consumer/${consumerName}`

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

	return consumerName ? (
		<div>
			<p style={{ fontWeight: '600' }}>Consumer: </p>
			<Accordion expanded={isExpanded} onChange={handleAccordionChange}>
				<AccordionSummary
					expandIcon={<ExpandMoreIcon />}
					aria-controls="panel1a-content"
					id="panel1a-header"
				>
					<Typography>{consumerName}</Typography>
				</AccordionSummary>
				<AccordionDetails>
					{/* <Typography variant="body1" gutterBottom>
						Address:{' '}
						{consumerDetails?.address ? consumerDetails.address : 'N/A'}
					</Typography> */}
					<ModalInfo title="Address" detailedInfo={consumerDetails?.address} />
					{/* <Typography variant="body1" gutterBottom>
						Available permits: {consumerDetails?.availablePermits}
					</Typography> */}
					<ModalInfo
						title="Available permits"
						detailedInfo={consumerDetails?.availablePermits}
					/>
					{/* <Typography variant="body1" gutterBottom>
						Bytes out counter: {consumerDetails?.bytesOutCounter}
					</Typography> */}
					<ModalInfo
						title="Bytes out counter"
						detailedInfo={consumerDetails?.bytesOutCounter}
					/>
					{/* <Typography variant="body1" gutterBottom>
						Client version: {consumerDetails?.clientVersion}
					</Typography> */}
					<ModalInfo
						title="Client version"
						detailedInfo={consumerDetails?.clientVersion}
					/>
					{/* <Typography variant="body1" gutterBottom>
						Connected since: {consumerDetails?.connectedSince}
					</Typography> */}
					<ModalInfo
						title="Connected since"
						detailedInfo={consumerDetails?.connectedSince}
					/>
					{/* <Typography variant="body1" gutterBottom>
						Last acked timestamp: {consumerDetails?.lastAckedTimestamp}
					</Typography> */}
					<ModalInfo
						title="Last acked timestamp"
						detailedInfo={consumerDetails?.lastAckedTimestamp}
					/>
					{/* <Typography variant="body1" gutterBottom>
						Last consumed timestamp: {consumerDetails?.lastConsumedTimestamp}
					</Typography> */}
					<ModalInfo
						title="Last consumed timestamp"
						detailedInfo={consumerDetails?.lastConsumedTimestamp}
					/>
					{/* <Typography variant="body1" gutterBottom>
						Message out counter: {consumerDetails?.messageOutCounter}
					</Typography> */}
					<ModalInfo
						title="Message out counter"
						detailedInfo={consumerDetails?.messageOutCounter}
					/>
					{/* <Typography variant="body1" gutterBottom>
						Unacked messages: {consumerDetails?.unackedMessages}
					</Typography> */}
					<ModalInfo
						title="Unacked messages"
						detailedInfo={consumerDetails?.unackedMessages}
					/>
					{/* <Typography variant="body1" gutterBottom>
						Blocked consumer on unacked msgs:{' '}
						{consumerDetails?.blockedConsumerOnUnackedMsgs.toString()}
					</Typography> */}
					<ModalInfo
						title="Blocked consumer on unacked msgs"
						detailedInfo={consumerDetails?.blockedConsumerOnUnackedMsgs}
					/>
				</AccordionDetails>
			</Accordion>
		</div>
	) : (
		<div className="modal-info">
			<p className="title">Consumer: </p>
			<p className="detail">No active consumer</p>
		</div>
	)
}

export default ConsumerAccordion
