import renderer from 'react-test-renderer'
import Link from '../components/Link'
import React from 'react'

it('changes the class when hovered', () => {
	const component = renderer.create(
		<Link page="http://www.facebook.com">Facebook</Link>
	)
	let tree = component.toJSON()
	expect(tree).toMatchSnapshot()

	// manually trigger the callback
	renderer.act(() => {
		tree.props.onMouseEnter()
	})
	// re-rendering
	tree = component.toJSON()
	expect(tree).toMatchSnapshot()

	// manually trigger the callback
	renderer.act(() => {
		tree.props.onMouseLeave()
	})
	// re-rendering
	tree = component.toJSON()
	expect(tree).toMatchSnapshot()
})
