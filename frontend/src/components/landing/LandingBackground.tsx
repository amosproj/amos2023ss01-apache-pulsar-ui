import React from 'react'
import '../../assets/styles/landing.scss'

interface LandingPageProps {
	children: React.ReactNode
}

const LandingBackground: React.FC<LandingPageProps> = ({ children }) => {
	return (
		<div className="landing-container">
			<header>
				<div className="header-container">
					<div className="semi-circle"></div>
				</div>
			</header>
			<main>
				<div>{children}</div>
			</main>
			<footer>
				<div className="footer-container">
					<div className="semi-circle"></div>
				</div>
			</footer>
		</div>
	)
}

export default LandingBackground
