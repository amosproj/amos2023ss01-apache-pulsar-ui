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
		<Accordion expanded={isExpanded} onChange={handleAccordionChange}>
			<AccordionSummary
				expandIcon={<ExpandMoreIcon />}
				aria-controls="panel1a-content"
				id="panel1a-header"
			>
				<Typography>{consumerName}</Typography>
			</AccordionSummary>
			<AccordionDetails>
				<Typography variant="body1" gutterBottom>
					Address: {consumerDetails?.address ? consumerDetails.address : 'N/A'}
				</Typography>
				<Typography variant="body1" gutterBottom>
					Available permits: {consumerDetails?.availablePermits}
				</Typography>
				<Typography variant="body1" gutterBottom>
					Bytes out counter: {consumerDetails?.bytesOutCounter}
				</Typography>
				<Typography variant="body1" gutterBottom>
					Client version: {consumerDetails?.clientVersion}
				</Typography>
				<Typography variant="body1" gutterBottom>
					Connected since: {consumerDetails?.connectedSince}
				</Typography>
				<Typography variant="body1" gutterBottom>
					Last acked timestamp: {consumerDetails?.lastAckedTimestamp}
				</Typography>
				<Typography variant="body1" gutterBottom>
					Last consumed timestamp: {consumerDetails?.lastConsumedTimestamp}
				</Typography>
				<Typography variant="body1" gutterBottom>
					Message out counter: {consumerDetails?.messageOutCounter}
				</Typography>
				<Typography variant="body1" gutterBottom>
					Unacked messages: {consumerDetails?.unackedMessages}
				</Typography>
				<Typography variant="body1" gutterBottom>
					Blocked consumer on unacked msgs:{' '}
					{consumerDetails?.blockedConsumerOnUnackedMsgs
						? consumerDetails.blockedConsumerOnUnackedMsgs
							? 'true'
							: 'false'
						: 'N/A'}
				</Typography>
			</AccordionDetails>
		</Accordion>
	) : (
		<span>No active consumer</span>
	)
}

export default ConsumerAccordion
