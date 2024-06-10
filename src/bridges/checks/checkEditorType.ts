const checkEditorType = () =>
  figma.ui.postMessage({
    type: 'CHECK_EDITOR_TYPE',
    data: figma.editorType,
  })

export default checkEditorType
