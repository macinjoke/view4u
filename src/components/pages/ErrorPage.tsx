import { useRouteError } from 'react-router-dom'

function ErrorPage() {
  const error = useRouteError() as Error & { status?: number; statusText?: string }

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>エラーが発生しました</h1>
      <p>申し訳ございません。予期しないエラーが発生しました。</p>
      {error && (
        <div
          style={{
            marginTop: '20px',
            padding: '10px',
            backgroundColor: '#f8f8f8',
            borderRadius: '4px',
          }}
        >
          <p>
            <strong>エラー詳細:</strong>
          </p>
          <p>
            {error.status} {error.statusText}
          </p>
          <p>{error.message}</p>
        </div>
      )}
    </div>
  )
}

export default ErrorPage
