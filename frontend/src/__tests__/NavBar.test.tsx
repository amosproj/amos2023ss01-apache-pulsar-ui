import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { Provider } from 'react-redux'
import NavBar from '../components/NavBar'
import store from '../store'
import { backToLP, setNav } from '../store/globalSlice'

// Spy on the dispatch function
jest.spyOn(store, 'dispatch')

test('disconnect button dispatches backToLP reducer', () => {
	render(
		<Provider store={store}>
			<NavBar />
		</Provider>
	)

	const disconnectButton = screen.getByRole('button', { name: /disconnect/i })
	fireEvent.click(disconnectButton)

	// Check that 'backToLP' action was dispatched when Disconnect button was clicked
	expect(store.dispatch).toHaveBeenCalledWith(backToLP())
})

test('every page button dispatches correct setNav reducer', () => {
	const pages = ['Cluster', 'Namespace', 'Topic']

	render(
		<Provider store={store}>
			<NavBar />
		</Provider>
	)

	pages.forEach((page) => {
		// Get all buttons that match the page name RegExp
		const buttons = screen.getAllByRole('button', {
			name: new RegExp(page, 'i'),
		})

		// Target the specific button you want to test (in this case, the first one)
		const button = buttons[0]
		fireEvent.click(button)

		// Check that 'setNav' action was dispatched with the correct page name
		expect(store.dispatch).toHaveBeenCalledWith(setNav(page.toLowerCase()))
	})
})
