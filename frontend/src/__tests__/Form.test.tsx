import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import Form from '../components/form/Form'
import { Provider } from 'react-redux'
import store from '../store'

const triggerUpdateTest = (msg: string, tpc: string) => {
	console.log(msg, tpc)
}

const dataTest = [
	{
		id: '100',
		name: 'Topic 1',
		messages: [
			{
				id: '1001',
				value: 'Test value 1',
				topic: '100',
			},
			{
				id: '1002',
				value: 'Test value 2',
				topic: '100',
			},
			{
				id: '1003',
				value: 'Test value 3',
				topic: '100',
			},
		],
	},
	{
		id: '200',
		name: 'Topic 2',
		messages: [
			{
				id: '2001',
				value: 'Test value 1',
				topic: '200',
			},
			{
				id: '2002',
				value: 'Test value 2',
				topic: '200',
			},
		],
	},
]

test('should add values to inputs and submit form', async () => {
	const formComponent = render(
		<Provider store={store}>
			<Form data={dataTest} triggerUpdate={triggerUpdateTest} />
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
})
