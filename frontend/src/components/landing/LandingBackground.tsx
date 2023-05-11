import React from 'react'
import '../../assets/styles/landing.scss'

interface LandingPageProps {
	children: React.ReactNode
}

const LandingBackground: React.FC<LandingPageProps> = ({ children }) => {
	return (
		<>
			<header>
				<div className="header-container">
					<div className="semi-circle">hello</div>
				</div>
			</header>
			<main>{children}</main>
			<footer>footer</footer>
		</>
	)
}

export default LandingBackground
