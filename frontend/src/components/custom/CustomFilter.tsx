import React from 'react'
import FormGroup from '@mui/material/FormGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

const CustomFilter: React.FC<CustomFilterProps> = ({ data, handleChange }) => {
	const allTenants = data
		.map((item) => item.tenants)
		.filter((el) => el.length > 0)
		.flat()

	const allNamespaces = allTenants
		.map((tenant) => tenant.namespaces)
		.filter((el) => el.length > 0)
		.flat()

	const allTopics = allNamespaces
		.map((namespace) => namespace.topics)
		.filter((el) => el.length > 0)
		.flat()
	return (
		<div className="flex flex-col">
			<FormGroup>
				<Accordion>
					<AccordionSummary
						expandIcon={<ExpandMoreIcon />}
						aria-controls="panel1a-content"
						id="panel1a-header"
					>
						<h3 className="filter-title">Clusters</h3>
					</AccordionSummary>
					<AccordionDetails>
						{data &&
							data.length > 0 &&
							data.map(
								(
									item:
										| SampleCluster
										| SampleTenant
										| SampleNamespace
										| SampleTopic
								) => (
									<FormControlLabel
										key={item.id + Math.floor(Math.random() * 999999)}
										control={
											<Checkbox
												onChange={() => handleChange(item.id, 'cluster')}
												inputProps={{ 'aria-label': 'controlled' }}
											/>
										}
										label={item.id}
									/>
								)
							)}
					</AccordionDetails>
				</Accordion>
				<Accordion>
					<AccordionSummary
						expandIcon={<ExpandMoreIcon />}
						aria-controls="panel1a-content"
						id="panel1a-header"
					>
						<h3 className="filter-title">Namespaces</h3>
					</AccordionSummary>
					<AccordionDetails>
						{allNamespaces &&
							allNamespaces.length > 0 &&
							allNamespaces.map(
								(
									item:
										| SampleCluster
										| SampleTenant
										| SampleNamespace
										| SampleTopic
								) => (
									<FormControlLabel
										key={item.id + +Math.floor(Math.random() * 999999)}
										control={
											<Checkbox
												onChange={() => handleChange(item.id, 'namespace')}
												inputProps={{ 'aria-label': 'controlled' }}
											/>
										}
										label={item.id}
									/>
								)
							)}
					</AccordionDetails>
				</Accordion>
				<Accordion>
					<AccordionSummary
						expandIcon={<ExpandMoreIcon />}
						aria-controls="panel1a-content"
						id="panel1a-header"
					>
						<h3 className="filter-title">Topics</h3>
					</AccordionSummary>
					<AccordionDetails>
						{allTopics &&
							allTopics.length > 0 &&
							allTopics.map(
								(
									item:
										| SampleCluster
										| SampleTenant
										| SampleNamespace
										| SampleTopic
								) => (
									<FormControlLabel
										key={item.id + Math.floor(Math.random() * 999999)}
										control={
											<Checkbox
												onChange={() => handleChange(item.id, 'topic')}
												inputProps={{ 'aria-label': 'controlled' }}
											/>
										}
										label={item.id}
									/>
								)
							)}
					</AccordionDetails>
				</Accordion>
			</FormGroup>
		</div>
	)
}

export default CustomFilter
