import { atom } from 'jotai'

export interface UserData {
  uid: string
  displayName: string | null
  email: string | null
  photoURL: string | null
  targetUserId?: string
  updatedAt: Date
}

export const userAtom = atom<UserData | null>(null)
