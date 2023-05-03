import React, { useState, useEffect } from 'react'
import { TextField, Button } from '@mui/material'
import TopicSelect from './CustomSelect'

const Form = () => {
	const [topic, setTopic] = useState<string>('')
	const [message, setMessage] = useState<string>('')
	const [topicError, setTopicError] = useState<boolean>(false)
	const [messageError, setMessageError] = useState<boolean>(false)
	const [data, setData] = useState<Array<any>>([])

	const getData = () => {
		fetch('data/dummy.json', {
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
			},
		})
			.then(function (response) {
				console.log(response)
				return response.json()
			})
			.then(function (myJson) {
				console.log(myJson)
				setData(myJson)
			})
	}

	useEffect(() => {
		getData()
	}, [])

	const handleSubmit = (event: any) => {
		event.preventDefault()

		setMessageError(false)
		setTopicError(false)

		if (message == '') {
			setMessageError(true)
		}
		if (topic == '') {
			setTopicError(true)
		}

		if (message && topic) {
			console.log(message, topic)
		}

		const dataCopy = [...data]

		dataCopy.map((single) => {
			if (single.id === topic) {
				const tempId = topic + (single.messages.length + 1)
				const newMessage = { id: tempId, message: message, topicID: topic }
				single.messages = [...single.messages, newMessage]
			}
		})

		setData(dataCopy)
	}

	return (
		<div className="flex justify-center">
			<form
				autoComplete="off"
				onSubmit={handleSubmit}
				className="bg-white shadow-lg px-16 py-16 self-center my-4 lg:w-2/5 lg:max-w-md rounded-md w-full"
			>
				<h2 className="text-white text-4xl mb-8 font-semibold"></h2>
				<div className="flex flex-col gap-4">
					<TopicSelect
						data={data}
						value={topic}
						onChange={(e: any) => setTopic(e.target.value)}
						label="Topic"
						error={topicError}
					/>
					<TextField
						className="primary-textfield"
						label="Message"
						onChange={(e) => setMessage(e.target.value)}
						variant="outlined"
						type="text"
						sx={{ mb: 3 }}
						fullWidth
						value={message}
						error={messageError}
					/>
				</div>
				<Button className="primary-button w-full" type="submit">
					Add message
				</Button>
			</form>
		</div>
	)
}

export default Form
