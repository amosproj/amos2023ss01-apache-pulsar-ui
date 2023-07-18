// SPDX-License-Identifier: MIT
// SPDX-FileCopyrightText: 2023 Julian Tochman-Szewc <tochman-szewc@campus.tu-berlin.de>
// SPDX-FileCopyrightText: 2023 Shahraz Nasir <shahraz.nasir@campus.tu-berlin.de>
// SPDX-FileCopyrightText: 2023 Ziqi He <ziqi.he@fau.de>
import React from 'react'

/**
 * The MessageView component displays message details.
 * It shows key properties of a message such as its id, related topic and namespace.
 *
 * @component
 * @param data - The data object containing the message information.
 * @returns a card including in-depth information regarding a specific message.
 */
const MessageView: React.FC<MessageViewProps> = ({ data }) => {
	const {
		messageId,
		topic,
		payload,
		schema,
		namespace,
		tenant,
		publishTime,
		producer,
	} = data

	const publishDate = new Date(publishTime)

	return (
		<div className="flex flex-col card-content">
			<h2 className="uppercase">ID: {messageId}</h2>
			<h4 className="uppercase"> {publishDate.toISOString()}</h4>
			<div className="flex card-inner">
				<div className="flex flex-col card-col">
					<div className="flex card-info">
						<p className="text-black">
							Topic:<br></br>
							<span className="text-grey">{topic}</span>
						</p>
						<p className="text-black">
							Namespace:<br></br>
							<span className="text-grey">{namespace}</span>
						</p>
						<p className="text-black">
							Tenant:<br></br>
							<span className="text-grey">{tenant}</span>
						</p>
						<p className="text-black">
							Producer:<br></br>
							<span className="text-grey">{producer}</span>
						</p>
					</div>
					<div className="grey-line"></div>
					<div className="flex card-info">
						<div className="text-black schema-box-wrapper">
							Payload:<br></br>
							<span className="schema-box">
								<pre className="text-black">{payload}</pre>
							</span>
						</div>
						<div className="text-black schema-box-wrapper">
							Schema:<br></br>
							<span className="schema-box">
								<pre className="text-black">{schema}</pre>
							</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default MessageView
