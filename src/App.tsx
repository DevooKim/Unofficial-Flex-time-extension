import { Container } from "@mui/system";
import { useEffect, useState } from "react";
import { activeTabHandler } from "./chrome/utils";
import InActive from "./components/InActive";
import WorkingTimeResult from "./components/WorkingTimeResult";

function App() {
    const [isActive, setIsActive] = useState<boolean>(false);

    useEffect(() => {
        chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
            activeTabHandler(tab, setIsActive);
        });
    }, []);

    useEffect(() => {
        const queryInfo = { active: true, currentWindow: true };
        chrome.tabs?.query(queryInfo, (tabs: chrome.tabs.Tab[]): void => {
            activeTabHandler(tabs[0], setIsActive);
            return;
        });
    }, []);
    return (
        <Container sx={{ minWidth: "350px" }}>
            {isActive ? (
                <WorkingTimeResult isActive={isActive} />
            ) : (
                <InActive />
            )}
        </Container>
    );
}

export default App;
