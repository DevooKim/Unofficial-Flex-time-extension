import { blueGrey } from '@mui/material/colors'
import { Container } from '@mui/system'
import {
    QueryClient,
    QueryClientProvider,
    QueryErrorResetBoundary,
} from '@tanstack/react-query'

import WorkingTimeResult from './components/WorkingTimeResult'
import InActive from './components/InActive'

import { useFetchUserIdHash } from './hooks'

import BaseTimeProvider from './contexts/BaseTimeContext'
import { ErrorBoundary } from 'react-error-boundary'
import React from 'react'
import Header from './components/Header'
import WorkingStatus from './components/WorkingStatus'
import TimeDataSwitch from './components/TimeDataSwitch'

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
    const { data: userIdHash, isError } = useFetchUserIdHash()

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
                                    <div>
                                        <Header />
                                        <WorkingStatus />
                                        <TimeDataSwitch />
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
