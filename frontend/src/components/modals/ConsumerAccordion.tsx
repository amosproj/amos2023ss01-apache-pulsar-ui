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
import config from '../../config'

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
					<ModalInfo title="Address" detailedInfo={consumerDetails?.address} />
					<ModalInfo
						title="Available permits"
						detailedInfo={consumerDetails?.availablePermits}
					/>
					<ModalInfo
						title="Bytes out counter"
						detailedInfo={consumerDetails?.bytesOutCounter}
					/>
					<ModalInfo
						title="Client version"
						detailedInfo={consumerDetails?.clientVersion}
					/>
					<ModalInfo
						title="Connected since"
						detailedInfo={consumerDetails?.connectedSince}
					/>
					<ModalInfo
						title="Last acked timestamp"
						detailedInfo={consumerDetails?.lastAckedTimestamp}
					/>
					<ModalInfo
						title="Last consumed timestamp"
						detailedInfo={consumerDetails?.lastConsumedTimestamp}
					/>
					<ModalInfo
						title="Message out counter"
						detailedInfo={consumerDetails?.messageOutCounter}
					/>
					<ModalInfo
						title="Unacked messages"
						detailedInfo={consumerDetails?.unackedMessages}
					/>
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
