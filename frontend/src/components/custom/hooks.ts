// SPDX-License-Identifier: MIT
// SPDX-FileCopyrightText: 2010-2021 Dirk Riehle <dirk@riehle.org
// SPDX-FileCopyrightText: 2019 Georg Schwarz <georg. schwarz@fau.de>

import { useEffect, useRef } from 'react'

export function useInterval(callback: () => void, delay: number | null) {
	const savedCallback = useRef<(() => void) | null>(() => undefined)

	// Remembers the latest callback.
	useEffect(() => {
		savedCallback.current = callback
	}, [callback])

	// Sets up the interval.
	useEffect(() => {
		const tick = () => {
			if (savedCallback.current !== null) {
				savedCallback.current()
			}
		}
		if (delay !== null) {
			const id = setInterval(tick, delay)
			return () => clearInterval(id)
		}
	}, [delay])
}
