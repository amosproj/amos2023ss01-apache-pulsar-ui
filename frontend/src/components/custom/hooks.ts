import { useEffect, useRef } from 'react'

export function useInterval(callback: () => void, delay: number | null) {
	const savedCallback = useRef<(() => void) | null>(() => undefined)

	// Remember the latest callback.
	useEffect(() => {
		savedCallback.current = callback
	}, [callback])

	// Set up the interval.
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
