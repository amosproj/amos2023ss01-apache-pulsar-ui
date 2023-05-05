import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { AppDispatch, RootState } from '../../store'

// Define a type for the slice state
interface CounterState {
	value: number
}

// Define the initial state using that type
const initialState: CounterState = {
	value: 0,
}

export const counterSlice = createSlice({
	name: 'counter', // action type
	initialState,
	reducers: {
		increment: (state) => {
			state.value += 1
		},
		decrement: (state) => {
			state.value -= 1
		},
		// Use the PayloadAction type to declare the contents of `action.payload`
		incrementByAmount: (state, action: PayloadAction<number>) => {
			state.value += action.payload
		},
	},
})

// The function below is called a thunk and allows us to perform async logic.
// It can be dispatched like a regular action: `dispatch(incrementAsync(10))`.
// This will call the thunk with the `dispatch` function as the first argument.
// Async code can then be executed and other actions can be dispatched
export const incrementAsync = (amount: number) => (dispatch: AppDispatch) => {
	setTimeout(() => {
		dispatch(incrementByAmount(amount))
	}, 1000)
}

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state) => state.counter.value)`
export const selectCount = (state: RootState) => state.counter.value

export const { increment, decrement, incrementByAmount } = counterSlice.actions

export default counterSlice.reducer
