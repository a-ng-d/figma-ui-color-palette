export interface ReleaseNote {
  version: string
  isMostRecent: boolean
  title: string
  image: string
  content: string
  learnMore: string
}

const releaseNotes: Array<ReleaseNote> = [
  {
    version: '1.8.0',
    isMostRecent: true,
    title: 'Version 18 has been removed from the oven',
    image: 'https://placehold.co/264x148.png',
    content:
      "Ecoute pouilleux ! Pour moi tu n'es q'une merde de chien qui s'étale sur un trottoir... Et tu sais ce qu'on fait d'une merde de ce genre ? On peut  l'enlever soigneusement  avec une pelle, on peut laisser la pluie et le vent la balayer où bien on peut l'écraser. Alors si tu veux un conseil d'ami, choisi bien l'endroit où on te chiera.",
    learnMore: 'https://kutt.it/uicp-v18',
  },
]

export default releaseNotes
