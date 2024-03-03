import {
    QueryClient,
    QueryClientProvider,
    QueryErrorResetBoundary,
} from '@tanstack/react-query'
import React from 'react'
import { ErrorBoundary } from 'react-error-boundary'

import Header from './components/Header'
import InActive from './components/InActive'
import UserData from './components/UserData'
import BaseTimeProvider from './contexts/BaseTimeContext'

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            refetchOnMount: false,
            refetchOnReconnect: false,
            retry: false,
        },
    },
})

export default function App(): JSX.Element {
    // const { data: userIdHash, isError } = useFetchUserIdHash()

    return (
        <QueryClientProvider client={queryClient}>
            <div className="min-w-[350px] p-5">
                <QueryErrorResetBoundary>
                    {({ reset }) => (
                        <ErrorBoundary
                            onReset={() => {}}
                            fallbackRender={({ resetErrorBoundary }) => (
                                <InActive />
                            )}
                        >
                            <React.Suspense fallback={<h1>loading</h1>}>
                                <BaseTimeProvider>
                                    {/* <WorkingTimeResult
                                        userIdHash={userIdHash}
                                    /> */}
                                    <div className="flex flex-col gap-4">
                                        <Header />
                                        <UserData />
                                    </div>
                                </BaseTimeProvider>
                            </React.Suspense>
                        </ErrorBoundary>
                    )}
                </QueryErrorResetBoundary>
            </div>
        </QueryClientProvider>
    )
}
