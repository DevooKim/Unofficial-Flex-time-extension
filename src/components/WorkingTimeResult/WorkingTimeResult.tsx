import React, { useEffect, useState } from "react";
import { Divider, List, Paper, Tooltip } from "@mui/material";
import { Box, SxProps } from "@mui/system";
import InfoIcon from "@mui/icons-material/Info";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import { activeTabHandler, getCurrentTabUId } from "../../chrome/utils";
import { ChromeMessage, flexInfo, Sender } from "../../types";
import { yellow } from "@mui/material/colors";
import useFetchUserIdHash from "../../hooks/useFetchUserIdHash";
import useFetchWorkingData from "../../hooks/useFetchWorkingData";
import useParseData from "../../hooks/useParseData";

const currentTimeFormat = () => {
    const date = new Date();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hour = date.getHours();
    const minute = date.getMinutes();

    return `${month}월 ${day}일 ${hour}시 ${minute}분`;
};

const ItemText = ({
    children,
    sx,
}: {
    children: React.ReactNode;
    sx?: SxProps;
}) => (
    <Box sx={{ fontSize: "1rem", lineHeight: 1.5, px: 1, py: 0.5, ...sx }}>
        {children}
    </Box>
);

const WorkingTimeResult = () => {
    const [targetMonth, setTargetMonth] = useState(0);
    const [userName, setUserName] = useState("");
    const [timeStamp, setTimeStamp] = useState<string>("");
    const hash: string = useFetchUserIdHash();
    const flexData = useFetchWorkingData<flexInfo>(hash, timeStamp);
    const parsedData = useParseData(flexData);

    const sendUserName = () => {
        const message: ChromeMessage = {
            from: Sender.React,
            message: "getUserName",
        };

        const options = {};
        getCurrentTabUId((id: number | undefined): void => {
            id &&
                chrome.tabs.sendMessage(id, message, options, (response) => {
                    setUserName(response);
                });
        });
    };

    const getTargetMonth = (tab: chrome.tabs.Tab) => {
        const url = tab.url || "";
        const queryString = url.split("?");
        const UrlSearch = new URLSearchParams(queryString[1]);
        const ts = UrlSearch.get("ts");

        let targetDate = new Date();
        if (ts) {
            targetDate = new Date(parseInt(ts as string, 10));
        }
        setTimeStamp(targetDate.getTime().toString());
        setTargetMonth(targetDate.getMonth() + 1);
    };

    useEffect(() => {
        chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
            activeTabHandler(tab, ({ isComplete }) => {
                if (isComplete) {
                    getTargetMonth(tab);
                    // sendParseWorkingTime();
                    // sendUserName();
                }
            });
        });
    }, []);

    useEffect(() => {
        const queryInfo = { active: true, currentWindow: true };
        chrome.tabs?.query(queryInfo, (tabs) => {
            getTargetMonth(tabs[0]);
        });
        sendUserName();
    }, []);

    return (
        <>
            <div>hash: {hash}</div>
            <div>{JSON.stringify(parsedData)}</div>
        </>
    );

    // return (
    //     <>
    //         <Paper sx={{ p: 2, background: yellow[50] }} elevation={2}>
    //             <div>hash: {hash}</div>
    //             <Box sx={{ fontSize: "1.2rem", lineHeight: 1.5, mb: "0.5rem" }}>
    //                 {userName}님의 {targetMonth}월 근무 정보
    //             </Box>
    //             <ItemText sx={{ p: 0 }}>
    //                 기준일 : {currentTimeFormat()}
    //             </ItemText>
    //         </Paper>
    //         <Box sx={{ p: 2 }}>
    //             <List>
    //                 <ItemText>
    //                     남은 근무일: {analyzedWorkingTime.remainWorkingDay}일
    //                 </ItemText>
    //                 <Divider />
    //                 <ItemText>
    //                     소정 근무시간: {analyzedWorkingTime.currentWorkingTime}
    //                     시간
    //                 </ItemText>
    //                 <Divider />
    //                 <ItemText>
    //                     하루 평균 근무시간:{" "}
    //                     {analyzedWorkingTime.currentWorkingTimeAvg}
    //                     시간
    //                 </ItemText>
    //                 <Divider />
    //                 <ItemText>
    //                     남은 최소 근무시간:{" "}
    //                     {analyzedWorkingTime.remainWorkingTime}시간
    //                 </ItemText>
    //                 <Divider />
    //                 <Box
    //                     sx={{
    //                         display: "flex",
    //                         alignItems: "center",
    //                     }}
    //                 >
    //                     <ItemText>
    //                         남은 하루 평균 근무시간:{" "}
    //                         {analyzedWorkingTime.remainWorkingTimeAvg}
    //                         시간
    //                     </ItemText>
    //                     <Tooltip title="반차 출근일 포함" arrow>
    //                         <InfoIcon sx={{ fontSize: "1.2rem", pl: 0.5 }} />
    //                     </Tooltip>
    //                 </Box>
    //                 <Divider />
    //                 <ItemText>연차 정보</ItemText>
    //                 <Box sx={{ pl: 4 }}>
    //                     {analyzedWorkingTime.rests.map((rest) => (
    //                         <Box
    //                             sx={{
    //                                 display: "flex",
    //                                 alignItems: "center",
    //                             }}
    //                         >
    //                             <FiberManualRecordIcon
    //                                 sx={{
    //                                     fontSize: "0.625rem",
    //                                     mr: 0.5,
    //                                 }}
    //                             />
    //                             <ItemText>
    //                                 {rest.date} -{" "}
    //                                 {rest.type === "full" ? "연차" : "반차"}
    //                             </ItemText>
    //                         </Box>
    //                     ))}
    //                 </Box>
    //             </List>
    //         </Box>
    //     </>
    // );
};

export default WorkingTimeResult;
