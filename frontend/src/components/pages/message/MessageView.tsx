// SPDX-License-Identifier: MIT
// SPDX-FileCopyrightText: 2010-2021 Dirk Riehle <dirk@riehle.org
// SPDX-FileCopyrightText: 2019 Georg Schwarz <georg. schwarz@fau.de>

import React from 'react'

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
						<p className="text-black timestamp-wrapper">
							Payload:<br></br>
							<span className="text-grey">{payload}</span>
						</p>
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
