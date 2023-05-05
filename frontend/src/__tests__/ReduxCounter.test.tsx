import React from 'react'
import { render, screen } from '@testing-library/react'
import { ReduxCounter } from '../components/sampleCounter/ReduxCounter'
import { Provider } from 'react-redux'
import store from '../store'

test('should render ReduxCounter component', () => {
	render(
		<Provider store={store}>
			<ReduxCounter />
		</Provider>
	)
	const counterElement = screen.getByTestId('redux-counter')
	expect(counterElement).toBeInTheDocument()
})
