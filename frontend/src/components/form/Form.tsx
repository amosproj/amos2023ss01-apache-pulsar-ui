import React, { useState, useEffect } from 'react'
import { TextField, Button } from '@mui/material'
import TopicSelect from './CustomSelect'
import CustomAccordion from './CustomAccordion'
import { SelectChangeEvent } from '@mui/material/Select'
import {
	selectData,
	selectMessage,
	selectTopic,
	setData,
	setMessage,
	setTopic,
	updateData,
} from './formControllerSlice'
import { useAppDispatch, useAppSelector } from '../../store/hooks'

const Form = () => {
	const [topicError, setTopicError] = useState<boolean>(false)
	const [messageError, setMessageError] = useState<boolean>(false)

	const data = useAppSelector(selectData)
	const topic = useAppSelector(selectTopic)
	const message = useAppSelector(selectMessage)

	const dispatch = useAppDispatch()

	//can later on be replaced by the fetchDataThunk
	const getData = () => {
		fetch('dummy/dummy.json', {
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
			},
		})
			.then(function (response) {
				console.log(response)
				return response.json()
			})
			.then(function (json) {
				console.log(json)
				dispatch(setData(json))
			})
	}
	useEffect(() => {
		getData()
	}, [])

	const handleSubmit = (event: { preventDefault: () => void }) => {
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

		dispatch(updateData({ message: message, topic: topic }))
	}

	return (
		<div className="flex justify-center gap-8 align-start">
			<form
				data-testid="demo-message-form"
				autoComplete="off"
				onSubmit={handleSubmit}
				className="bg-white shadow-lg px-16 py-16 self-center my-4 lg:w-2/5 lg:max-w-md rounded-md w-full"
			>
				<h4 className="text-black text-center text-3xl mb-4 font-semibold">
					Message Management
				</h4>
				<p className="text-center text-black pb-4">
					Use the form below to add a message to one of the existing Topics.
				</p>
				<div className="flex flex-col gap-4">
					<TopicSelect
						data={data}
						value={topic}
						onChange={(e: SelectChangeEvent<string>) =>
							dispatch(setTopic(e.target.value))
						}
						label="Topic"
						error={topicError}
					/>
					<TextField
						inputProps={{ 'data-testid': 'demo-simple-texfield' }}
						className="primary-textfield"
						label="Message"
						onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
							dispatch(setMessage(e.target.value))
						}
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
			<div className="bg-white shadow-lg px-16 py-16 self-center my-4 lg:w-2/5 lg:max-w-md rounded-md w-full">
				<h4 className="text-black text-center text-3xl my-4 font-semibold">
					Topic View
				</h4>
				<p className="text-center text-black pb-4">
					Click on a Topic to view the associated Messages.
				</p>
				<CustomAccordion data={data} />
			</div>
		</div>
	)
}

export default Form
