const checkEditorType = async () => {
  return figma.ui.postMessage({
    type: 'CHECK_EDITOR',
    data: {
      id: figma.currentUser?.id,
      editor: figma.vscode ? 'dev_vscode' : figma.editorType,
    },
  })
}

export default checkEditorType
