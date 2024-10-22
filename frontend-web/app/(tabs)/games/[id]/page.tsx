import { notFound } from 'next/navigation'
import { getGameById } from '@/services/api'
import GameDetails from '@/components/GameDetails'

export default async function GamePage({ params }: { params: { id: string } }) {
  try {
    const game = await getGameById(params.id)
    return <GameDetails game={game} />
  } catch (error) {
    notFound()
  }
}