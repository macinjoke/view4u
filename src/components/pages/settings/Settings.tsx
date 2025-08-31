import { Alert, Box, Button, Field, Input } from '@chakra-ui/react'
import { doc, updateDoc } from 'firebase/firestore'
import { useAtom } from 'jotai'
import { useEffect, useState } from 'react'
import { userAtom } from '../../../atoms/userAtom'
import { db } from '../../../firebase'

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
    <Box p={5}>
      <Box mb={6}>
        <Field.Root>
          <Field.Label>見守りたい対象のアカウントID:</Field.Label>
          <Input
            value={targetUserId}
            onChange={(e) => setTargetUserId(e.target.value)}
            placeholder="@username または username"
            disabled={loading}
            mt={2}
          />
        </Field.Root>
      </Box>

      <Button onClick={handleSave} loading={loading} colorScheme="twitter" mb={4}>
        {loading ? '保存中...' : '設定を保存'}
      </Button>

      {message && (
        <Alert.Root status={message.includes('失敗') ? 'error' : 'success'}>
          <Alert.Indicator />
          {message}
        </Alert.Root>
      )}
    </Box>
  )
}

export default Settings
