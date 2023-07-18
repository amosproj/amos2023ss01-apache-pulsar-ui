// SPDX-License-Identifier: MIT
// SPDX-FileCopyrightText: 2023 Julian Tochman-Szewc <tochman-szewc@campus.tu-berlin.de>
// SPDX-FileCopyrightText: 2023 Shahraz Nasir <shahraz.nasir@campus.tu-berlin.de>
// SPDX-FileCopyrightText: 2023 Ziqi He <ziqi.he@fau.de>
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
 * The ConsumerAccordion component is an accordion for displaying consumer details.
 * The following information is shown:
 * Address - Address of this consumer.
 * AvailablePermits - Number of available message permits for the consumer.
 * BytesOutCounter - Total bytes delivered to consumer (bytes).
 * ClientVersion - Client library version.
 * ConnectedSince - Timestamp of connection.
 * ConsumerName - Name of the consumer.
 * LastAckedTimestamp
 * LastConsumedTimestamp
 * MessageOutConter - Total messages delivered to consumer (msg).
 * UnackedMessages - Number of unacknowledged messages for the consumer, where an * unacknowledged message is one that has been sent to the consumer but not yet acknowledged.
 * IsBlockedConsumerOnUnackedMsgs - Flag to verify if consumer is blocked due to reaching  * threshold of unacked messages.
 *
 * @component
 * @param consumerName - The name of current consumer.
 * @param topicName - The name of topic which this consumer belongs to.
 * @param isActive - Whether this consumer is active (in Pulsar there is only one active consumer).
 * @returns an accordion including in-depth information regarding a specific consumer.
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
