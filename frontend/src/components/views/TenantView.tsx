// SPDX-License-Identifier: MIT
// SPDX-FileCopyrightText: 2010-2021 Dirk Riehle <dirk@riehle.org
// SPDX-FileCopyrightText: 2019 Georg Schwarz <georg. schwarz@fau.de>

import React, { useState } from 'react'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import { Collapse, CardActions, Button } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { addFilter } from '../../store/filterSlice'
import { useAppDispatch } from '../../store/hooks'

const TenantView: React.FC<TenantViewProps> = ({ data }) => {
	const { id, adminRoles }: TenantInfo = data

	const [expanded, setExpanded] = useState(false)
	const dispatch = useAppDispatch()
	const navigate = useNavigate()

	const handleDrillDown = () => {
		dispatch(addFilter({ filterName: 'tenant', id: id }))
		navigate('/namespace')
	}
	const handleExpand = () => {
		//TODO if(!data) fetch detailed data
		setExpanded(!expanded)
	}

	return (
		<div className="flex flex-col card-content">
			<h2 className="uppercase">{id}</h2>
			<div className="flex card-inner">
				<div className="flex flex-col card-col card-col-1">
					<div className="flex flex-col card-info">
						<p className="text-black">
							Admin Roles:{' '}
							<span className="text-blue">
								{adminRoles &&
									adminRoles.length > 0 &&
									adminRoles.map((item: string, index: number) => (
										<span key={index}>{item}, </span>
									))}
							</span>
						</p>
					</div>
					<div className="grey-line"></div>
				</div>
			</div>
			<div className="grey-line"></div>
			<Collapse in={expanded} timeout="auto" unmountOnExit>
				<div className="flex card-inner">
					<div className="flex flex-col card-col card-col-1">
						{/*<div className="flex flex-col card-info">
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
						*/}
					</div>
				</div>
			</Collapse>
			<div className="flex justify-between card-buttons-container">
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
					<Button variant={'contained'} onClick={handleDrillDown}>
						drill down
					</Button>
				</CardActions>
			</div>
		</div>
	)
}

export default TenantView
