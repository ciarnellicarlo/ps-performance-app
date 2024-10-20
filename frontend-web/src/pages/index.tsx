import type { NextPage } from 'next'
import HomeScreen from '../components/HomeScreen'

const Home: NextPage = () => {
  return (
    <div style={{ backgroundColor: '#1E1E2E', minHeight: '100vh' }}>
      <HomeScreen />
    </div>
  )
}

export default Home