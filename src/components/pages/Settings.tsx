function Settings() {
  return (
    <div style={{ padding: '20px' }}>
      <h2>設定</h2>
      <div style={{ margin: '20px 0' }}>
        <label>
          ストーキング対象のアカウント:
          <input
            type="text"
            placeholder="@username"
            style={{ marginLeft: '10px', padding: '5px' }}
          />
        </label>
      </div>
      <button type="button" style={{ padding: '10px 20px', fontSize: '16px' }}>
        設定を保存
      </button>
    </div>
  )
}

export default Settings
