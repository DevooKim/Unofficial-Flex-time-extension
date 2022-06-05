import { Container } from "@mui/system";
import { useEffect, useState } from "react";
import WorkingTimeResult from "./components/WorkingTimeResult";

function App() {
    const [isActive, setIsActive] = useState(false);
    useEffect(() => {
        const queryInfo = { active: true, currentWindow: true };
        chrome.tabs?.query(queryInfo, (tabs: chrome.tabs.Tab[]): void => {
            const isWorkingInfoTab =
                tabs[0].url ===
                "https://flex.team/time-tracking/work-record/my";
            isWorkingInfoTab
                ? chrome.action.enable(tabs[0].id)
                : chrome.action.disable(tabs[0].id);

            setIsActive(isWorkingInfoTab);
            return;
        });
    }, []);
    return (
        <Container sx={{ minWidth: "350px" }}>
            {isActive && <div>active</div>}
            <WorkingTimeResult />
        </Container>
    );
}

export default App;
