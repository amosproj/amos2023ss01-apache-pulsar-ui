// SPDX-License-Identifier: MIT
// SPDX-FileCopyrightText: 2010-2021 Dirk Riehle <dirk@riehle.org
// SPDX-FileCopyrightText: 2019 Georg Schwarz <georg. schwarz@fau.de>

// replaceable interface name
interface MessageList {
	id: string
	name: string
	messages: Array<Message>
}

interface Message {
	id: string
	value: string
}
