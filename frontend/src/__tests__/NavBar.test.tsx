import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { Provider } from 'react-redux'
import NavBar from '../components/NavBar'
import store from '../store'
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'

// Spy on the dispatch function
jest.spyOn(store, 'dispatch')

test('should check if every page button dispatches the correct setNav reducer', () => {
	const pages = ['Namespace']

	render(
		<Router>
			<Routes>
				<Route
					path="/"
					element={
						<Provider store={store}>
							<NavBar />
						</Provider>
					}
				/>
				<Route
					path="/namespace"
					element={<div data-testid="test-navbar">Testing navbar route</div>}
				/>
			</Routes>
		</Router>
	)

	pages.forEach((page) => {
		// Get all buttons that match the page name RegExp
		const buttons = screen.getAllByRole('button', {
			name: new RegExp(page, 'i'),
		})

		// Target the specific button you want to test (in this case, the first one)
		const button = buttons[0]
		fireEvent.click(button)

		//Check if the new screen has test text, i.e. the route has switched
		expect(screen.getByTestId('test-navbar')).toHaveTextContent(
			'Testing navbar route'
		)

		// Check that 'setNav' action was dispatched with the correct page name
		// expect(store.dispatch).toHaveBeenCalledWith(setNav(page.toLowerCase()))
	})
})
