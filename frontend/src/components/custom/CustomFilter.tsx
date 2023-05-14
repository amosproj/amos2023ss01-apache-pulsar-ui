import React from 'react'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import CustomCheckbox from './CustomCheckbox'

const CustomFilter: React.FC<CustomFilterProps> = ({
	data,
	handleChange,
	selectedClusters,
	selectedNamespaces,
	selectedTopics,
	currentView,
}) => {
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

	const viewLevelTwo = currentView === 'namespace' || currentView === 'topic'

	return (
		<div className="flex flex-col">
			<Accordion>
				<AccordionSummary
					expandIcon={<ExpandMoreIcon />}
					aria-controls="panel1a-content"
					id="panel1a-header"
				>
					<h3 className="filter-title">Clusters</h3>
				</AccordionSummary>
				<AccordionDetails>
					<div className="flex flex-col">
						{data &&
							data.length > 0 &&
							data.map((item: SampleCluster) => (
								<CustomCheckbox
									key={item.id + Math.floor(Math.random() * 999999)}
									text={item.id}
									typology={'cluster'}
									changeFunc={handleChange}
									selected={selectedClusters.includes(item.id) ? true : false}
								></CustomCheckbox>
							))}
					</div>
				</AccordionDetails>
			</Accordion>
			{viewLevelTwo && (
				<Accordion>
					<AccordionSummary
						expandIcon={<ExpandMoreIcon />}
						aria-controls="panel1a-content"
						id="panel1a-header"
					>
						<h3 className="filter-title">Namespaces</h3>
					</AccordionSummary>
					<AccordionDetails>
						<div className="flex flex-col">
							{allNamespaces &&
								allNamespaces.length > 0 &&
								allNamespaces.map((item: SampleNamespace) => (
									<CustomCheckbox
										key={item.id + Math.floor(Math.random() * 999999)}
										text={item.id}
										typology={'namespace'}
										changeFunc={handleChange}
										selected={
											selectedNamespaces.includes(item.id) ? true : false
										}
									></CustomCheckbox>
								))}
						</div>
					</AccordionDetails>
				</Accordion>
			)}
			{currentView === 'topic' && (
				<Accordion>
					<AccordionSummary
						expandIcon={<ExpandMoreIcon />}
						aria-controls="panel1a-content"
						id="panel1a-header"
					>
						<h3 className="filter-title">Topics</h3>
					</AccordionSummary>
					<AccordionDetails>
						<div className="flex flex-col">
							{allTopics &&
								allTopics.length > 0 &&
								allTopics.map((item: SampleTopic) => (
									<CustomCheckbox
										key={item.id + Math.floor(Math.random() * 999999)}
										text={item.id}
										typology={'topic'}
										changeFunc={handleChange}
										selected={selectedTopics.includes(item.id) ? true : false}
									></CustomCheckbox>
								))}
						</div>
					</AccordionDetails>
				</Accordion>
			)}
		</div>
	)
}

export default CustomFilter
