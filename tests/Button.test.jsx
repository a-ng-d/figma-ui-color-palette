import renderer from 'react-test-renderer'
import * as React from 'react'
import Button from '../src/ui/components/Button'

it('create a color palette when clicked', () => {
	const component = renderer.create(
		<Button
			type="primary"
			label="Create a color palette"
			feature="create"
		/>
	)
	let tree = component.toJSON()
	expect(tree).toMatchSnapshot()

	renderer.act(() => {
    tree.props.onCreatePalette
  })
  tree = component.toJSON()
  expect(tree).toMatchSnapshot()
})

it('create local colors when clicked', () => {
	const component = renderer.create(
		<Button
			type="primary"
			label="Create local styles"
			feature="create"
		/>
	)
	let tree = component.toJSON()
	expect(tree).toMatchSnapshot()

	renderer.act(() => {
    tree.props.onCreateLocalColors
  })
  tree = component.toJSON()
  expect(tree).toMatchSnapshot()
})

it('update local colors when clicked', () => {
	const component = renderer.create(
		<Button
			type="secondary"
			label="Update the local styles"
			feature="update"
		/>
	)
	let tree = component.toJSON()
	expect(tree).toMatchSnapshot()

	renderer.act(() => {
    tree.props.onUpdateLocalColors
  })
  tree = component.toJSON()
  expect(tree).toMatchSnapshot()
})