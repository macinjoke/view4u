import { Link, Outlet } from 'react-router-dom'

function Layout() {
  return (
    <div className="App">
      <nav style={{ padding: '20px', backgroundColor: '#f0f0f0' }}>
        <Link to="/" style={{ margin: '0 10px' }}>
          ホーム
        </Link>
        <Link to="/login" style={{ margin: '0 10px' }}>
          ログイン
        </Link>
        <Link to="/timeline" style={{ margin: '0 10px' }}>
          タイムライン
        </Link>
        <Link to="/settings" style={{ margin: '0 10px' }}>
          設定
        </Link>
      </nav>

      <Outlet />
    </div>
  )
}

export default Layout
