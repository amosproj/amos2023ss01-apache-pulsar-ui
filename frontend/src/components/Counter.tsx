import React from 'react'
import { useState } from 'react'

export default function Counter() {
	const [count, setCount] = useState<number>(0)
	return (
		<div>
			<h1>Counter</h1>
			<hr />
			<button
				data-testid="counter-button"
				onClick={() => setCount((count) => count + 1)}
			>
				count is {count}
			</button>
		</div>
	)
}
