import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import Form from '../components/form/Form'
import { Provider } from 'react-redux'
import store from '../store'

test('should add element by submitting form', async () => {
	const formComponent = render(
		<Provider store={store}>
			<Form />
		</Provider>
	)
	const selectinput = formComponent.getByTestId('demo-simple-select')
	fireEvent.change(selectinput, { target: { value: '100' } })
	const textinput = formComponent.getByTestId('demo-simple-texfield')
	fireEvent.change(textinput as HTMLInputElement, {
		target: { value: 'Test with Jest' },
	})
	expect((textinput as HTMLInputElement).value).toBe('Test with Jest')
	const form = await formComponent.findByTestId('demo-message-form')
	fireEvent.submit(form)

	expect(formComponent).toMatchSnapshot()
})
