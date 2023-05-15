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
import { useAppDispatch, useAppSelector } from '../store/hooks'
import {
	backToLP,
	selectEndpoint,
	selectView,
	setNav,
} from '../store/globalSlice'
import logo from '../assets/images/team-logo-light.png'
import { Input } from '@mui/material'
import { InfoModal } from './InfoModal'

//Removed 'Message' from this array for now
const pages = ['Cluster', 'Namespace', 'Topic']

function NavBar() {
	const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null)

	const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorElNav(event.currentTarget)
	}
	const dispatch = useAppDispatch()
	const selectedNav = useAppSelector(selectView).selectedNav

	const handleCloseNavMenu = () => {
		setAnchorElNav(null)
	}

	const handleClickOnNav = (tag: string) => {
		tag = tag.toLowerCase()
		dispatch(setNav(tag))
	}

	const handleClickOnDisconnect = () => {
		//TODO add disconnect functionality
		dispatch(backToLP())
	}

	const endpoint = useAppSelector(selectEndpoint)

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
					<Input
						disabled
						defaultValue={endpoint}
						inputProps={{ style: { textAlign: 'center' } }}
						size="small"
						style={{
							width: '110px',
							marginLeft: '20px',
							marginRight: '5px',
							textAlign: 'center',
							background: 'white',
						}}
					/>
					<Button
						variant="outlined"
						style={{ color: 'white', background: '#ba000d' }}
						size="small"
						onClick={handleClickOnDisconnect}
					>
						Disconnect
					</Button>
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
									disabled={page.toLowerCase() == selectedNav}
									onClick={() => {
										handleClickOnNav(page)
									}}
								>
									<Typography textAlign="center">{page}</Typography>
								</MenuItem>
							))}
						</Menu>
					</Box>
					<Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
						{pages.map((page) => (
							<Button
								key={page}
								disabled={page.toLowerCase() == selectedNav}
								onClick={() => {
									handleClickOnNav(page)
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
