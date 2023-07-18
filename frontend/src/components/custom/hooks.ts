// SPDX-License-Identifier: MIT
// SPDX-FileCopyrightText: 2023 Julian Tochman-Szewc <tochman-szewc@campus.tu-berlin.de>
// SPDX-FileCopyrightText: 2023 Shahraz Nasir <shahraz.nasir@campus.tu-berlin.de>
// SPDX-FileCopyrightText: 2023 Ziqi He <ziqi.he@fau.de>
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
