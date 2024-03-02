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
            <Container
                sx={{ minWidth: '350px', p: 1.5, background: blueGrey[50] }}
            >
                <QueryErrorResetBoundary>
                    {({ reset }) => (
                        <ErrorBoundary
                            onReset={() => {}}
                            fallbackRender={({ resetErrorBoundary }) => (
                                // <div>
                                //     There was an error!
                                //     <button
                                //         onClick={() => resetErrorBoundary()}
                                //     >
                                //         Try again
                                //     </button>
                                // </div>
                                <InActive />
                            )}
                        >
                            <React.Suspense fallback={<h1>loading</h1>}>
                                <BaseTimeProvider>
                                    {isError ? (
                                        <InActive />
                                    ) : (
                                        <WorkingTimeResult
                                            userIdHash={userIdHash}
                                        />
                                    )}
                                </BaseTimeProvider>
                            </React.Suspense>
                        </ErrorBoundary>
                    )}
                </QueryErrorResetBoundary>
            </Container>
        </QueryClientProvider>
    )
}
