const checkEditorType = () =>
  figma.ui.postMessage({
    type: 'EDITOR_TYPE',
    data: figma.editorType,
  })

export default checkEditorType