import { useEffect, useState } from "react";
import {
    Divider,
    List,
    ListItemText,
    Paper,
    Stack,
    Tooltip,
} from "@mui/material";
import { Box } from "@mui/system";
import InfoIcon from "@mui/icons-material/Info";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import { getCurrentTabUId } from "../../chrome/utils";
import { ChromeMessage, Sender } from "../../types";
import { getUserName } from "../../chrome/services/user";

const dummyMonth = "5월";
const dummyToday = "6월 6일 12시 30분";
const dummy = {
    shouldWorkingDay: 20,
    remainWorkingDay: 0,
    minWorkingTime: 160,
    currentWorkingTime: 161.7,
    currentWorkingTimeAvg: 8.08,
    remainWorkingTime: 0, //-1.6999999999999886,
    remainWorkingTimeAvg: 0, //null,
    rests: [
        {
            date: "5. 6 (금)",
            type: "full",
        },
        {
            date: "5. 7 (토)",
            type: "half",
        },
    ],
};

const WorkingTimeResult = ({ isActive }: { isActive: boolean }) => {
    const [test, setTest] = useState<boolean>(false);
    const [analyzedWorkingTime, setAnalyzedWorkingTime] = useState({});
    const [userName, setUserName] = useState("");
    const sendParseWorkingTime = () => {
        const message: ChromeMessage = {
            from: Sender.React,
            message: "parseTime",
        };
        const options = {};
        getCurrentTabUId((id: number | undefined): void => {
            id &&
                chrome.tabs.sendMessage(id, message, options, (response) => {
                    setAnalyzedWorkingTime(JSON.parse(response));
                });
        });
    };

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

    useEffect(() => {
        if (isActive) {
            sendParseWorkingTime();
            sendUserName();
        }
    }, [isActive]);

    return (
        <>
            <h3>
                {userName}님의 {dummyMonth} 근무 정보 - 기준일 : {dummyToday}
            </h3>
            {isActive && <div>isActive</div>}
            <Paper sx={{ p: 2 }} elevation={3}>
                <List>
                    <Divider />
                    <ListItemText>
                        남은 근무일: {dummy.remainWorkingDay}일
                    </ListItemText>
                    <Divider />
                    <ListItemText>
                        소정 근무시간: {dummy.currentWorkingTime}시간
                    </ListItemText>
                    <Divider />
                    <ListItemText>
                        하루 평균 근무시간: {dummy.currentWorkingTimeAvg}
                        시간
                    </ListItemText>
                    <Divider />
                    <ListItemText>
                        남은 최소 근무시간: {dummy.remainWorkingTime}시간
                    </ListItemText>
                    <Divider />
                    <ListItemText>
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                            }}
                        >
                            <span>
                                남은 하루 평균 근무시간:{" "}
                                {dummy.remainWorkingTimeAvg}
                                시간
                            </span>
                            <Tooltip title="반차 출근일 포함" arrow>
                                <InfoIcon
                                    sx={{ fontSize: "1.2rem", pl: 0.5 }}
                                />
                            </Tooltip>
                        </Box>
                    </ListItemText>
                    <Divider />
                    <ListItemText>
                        <ListItemText>연차 정보</ListItemText>
                        <Box sx={{ pl: 4 }}>
                            {dummy.rests.map((rest) => (
                                <ListItemText key={rest.date}>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                        }}
                                    >
                                        <FiberManualRecordIcon
                                            sx={{
                                                fontSize: "0.625rem",
                                                mr: 0.5,
                                            }}
                                        />
                                        <span>
                                            {rest.date} - {rest.type}
                                        </span>
                                    </Box>
                                </ListItemText>
                            ))}
                        </Box>
                    </ListItemText>
                </List>
            </Paper>
        </>
    );
};

export default WorkingTimeResult;
