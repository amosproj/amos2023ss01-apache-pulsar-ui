import React, { useState } from 'react'
import { Modal, Box, Typography } from '@mui/material'

/*
Nr of Topics used:
List of Topics: [Topic_2]
Nr of Messages:
List of Messages: []
*/

interface ProducerModalProps {
	producer: {
		producerName: string
		topicAmount?: number
		topicList: [] | Array<string>
		messageAmount?: number
		messageList: [] | Array<string>
	}
}

const ProducerModal: React.FC<ProducerModalProps> = ({ producer }) => {
	const [open, setOpen] = useState(false)

	const handleOpen = () => {
		setOpen(true)
	}

	const handleClose = () => {
		setOpen(false)
	}

	return (
		<>
			<span onClick={handleOpen} style={{ cursor: 'pointer' }}>
				{producer.producerName},{' '}
			</span>
			<Modal open={open} onClose={handleClose}>
				<Box
					sx={{
						position: 'absolute',
						top: '50%',
						left: '50%',
						transform: 'translate(-50%, -50%)',
						bgcolor: 'background.paper',
						boxShadow: 24,
						p: 4,
						maxWidth: 500,
						width: '100%',
						maxHeight: '80vh',
						overflowY: 'auto',
					}}
				>
					<Typography variant="h5" component="h2" gutterBottom>
						Producer Name: {producer.producerName}
					</Typography>
					<Typography variant="body1" gutterBottom>
						Nr of Topics used: {producer.topicAmount}
					</Typography>
					<Typography variant="body1" gutterBottom>
						List of Topics:{' '}
						{producer.topicList.map((item: string, index: number) => (
							<span key={index} className="text-blue">
								{item},{' '}
							</span>
						))}
					</Typography>
					<Typography variant="body1" gutterBottom>
						Nr of Messages: {producer.topicAmount}
					</Typography>
					<Typography variant="body1" gutterBottom>
						List of Messages:{' '}
						{producer.topicList.map((item: string, index: number) => (
							<span key={index} className="text-blue">
								{item},{' '}
							</span>
						))}
					</Typography>
				</Box>
			</Modal>
		</>
	)
}

export default ProducerModal
