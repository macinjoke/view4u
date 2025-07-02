import { Link, Outlet } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

function Layout() {
  const { user, signOut } = useAuth()

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('ログアウトに失敗しました:', error)
    }
  }

  return (
    <div className="App">
      <nav
        style={{
          padding: '20px',
          backgroundColor: '#f0f0f0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div>
          <Link to="/" style={{ margin: '0 10px' }}>
            ホーム
          </Link>
          {user && (
            <>
              <Link to="/timeline" style={{ margin: '0 10px' }}>
                タイムライン
              </Link>
              <Link to="/settings" style={{ margin: '0 10px' }}>
                設定
              </Link>
            </>
          )}
        </div>

        <div>
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span>こんにちは、{user.displayName || 'ユーザー'}さん</span>
              <button
                type="button"
                onClick={handleSignOut}
                style={{
                  padding: '5px 10px',
                  backgroundColor: '#dc3545',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                ログアウト
              </button>
            </div>
          ) : (
            <Link to="/login" style={{ margin: '0 10px' }}>
              ログイン
            </Link>
          )}
        </div>
      </nav>

      <Outlet />
    </div>
  )
}

export default Layout
