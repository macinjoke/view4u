function Timeline() {
  return (
    <div style={{ padding: '20px' }}>
      <h2>タイムライン</h2>
      <p>対象アカウントの投稿一覧</p>
      <div style={{ border: '1px solid #ccc', padding: '10px', margin: '10px 0' }}>
        <strong>@example_user</strong>
        <p>これはダミーのツイートです。</p>
        <small>2024-01-01 12:00</small>
      </div>
      <div style={{ border: '1px solid #ccc', padding: '10px', margin: '10px 0' }}>
        <strong>@example_user</strong>
        <p>もう一つのダミーツイートです。</p>
        <small>2024-01-01 11:30</small>
      </div>
    </div>
  )
}

export default Timeline
