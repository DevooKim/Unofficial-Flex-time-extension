import { blueGrey } from "@mui/material/colors";
import { Container } from "@mui/system";
import { useEffect, useState } from "react";
import { activeTabHandler, tabStatus } from "./chrome/utils";
import InActive from "./components/InActive";
import WorkingTimeResult from "./components/WorkingTimeResult";

function App() {
    const [tabStatus, setTabStatus] = useState<tabStatus>({
        isWorkingInfoTab: false,
        isComplete: false,
    });

    useEffect(() => {
        chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
            activeTabHandler(tab, setTabStatus);
        });
    }, []);

    useEffect(() => {
        const queryInfo = { active: true, currentWindow: true };
        chrome.tabs?.query(queryInfo, (tabs: chrome.tabs.Tab[]): void => {
            activeTabHandler(tabs[0], setTabStatus);
            return;
        });
    }, []);
    return (
        <Container sx={{ minWidth: "350px", p: 1.5, background: blueGrey[50] }}>
            {tabStatus.isWorkingInfoTab ? <WorkingTimeResult /> : <InActive />}
        </Container>
    );
}

export default App;
