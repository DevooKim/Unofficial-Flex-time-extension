import { useEffect, useState } from "react";
import { ChromeMessage, Sender, TimeList } from "./types";
import { getCurrentTabUId } from "./chrome/utils";

function App() {
    const [url, setUrl] = useState<string | undefined>("");
    const [responseFromContent, setResponseFromContent] = useState<any>([{}]);

    useEffect(() => {
        const queryInfo = { active: true, currentWindow: true };

        chrome.tabs?.query(queryInfo, (tabs: chrome.tabs.Tab[]): void => {
            const _url = tabs[0].url;
            setUrl(_url);
            return;
        });
    }, []);

    const sendTest = () => {
        const message: ChromeMessage = {
            from: Sender.React,
            message: "parseTime",
        };
        const options = {};
        getCurrentTabUId((id: number | undefined): void => {
            id &&
                chrome.tabs.sendMessage(
                    id,
                    message,
                    options,
                    (responseFromContentScript) => {
                        console.log("response: ", responseFromContentScript);
                        setResponseFromContent(
                            JSON.parse(responseFromContentScript)
                        );
                    }
                );
        });
    };

    console.log("res: ", responseFromContent);
    return (
        <div className="App">
            <header className="App-header">
                <p>URL: {url}</p>
                <button onClick={sendTest}>parse</button>
                {/* <pre>{responseFromContent}</pre> */}
                {responseFromContent.map((v: TimeList, index: number) => (
                    <p key={index}>{JSON.stringify(v)}</p>
                ))}
            </header>
        </div>
    );
}

export default App;
