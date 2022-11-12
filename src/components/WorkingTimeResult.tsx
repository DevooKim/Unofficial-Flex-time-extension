import { IconButton, List, Paper, Tooltip } from '@mui/material'
import { Box } from '@mui/system'
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord'
import {
    yellow,
    pink,
    lightBlue,
    lightGreen,
    lime,
    deepOrange,
    blue,
} from '@mui/material/colors'
import InfoIcon from '@mui/icons-material/Info'

import {
    useFetchUserIdHash,
    useFetchWorkingData,
    useParseData,
    useGetTargetDate,
} from '../hooks'
import { flexInfo } from '../types'

import TimeResult, { IItem } from './TimeResult'
import {
    ArrowBackIos,
    ArrowBackIosNew,
    ArrowForwardIos,
} from '@mui/icons-material'

const currentTimeFormat = () => {
    const date = new Date()
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()

    return `${year}년 ${month}월 ${day}일 ${hour}시 ${minute}분`
}

const WorkingTimeResult = () => {
    const { targetDate, targetTimeStamp, setNextMonth, setPrevMonth } =
        useGetTargetDate()
    const hash: string = useFetchUserIdHash()
    const flexData = useFetchWorkingData<flexInfo>(hash, targetTimeStamp)
    const { ...parsedData } = useParseData(flexData)

    const monthInfo: IItem[] = [
        {
            info: `워킹데이: ${parsedData.workingDaysOfMonth}일`,
        },
        {
            info: `이번달 최소 근무시간: ${parsedData.minWorkingHoursOfMonth}`,
        },
    ]
    const overallData: IItem[] = [
        {
            info: `총 근무시간: ${parsedData.currentTotalWorkingHours}`,
            tooltipTitle: '연차 시간 포함',
        },
    ]

    const actualData: IItem[] = [
        {
            info: `소정 근무시간: ${parsedData.actualWorkingHours}`,
        },
    ]

    const remainData: IItem[] = [
        {
            info: `남은 최소 근무시간: ${parsedData.minRemainWorkingHours}`,
        },
    ]

    return (
        <>
            <Paper sx={{ p: 2, background: yellow[50] }} elevation={2}>
                <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    lineHeight={1.5}
                    mb={0.5}
                >
                    <Box fontSize="1.2rem">
                        {targetDate.getFullYear()}년 {targetDate.getMonth() + 1}
                        월 근무 정보
                    </Box>
                    <Box display="flex" alignItems="center">
                        <IconButton onClick={setPrevMonth} size="small">
                            <ArrowBackIosNew
                                sx={{
                                    fontSize: '1.2rem',
                                    color: blue['A700'],
                                }}
                            />
                        </IconButton>
                        <IconButton onClick={setNextMonth} size="small">
                            <ArrowForwardIos
                                sx={{
                                    fontSize: '1.2rem',
                                    color: blue['A700'],
                                }}
                            />
                        </IconButton>
                    </Box>
                </Box>

                <Box display="flex" alignItems="center">
                    <Box fontSize="1rem" lineHeight={1.5}>
                        기준일 : {currentTimeFormat()}
                    </Box>
                    <Tooltip
                        title="오늘 근무 정보는 퇴근 후에 반영됩니다."
                        arrow
                    >
                        <InfoIcon sx={{ fontSize: '1.2rem', pl: 0.5 }} />
                    </Tooltip>
                </Box>
            </Paper>
            <Box pt={2}>
                <List>
                    <TimeResult backgroundColor={pink[100]}>
                        {monthInfo.map(({ info, tooltipTitle }, index) => (
                            <TimeResult.Item
                                key={index}
                                info={info}
                                tooltipTitle={tooltipTitle}
                            />
                        ))}
                    </TimeResult>
                    <TimeResult backgroundColor={lime[100]}>
                        {overallData.map(({ info, tooltipTitle }, index) => (
                            <TimeResult.Item
                                key={index}
                                info={info}
                                tooltipTitle={tooltipTitle}
                            />
                        ))}
                    </TimeResult>
                    <TimeResult backgroundColor={lightBlue[100]}>
                        {actualData.map(({ info, tooltipTitle }, index) => (
                            <TimeResult.Item
                                key={index}
                                info={info}
                                tooltipTitle={tooltipTitle}
                            />
                        ))}
                    </TimeResult>
                    <TimeResult backgroundColor={lightGreen[100]}>
                        {remainData.map(({ info, tooltipTitle }, index) => (
                            <TimeResult.Item
                                key={index}
                                info={info}
                                tooltipTitle={tooltipTitle}
                            />
                        ))}
                    </TimeResult>
                    <Box pt={0.5} sx={{ backgroundColor: deepOrange[100] }}>
                        <Box
                            fontSize="1rem"
                            lineHeight={1.5}
                            px={1}
                            py={0.5}
                            borderBottom={1}
                        >
                            연차 정보
                        </Box>
                        <Box
                            pl={2}
                            pt={1}
                            display="flex"
                            flexDirection="column"
                            gap={0.5}
                        >
                            {parsedData.timeOffs?.map((timeOff) => (
                                <Box display="flex" flexDirection="column">
                                    <Box display="flex">
                                        <FiberManualRecordIcon
                                            sx={{
                                                fontSize: '0.625rem',
                                                mr: 0.5,
                                            }}
                                        />
                                        <Box
                                            sx={{
                                                fontSize: '1rem',
                                                fontWeight: 700,
                                            }}
                                        >
                                            {timeOff.date}
                                        </Box>
                                    </Box>

                                    <Box
                                        display="flex"
                                        flexDirection="column"
                                        paddingLeft="1rem"
                                        sx={{ fontSize: '1rem' }}
                                    >
                                        {timeOff.infos.map((info) => (
                                            <>
                                                <div>
                                                    {info.name} - {info.hours}
                                                </div>
                                            </>
                                        ))}
                                        <Box fontWeight={600}>
                                            총합 - {timeOff.totalHours}
                                        </Box>
                                    </Box>
                                </Box>
                            ))}
                        </Box>
                    </Box>
                </List>
            </Box>
        </>
    )
}

export default WorkingTimeResult
