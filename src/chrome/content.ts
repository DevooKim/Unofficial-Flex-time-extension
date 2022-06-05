import { ChromeMessage, ResultData, Sender, TimeList } from "../types";
import { calculateTime, parseTime } from "./services/time";
import { getUserName } from "./services/user";

type MessageResponse = (response?: any) => void;

const validateSender = (
    message: ChromeMessage,
    sender: chrome.runtime.MessageSender
) => sender.id === chrome.runtime.id && message.from === Sender.React;

const messagesFromReactAppListener = (
    message: ChromeMessage,
    sender: chrome.runtime.MessageSender,
    sendResponse: MessageResponse
) => {
    const isValidate = validateSender(message, sender);

    if (isValidate && message.message === "parseTime") {
        const timeList: TimeList[] = parseTime();
        const calculatedTime: ResultData = calculateTime(timeList);
        sendResponse(JSON.stringify(calculatedTime));
        // response가 단순 비동기인 경우 return true; => 가비지 컬렉터
    }

    if (isValidate && message.message === "getUserName") {
        const userName = getUserName();
        sendResponse(userName);
    }
};

const main = () => {
    chrome.runtime.onMessage.addListener(messagesFromReactAppListener);
};

main();
