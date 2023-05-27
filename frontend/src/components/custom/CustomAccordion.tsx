import * as React from 'react'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import Typography from '@mui/material/Typography'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

const CustomAccordion: React.FC<CustomAccordionProps> = ({ data }) => {
	return (
		<div data-testid="demo-accordion">
			{data &&
				data.length > 0 &&
				data.map((item) => (
					<Accordion key={'accordion-' + Math.floor(Math.random() * 999999)}>
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
								item.messages.map((message: Message) => (
									<Typography
										key={'typography-' + Math.floor(Math.random() * 999999)}
									>
										{message.value}
									</Typography>
								))}
						</AccordionDetails>
					</Accordion>
				))}
		</div>
	)
}

export default CustomAccordion
