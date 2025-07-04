import { getFirestore } from 'firebase-admin/firestore'

const db = getFirestore()

// Firestoreの設定コレクション
const MOCK_CONFIG_COLLECTION = 'mock_config'
const MOCK_FLAGS_DOC = 'flags'

export interface MockFlags {
  shouldTrigger429: boolean
  lastUpdated: Date
  updatedBy: string
}

// 429エラーフラグを取得
export async function getMock429Flag(): Promise<boolean> {
  try {
    const doc = await db.collection(MOCK_CONFIG_COLLECTION).doc(MOCK_FLAGS_DOC).get()

    if (!doc.exists) {
      // デフォルト値を設定
      const defaultFlags: MockFlags = {
        shouldTrigger429: false,
        lastUpdated: new Date(),
        updatedBy: 'system',
      }
      await db.collection(MOCK_CONFIG_COLLECTION).doc(MOCK_FLAGS_DOC).set(defaultFlags)
      return false
    }

    const data = doc.data() as MockFlags
    return data.shouldTrigger429
  } catch (error) {
    console.error('Failed to get mock 429 flag:', error)
    return false // エラー時はデフォルトでfalse
  }
}

// 429エラーフラグを設定
export async function setMock429Flag(shouldTrigger: boolean, updatedBy: string): Promise<void> {
  try {
    const flags: MockFlags = {
      shouldTrigger429: shouldTrigger,
      lastUpdated: new Date(),
      updatedBy,
    }

    await db.collection(MOCK_CONFIG_COLLECTION).doc(MOCK_FLAGS_DOC).set(flags)
  } catch (error) {
    console.error('Failed to set mock 429 flag:', error)
    throw error
  }
}

// 429エラーフラグを切り替え
export async function toggleMock429Flag(updatedBy: string): Promise<boolean> {
  try {
    const currentFlag = await getMock429Flag()
    const newFlag = !currentFlag
    await setMock429Flag(newFlag, updatedBy)
    return newFlag
  } catch (error) {
    console.error('Failed to toggle mock 429 flag:', error)
    throw error
  }
}
