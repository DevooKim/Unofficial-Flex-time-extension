import { Box, Button } from '@mui/material'

const InActive = () => {
    const openFlex = () => {
        chrome.tabs.update({
            url: 'https://flex.team/home',
        })
    }
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
