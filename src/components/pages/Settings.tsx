import { doc, updateDoc } from 'firebase/firestore'
import { useAtom } from 'jotai'
import { useEffect, useState } from 'react'
import { userAtom } from '../../atoms/userAtom'
import { db } from '../../firebase'

function Settings() {
  const [userData] = useAtom(userAtom)
  const [targetUserId, setTargetUserId] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (userData?.targetUserId) {
      setTargetUserId(userData.targetUserId)
    }
  }, [userData])

  const handleSave = async () => {
    if (!userData) return

    // 入力値の検証
    if (!targetUserId.trim()) {
      setMessage('アカウントIDを入力してください')
      return
    }

    // @マークを削除
    const cleanedUserId = targetUserId.replace(/^@/, '').trim()

    if (!cleanedUserId) {
      setMessage('有効なアカウントIDを入力してください')
      return
    }

    setLoading(true)
    setMessage('')

    try {
      const userDocRef = doc(db, 'users', userData.uid)
      await updateDoc(userDocRef, {
        targetUserId: cleanedUserId,
        updatedAt: new Date(),
      })

      setMessage('設定を保存しました')
      setTargetUserId(cleanedUserId)
    } catch (error) {
      console.error('設定の保存エラー:', error)
      setMessage('設定の保存に失敗しました')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2>設定</h2>
      <div style={{ margin: '20px 0' }}>
        <label>
          ストーキング対象のアカウントID:
          <input
            type="text"
            value={targetUserId}
            onChange={(e) => setTargetUserId(e.target.value)}
            placeholder="@username または username"
            style={{ marginLeft: '10px', padding: '5px', width: '200px' }}
            disabled={loading}
          />
        </label>
      </div>

      <button
        type="button"
        onClick={handleSave}
        disabled={loading}
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          backgroundColor: loading ? '#ccc' : '#1d9bf0',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: loading ? 'not-allowed' : 'pointer',
        }}
      >
        {loading ? '保存中...' : '設定を保存'}
      </button>

      {message && (
        <div
          style={{
            marginTop: '10px',
            padding: '10px',
            backgroundColor: message.includes('失敗') ? '#ffebee' : '#e8f5e8',
            color: message.includes('失敗') ? '#c62828' : '#2e7d32',
            borderRadius: '4px',
          }}
        >
          {message}
        </div>
      )}
    </div>
  )
}

export default Settings
