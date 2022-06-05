import { Box, Button } from "@mui/material";

const InActive = () => {
    const openFlex = () => {
        chrome.tabs.update({
            url: "https://flex.team/time-tracking/work-record/my",
        });
    };
    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                p: 2,
            }}
        >
            <Button variant="contained" onClick={openFlex}>
                플렉스 근무 페이지로 이동하기
            </Button>
        </Box>
    );
};

export default InActive;
