import type { NextPage } from 'next'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import HomeScreen from '../components/HomeScreen'

const Home: NextPage = () => {
  const router = useRouter()

  useEffect(() => {
    // Load fonts here if needed
    // You might want to use a custom Font component or CSS to handle font loading
  }, [])

  return (
    <div style={{ backgroundColor: '#1E1E2E', minHeight: '100vh' }}>
      <HomeScreen />
    </div>
  )
}

export default Home