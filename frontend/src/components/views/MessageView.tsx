import React, { useState } from 'react'
import graph1 from '../../assets/images/demo-graph1.png'
import graph2 from '../../assets/images/demo-graph2.png'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import { Collapse, CardActions, Button } from '@mui/material'

const MessageView: React.FC<MessageViewProps> = ({ data }) => {
	const [expanded, setExpanded] = useState(false)

	const handleExpand = () => {
		//TODO if(!data) fetch detailed data
		setExpanded(!expanded)
	}

	return (
		<div className="flex flex-col card-content">
			<h2 className="uppercase">{data?.payload}</h2>
			<div className="grey-line"></div>
			<div className="flex card-inner">
				<div className="flex flex-col card-col card-col-1">
					<div className="flex flex-col card-info">
						<p className="text-black">
							Cluster:{' '}
							<span className="text-blue">
								{data?.cluster ? data.cluster : 'N/A'}
							</span>
						</p>
						<p className="text-black">
							Tenant:{' '}
							<span className="text-blue">
								{data?.tenant ? data.tenant : 'N/A'}
							</span>
						</p>
						<p className="text-black">
							Namespace:{' '}
							<span className="text-blue">
								{data?.namespace ? data.namespace : 'N/A'}
							</span>
						</p>
						<p className="text-black">
							Topic:{' '}
							<span className="text-blue">
								{data?.topic ? data.topic : 'N/A'}
							</span>
						</p>
					</div>
				</div>
			</div>
			<Collapse in={expanded} timeout="auto" unmountOnExit>
				<div className="flex card-inner">
					<div className="flex flex-col card-col card-col-1">
						<div className="flex flex-col card-info">
							<div className="grey-line"></div>
							<div className="flex flex-col card-info">
								<p className="text-black">
									Schema:{' '}
									<span className="text-blue">
										{data?.schema ? data.schema : 'N/A'}
									</span>
								</p>
								<p className="text-black">
									Message ID:{' '}
									<span className="text-blue">
										{data?.id ? data.id : 'N/A'}
									</span>
								</p>
								<p className="text-black">
									Publish time:{' '}
									<span className="text-blue">
										{data?.publishTime ? data.publishTime : 'N/A'}
									</span>
								</p>
							</div>
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
				</CardActions>
			</div>
		</div>
	)
}

export default MessageView
