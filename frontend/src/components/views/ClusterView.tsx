import React, { useState } from 'react'
import graph1 from '../../assets/images/demo-graph1.png'
import graph2 from '../../assets/images/demo-graph2.png'
import { Button, CardActions, Collapse } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'

const ClusterView: React.FC<ClusterViewProps> = ({ data, handleClick }) => {
	const [expanded, setExpanded] = useState(false)

	const handleExpand = () => {
		//TODO if(!data) fetch detailed data
		setExpanded(!expanded)
	}
	return (
		<div className="flex flex-col card-content">
			<h2 className="uppercase">{data.id}</h2>
			<div className="grey-line"></div>
			<Collapse in={expanded} timeout="auto" unmountOnExit>
				<div className="flex card-inner">
					<div className="flex flex-col card-col card-col-1">
						<div className="flex flex-col card-info">
							<p className="text-black">
								Brokers:{' '}
								<span className="text-blue">
									{data?.brokers?.length > 0 ? data.brokers.length : 0}
								</span>
							</p>
							<p className="text-black">
								Bookies:{' '}
								<span className="text-blue">
									{data?.bookies
										? data.bookies.length
											? data.bookies.length
											: 0
										: 0}
								</span>
							</p>
						</div>
						<div className="grey-line"></div>
						<div className="flex flex-col card-info">
							<p className="text-black">
								Namespaces:{' '}
								<span className="text-blue">
									{data?.amountOfNamespaces ? data.amountOfNamespaces : 0}
								</span>
							</p>
							<p className="text-black">
								Topics:{' '}
								<span className="text-blue">
									{data?.amountOfTopics ? data.amountOfTopics : 0}
								</span>
							</p>
						</div>
						<div className="grey-line"></div>
						<div className="flex flex-col card-info">
							<p className="text-black">
								Service URL:{' '}
								<span className="text-blue">
									{data?.serviceUrl ? data.serviceUrl : 'N/A'}
								</span>
							</p>
							<p className="text-black">
								Broker Service URL:{' '}
								<span className="text-blue">
									{data?.brokerServiceUrl ? data.brokerServiceUrl : 'N/A'}
								</span>
							</p>
						</div>
					</div>
				</div>
			</Collapse>
			<div className="flex justify-between">
				{' '}
				<CardActions disableSpacing>
					{expanded ? (
						<Button
							variant={'contained'}
							style={{ marginRight: '10px' }}
							onClick={handleExpand}
							endIcon={<ExpandLessIcon />}
						>
							Hide
						</Button>
					) : (
						<Button
							variant={'contained'}
							style={{ marginRight: '10px' }}
							onClick={handleExpand}
							endIcon={<ExpandMoreIcon />}
						>
							show details
						</Button>
					)}
					<Button variant={'contained'} onClick={(e) => handleClick(e, data)}>
						drill down
					</Button>
				</CardActions>
			</div>
		</div>
	)
}

export default ClusterView
