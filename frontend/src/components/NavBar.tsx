// SPDX-License-Identifier: MIT
// SPDX-FileCopyrightText: 2010-2021 Dirk Riehle <dirk@riehle.org
// SPDX-FileCopyrightText: 2019 Georg Schwarz <georg. schwarz@fau.de>

import * as React from 'react'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Menu from '@mui/material/Menu'
import MenuIcon from '@mui/icons-material/Menu'
import Container from '@mui/material/Container'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import { useAppDispatch } from '../store/hooks'
import { setNav } from '../store/globalSlice'
import logo from '../assets/images/team-logo-light.png'
import { InfoModal } from './InfoModal'
import { useLocation, useNavigate } from 'react-router-dom'
import { updateFilterAccordingToNav } from '../store/filterSlice'
import { Topology } from '../enum'

//Removed 'Message' from this array for now
const pages = [
	Topology.CLUSTER,
	Topology.TENANT,
	Topology.NAMESPACE,
	Topology.TOPIC,
]

function NavBar() {
	const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null)

	const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorElNav(event.currentTarget)
	}
	const dispatch = useAppDispatch()
	const navigate = useNavigate()
	const location = useLocation()

	const handleCloseNavMenu = () => {
		setAnchorElNav(null)
	}

	const handleClickOnNav = (tag: Topology) => {
		//tag = tag.toLowerCase()
		dispatch(setNav(tag))
		navigate('/' + tag)
	}

	return (
		<AppBar position="static">
			<Container maxWidth="xl">
				<Toolbar disableGutters>
					<img
						className="home-logo"
						src={logo}
						alt="logo"
						style={{
							maxHeight: '70px',
							maxWidth: '70px',
							verticalAlign: 'middle',
						}}
					/>
					<Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
						<IconButton
							size="large"
							aria-label="account of current user"
							aria-controls="menu-appbar"
							aria-haspopup="true"
							onClick={handleOpenNavMenu}
							color="inherit"
						>
							<MenuIcon />
						</IconButton>
						<Menu
							id="menu-appbar"
							anchorEl={anchorElNav}
							anchorOrigin={{
								vertical: 'bottom',
								horizontal: 'left',
							}}
							keepMounted
							transformOrigin={{
								vertical: 'top',
								horizontal: 'left',
							}}
							open={Boolean(anchorElNav)}
							onClose={handleCloseNavMenu}
							sx={{
								display: { xs: 'block', md: 'none' },
							}}
						>
							{pages.map((page) => (
								<MenuItem
									key={page}
									disabled={page.toLowerCase() == location.pathname.slice(1)}
									onClick={() => {
										handleClickOnNav(page)
										updateFilterAccordingToNav(page)
									}}
								>
									<Typography textAlign="center">{page}</Typography>
								</MenuItem>
							))}
						</Menu>
					</Box>
					<Box
						sx={{
							flexGrow: 1,
							display: { xs: 'none', md: 'flex' },
							justifyContent: 'center',
						}}
					>
						{pages.map((page) => (
							<Button
								key={page}
								disabled={page.toLowerCase() == location.pathname.slice(1)}
								onClick={() => {
									handleClickOnNav(page)
									dispatch(updateFilterAccordingToNav(page))
								}}
								sx={{ my: 2, color: 'white', display: 'block' }}
							>
								{page}
							</Button>
						))}
					</Box>
					<InfoModal />
				</Toolbar>
			</Container>
		</AppBar>
	)
}
export default NavBar
