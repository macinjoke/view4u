import { ChakraProvider, defaultSystem } from '@chakra-ui/react'
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { persistQueryClient } from '@tanstack/react-query-persist-client'

import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { router } from './router.tsx'

// QueryClientの作成
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Number(import.meta.env.VITE_STALE_TIME) * 60 * 1000, // VITE_STALE_TIME 分はキャッシュを使用
      gcTime: 24 * 60 * 60 * 1000, // 24時間はメモリ内にキャッシュを保持（永続化と同じ期間）
      retry: (failureCount, error) => {
        // 429エラー（レート制限）の場合は再試行しない
        if (error && typeof error === 'object' && 'message' in error) {
          const errorMessage = error.message as string
          if (errorMessage.includes('Rate limit exceeded') || errorMessage.includes('429')) {
            return false
          }
        }
        // その他のエラーは1回だけ再試行
        return failureCount < 1
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // 指数バックオフ
      retryOnMount: false, // マウント時の再試行を無効化
      refetchOnWindowFocus: false, // フォーカス時の再フェッチを無効化
      refetchOnReconnect: false, // 再接続時の再フェッチを無効化
      throwOnError: false, // エラーが発生してもキャッシュされたデータを保持
    },
  },
})

// localStorageを非同期ストレージとして扱うためのアダプター
const localStorageAdapter = {
  getItem: async (key: string) => {
    return window.localStorage.getItem(key)
  },
  setItem: async (key: string, value: string) => {
    window.localStorage.setItem(key, value)
  },
  removeItem: async (key: string) => {
    window.localStorage.removeItem(key)
  },
}

// localStorageを使用した永続化の設定
const persister = createAsyncStoragePersister({
  storage: localStorageAdapter,
  key: 'view4u-cache',
})

// persistQueryClientを使用してエラー状態も永続化
persistQueryClient({
  queryClient,
  persister,
  maxAge: 24 * 60 * 60 * 1000, // 24時間
  dehydrateOptions: {
    shouldDehydrateQuery: (query) => {
      // 成功したクエリは常に永続化(デフォルト)
      if (query.state.status === 'success') {
        return true
      }
      // エラー状態でも、以前に成功したデータがある場合は永続化
      if (query.state.status === 'error' && query.state.data) {
        return true
      }
      // その他の状態（loading、idle等）は永続化しない
      return false
    },
  },
})

const reactRootDiv = document.getElementById('root')
if (!reactRootDiv) {
  throw new Error(
    'root element not found. Please ensure there is a <div id="root"></div> in your index.html.',
  )
}

ReactDOM.createRoot(reactRootDiv).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ChakraProvider value={defaultSystem}>
        <RouterProvider router={router} />
      </ChakraProvider>
    </QueryClientProvider>
  </React.StrictMode>,
)
