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

/**
 * ConsumerAccordion is a react accordion component
 * for displaying consumer information in pulsar.
 * It shows the consumer details.
 *
 * The following information is shown in the consumer information popup:
 * address: Address of this consumer
 * availablePermits: Number of available message permits for the consumer
 * BytesOutCounter: Total bytes delivered to consumer (bytes)
 * ClientVersion: Client library version
 * ConnectedSince: Timestamp of connection
 * ConsumerName: Name of the consumer
 * LastAckedTimestamp:
 * LastConsumedTimestamp:
 * MessageOutConter: Total messages delivered to consumer (msg).
 * UnackedMessages: Number of unacknowledged messages for the consumer, where an  * unacknowledged message is one that has been sent to the consumer but not yet acknowledged
 * isBlockedConsumerOnUnackedMsgs: Flag to verify if consumer is blocked due to reaching  * threshold of unacked messages
 *
 * @component
 * @param consumerName - The name of current consumer.
 * @param topicName - The name of topic which this consumer belongs to.
 * @param isActive - Whether this consumer is active (in pulsar there is only one active consumer)
 * @returns The rendered ConsumerAccordion component.
 */
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
