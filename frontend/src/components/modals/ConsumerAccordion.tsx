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
import InformationText from './InformationText'
import config from '../../config'

interface ConsumerAccordionProps {
	consumerName: string | undefined
	topicName: string
	isActive: boolean
}

const ConsumerAccordion: React.FC<ConsumerAccordionProps> = ({
	consumerName,
	topicName,
	isActive,
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
		<div>
			<p style={{ fontWeight: '600' }} className="modal-info">
				{isActive ? 'Active consumer:' : 'Inactive consumers:'}
			</p>
			<Accordion expanded={isExpanded} onChange={handleAccordionChange}>
				<AccordionSummary
					expandIcon={<ExpandMoreIcon />}
					aria-controls="panel1a-content"
					id="panel1a-header"
				>
					<Typography>{consumerName}</Typography>
				</AccordionSummary>
				<AccordionDetails>
					<InformationText
						title="Address"
						detailedInfo={consumerDetails?.address}
					/>
					<InformationText
						title="Available permits"
						detailedInfo={consumerDetails?.availablePermits}
					/>
					<InformationText
						title="Bytes out counter"
						detailedInfo={consumerDetails?.bytesOutCounter}
					/>
					<InformationText
						title="Client version"
						detailedInfo={consumerDetails?.clientVersion}
					/>
					<InformationText
						title="Connected since"
						detailedInfo={consumerDetails?.connectedSince}
					/>
					<InformationText
						title="Last acked timestamp"
						detailedInfo={consumerDetails?.lastAckedTimestamp}
					/>
					<InformationText
						title="Last consumed timestamp"
						detailedInfo={consumerDetails?.lastConsumedTimestamp}
					/>
					<InformationText
						title="Message out counter"
						detailedInfo={consumerDetails?.messageOutCounter}
					/>
					<InformationText
						title="Unacked messages"
						detailedInfo={consumerDetails?.unackedMessages}
					/>
					<InformationText
						title="Blocked consumer on unacked msgs"
						detailedInfo={consumerDetails?.blockedConsumerOnUnackedMsgs}
					/>
				</AccordionDetails>
			</Accordion>
		</div>
	)
}

export default ConsumerAccordion
