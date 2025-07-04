import { ChakraProvider, defaultSystem } from '@chakra-ui/react'
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister'
import { QueryClient } from '@tanstack/react-query'
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'

import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { router } from './router.tsx'

// QueryClientの作成
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5分間はキャッシュを使用
      gcTime: 24 * 60 * 60 * 1000, // 24時間はガベージコレクションしない（永続化のため）
      retry: 2,
      // エラーが発生してもキャッシュされたデータを保持する
      retryOnMount: false,
      refetchOnWindowFocus: false,
      // バックグラウンドでの再フェッチでエラーが発生してもキャッシュを保持
      throwOnError: false,
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

const reactRootDiv = document.getElementById('root')
if (!reactRootDiv) {
  throw new Error(
    'root element not found. Please ensure there is a <div id="root"></div> in your index.html.',
  )
}

ReactDOM.createRoot(reactRootDiv).render(
  <React.StrictMode>
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{
        persister,
        maxAge: 24 * 60 * 60 * 1000, // 24時間キャッシュを保持
        buster: '', // アプリのバージョンが変わったときにキャッシュをクリア
      }}
      onError={() => {
        // エラーが発生してもキャッシュを削除しない
        console.warn('Persist error (cache preserved)')
      }}
    >
      <ChakraProvider value={defaultSystem}>
        <RouterProvider router={router} />
      </ChakraProvider>
    </PersistQueryClientProvider>
  </React.StrictMode>,
)
