import React, { useState } from 'react'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import { Collapse, CardActions, Button } from '@mui/material'

const NamespaceView: React.FC<NamespaceViewProps> = ({ data, handleClick }) => {
	const [expanded, setExpanded] = useState(false)

	const handleExpand = () => {
		//TODO if(!data) fetch detailed data
		setExpanded(!expanded)
	}

	return (
		<div className="flex flex-col card-content">
			<h2 className="uppercase">{data.id}</h2>
			<div className="flex card-inner">
				<div className="flex flex-col card-col card-col-1">
					<div className="flex flex-col card-info">
						<p className="text-black">
							Cluster:{' '}
							<span className="text-blue">
								{data?.cluster ? data.cluster : 'N/A'}
							</span>
						</p>
					</div>
				</div>
			</div>
			<div className="grey-line"></div>
			<Collapse in={expanded} timeout="auto" unmountOnExit>
				<div className="flex card-inner">
					<div className="flex flex-col card-col card-col-1">
						<div className="flex flex-col card-info">
							<p className="text-black">
								Bundles:{' '}
								<span className="text-blue">
									{data?.bundlesData?.numBundles
										? data.bundlesData?.numBundles
										: 0}
								</span>
							</p>
							<p className="text-black">
								Message TTL:{' '}
								<span className="text-blue">
									{data?.messagesTTL ? data?.messagesTTL : 'None'}
								</span>
							</p>
							<p className="text-black">
								Retention time:{' '}
								<span className="text-blue">
									{data?.retentionPolicies?.retentionTimeInMinutes
										? data?.retentionPolicies.retentionTimeInMinutes +
										  ' minutes'
										: 'None'}
								</span>
							</p>
							<p className="text-black">
								Retention size:{' '}
								<span className="text-blue">
									{data?.retentionPolicies?.retentionSizeInMB
										? data?.retentionPolicies.retentionSizeInMB + ' MB'
										: 'None'}
								</span>
							</p>
						</div>
						<div className="grey-line"></div>
						<div className="flex flex-col card-info">
							<p className="text-black">
								Cluster:{' '}
								<span className="text-blue">
									{data?.cluster ? data.cluster : 'N/A'}
								</span>
							</p>
							<p className="text-black">
								Topics:{' '}
								<span className="text-blue">
									{data?.amountOfTopics ? data.amountOfTopics : 0}
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

export default NamespaceView
