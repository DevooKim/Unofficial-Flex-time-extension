import {
    QueryClient,
    QueryClientProvider,
    QueryErrorResetBoundary,
} from '@tanstack/react-query'
import React from 'react'
import { ErrorBoundary } from 'react-error-boundary'

import { PopupSkeleton } from '@src/components/Skeleton'

import Header from './components/Header'
import InActive from './components/InActive'
import UserData from './components/UserData'
import VersionUpdateNotificationBar from './components/VersionUpdateNotificationBar'
import BaseTimeProvider from './contexts/BaseTimeContext'
import WorkingHoursProvider from './contexts/WorkingHoursContext'

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            gcTime: Infinity,
            refetchOnWindowFocus: false,
            refetchOnMount: false,
            retry: false,
        },
    },
})

export default function App(): JSX.Element {
    // const { data: userIdHash, isError } = useFetchUserIdHash()

    return (
        <QueryClientProvider client={queryClient}>
            <VersionUpdateNotificationBar />
            <div className="min-w-[420px]">
                <QueryErrorResetBoundary>
                    {() => (
                        <ErrorBoundary
                            onReset={() => {}}
                            FallbackComponent={InActive}
                        >
                            <React.Suspense fallback={<PopupSkeleton />}>
                                <WorkingHoursProvider>
                                    <BaseTimeProvider>
                                        {/* <WorkingTimeResult
                                        userIdHash={userIdHash}
                                    /> */}
                                        <div className="flex flex-col gap-4 p-5">
                                            <Header />
                                            <UserData />
                                        </div>
                                    </BaseTimeProvider>
                                </WorkingHoursProvider>
                            </React.Suspense>
                        </ErrorBoundary>
                    )}
                </QueryErrorResetBoundary>
            </div>
        </QueryClientProvider>
    )
}
