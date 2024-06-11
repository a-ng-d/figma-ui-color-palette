const checkEditorType = () =>
  figma.ui.postMessage({
    type: 'CHECK_EDITOR_TYPE',
    id: figma.currentUser?.id,
    data: figma.editorType,
  })

export default checkEditorType
