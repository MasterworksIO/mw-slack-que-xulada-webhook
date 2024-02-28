import { weightedRandom } from '../utils/weightedRandom'

const CELEBRATORY_REACTIONS = [
  { name: 'burrito', weight: 10 },
  { name: 'clap', weight: 10 },
  { name: 'handshake', weight: 10 },
  { name: 'muscle', weight: 10 },
  { name: 'party_parrot', weight: 10 },
  { name: 'pray', weight: 10 },
  { name: 'raised_hands', weight: 10 },
  { name: 'taco', weight: 10 },
  { name: '100', weight: 5 },
  { name: 'blob-dance', weight: 5 },
  { name: 'saluting_face', weight: 5 },
  { name: 'pepehappy', weight: 1 },
  { name: 'taco-winner', weight: 1 },
  { name: '3808-prayge', weight: 1 },
] as const

type Reaction = (typeof CELEBRATORY_REACTIONS)[number]['name']

export const pickReaction = (): Reaction => {
  const weights = CELEBRATORY_REACTIONS.map(({ weight }) => weight)
  const index = weightedRandom(weights)
  return CELEBRATORY_REACTIONS[index as 1].name
}
