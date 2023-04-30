import React from 'react'
import { useState } from 'react'

//TODO correct type
// prettier-ignore
interface LinkProps {
	page?: any
	children: any
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
