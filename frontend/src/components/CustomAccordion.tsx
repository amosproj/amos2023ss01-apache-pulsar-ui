import * as React from 'react'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import Typography from '@mui/material/Typography'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

interface CustomAccordionProps {
	data: Array<any>
}

const CustomAccordion: React.FC<CustomAccordionProps> = ({ data }) => {
	return (
		<div>
			{data &&
				data.length > 0 &&
				data.map((item) => (
					<Accordion key={item.id}>
						<AccordionSummary
							expandIcon={<ExpandMoreIcon />}
							aria-controls="panel1a-content"
							id="panel1a-header"
						>
							<Typography>{item.name}</Typography>
						</AccordionSummary>
						<AccordionDetails>
							<p className="text-blue">Topic Messages:</p>
							{item.messages.length > 0 &&
								item.messages.map((message: any) => (
									<Typography key={message.id}>{message.value}</Typography>
								))}
						</AccordionDetails>
					</Accordion>
				))}
		</div>
	)
}

export default CustomAccordion
