import { blueGrey } from '@mui/material/colors'
import { Container } from '@mui/system'

import WorkingTimeResult from './components/WorkingTimeResult'
import InActive from './components/InActive'

import { useFetchUserIdHash } from './hooks'

import BaseTimeProvider from './contexts/BaseTimeContext'

function App() {
    const { data: userIdHash, isError } = useFetchUserIdHash()

    return (
        <Container sx={{ minWidth: '350px', p: 1.5, background: blueGrey[50] }}>
            <BaseTimeProvider>
                {isError ? (
                    <InActive />
                ) : (
                    <WorkingTimeResult userIdHash={userIdHash} />
                )}
            </BaseTimeProvider>
        </Container>
    )
}

export default App
