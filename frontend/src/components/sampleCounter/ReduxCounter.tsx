import React, { useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import {
	decrement,
	increment,
	incrementByAmount,
	incrementAsync,
	selectCount,
} from './counterSlice'

export function ReduxCounter() {
	const count = useAppSelector(selectCount)
	const dispatch = useAppDispatch()
	const [incrementAmount, setIncrementAmount] = useState('2')

	return (
		<div data-testid="redux-counter">
			<h1>Redux Counter</h1>
			<div>
				<button
					aria-label="Increment value"
					onClick={() => dispatch(increment())}
				>
					+
				</button>
				<span>{count}</span>
				<button
					aria-label="Decrement value"
					onClick={() => dispatch(decrement())}
				>
					-
				</button>
				<input
					aria-label="Set increment amount"
					value={incrementAmount}
					onChange={(e) => setIncrementAmount(e.target.value)}
				/>
				<button
					onClick={() =>
						dispatch(incrementByAmount(Number(incrementAmount) || 0))
					}
				>
					Add Amount
				</button>
				<button
					onClick={() => dispatch(incrementAsync(Number(incrementAmount) || 0))}
				>
					Add Async
				</button>
			</div>
		</div>
	)
}
