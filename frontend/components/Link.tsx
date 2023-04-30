import React from 'react'
import { useState } from 'react'

interface LinkProps {
	page?: string
	children: React.ReactNode
}

const STATUS = {
	HOVERED: 'hovered',
	NORMAL: 'normal',
}

export default function Link({ page, children }: LinkProps) {
	const [status, setStatus] = useState(STATUS.NORMAL)

	const onMouseEnter = () => {
		setStatus(STATUS.HOVERED)
	}

	const onMouseLeave = () => {
		setStatus(STATUS.NORMAL)
	}

	return (
		<a
			className={status}
			href={page || '#'}
			onMouseEnter={onMouseEnter}
			onMouseLeave={onMouseLeave}
		>
			{children}
		</a>
	)
}
