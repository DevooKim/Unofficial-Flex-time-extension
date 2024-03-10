import { Box, Button } from '@mui/material'

import { useOpenFlex } from '../../hooks'

const InActive = () => {
    const { openFlex } = useOpenFlex()
    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                p: 2,
            }}
        >
            <Button variant="contained" onClick={openFlex}>
                플렉스로 이동하기
            </Button>
        </Box>
    )
}

export default InActive
