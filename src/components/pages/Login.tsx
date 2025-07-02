import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { signInWithTwitter } from '../../lib/auth'

function Login() {
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const handleTwitterLogin = async () => {
    setIsLoading(true)
    try {
      await signInWithTwitter()
      navigate('/')
    } catch (error) {
      console.error('ログインに失敗しました:', error)
      alert('ログインに失敗しました。もう一度お試しください。')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div style={{ padding: '20px', textAlign: 'center', maxWidth: '400px', margin: '50px auto' }}>
      <h2>ログイン</h2>
      <p>Xアカウントでログインしてください</p>
      <button
        type="button"
        onClick={handleTwitterLogin}
        disabled={isLoading}
        style={{
          padding: '12px 24px',
          fontSize: '16px',
          backgroundColor: '#1DA1F2',
          color: 'white',
          border: 'none',
          borderRadius: '25px',
          cursor: isLoading ? 'not-allowed' : 'pointer',
          opacity: isLoading ? 0.6 : 1,
        }}
      >
        {isLoading ? 'ログイン中...' : 'Xでログイン'}
      </button>
    </div>
  )
}

export default Login
