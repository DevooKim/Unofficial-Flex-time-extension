import {
    Divider,
    FormControlLabel,
    List,
    Paper,
    Switch,
    Typography,
} from '@mui/material'
import { Box } from '@mui/system'
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord'
import { flexInfo } from '../types'
import { yellow, pink, lightBlue, lightGreen } from '@mui/material/colors'
import {
    useFetchUserIdHash,
    useFetchWorkingData,
    useParseData,
    useGetTargetDate,
    useToggle,
    useGetUserName,
} from '../hooks'
import TimeResult, { IItem } from './TimeResult'

const currentTimeFormat = () => {
    const date = new Date()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()

    return `${month}월 ${day}일 ${hour}시 ${minute}분`
}

const WorkingTimeResult = () => {
    const [finishToday, setFinishToday] = useToggle()
    const { targetMonth, targetTimeStamp } = useGetTargetDate()
    const userName = useGetUserName()
    const hash: string = useFetchUserIdHash()
    const flexData = useFetchWorkingData<flexInfo>(hash, targetTimeStamp)
    const parsedData = useParseData(flexData, finishToday)

    const overallData: IItem[] = [
        {
            info: `총 근무시간: ${parsedData.totalWorkingTime}시간`,
            tooltipTitle: '연차, 반차 시간 포함',
        },
        {
            info: `월 평균 주 근무시간: ${parsedData.workingTimeWeekAvg}시간`,
            tooltipTitle: '총 근무시간 / 4.345주',
        },
    ]

    const actualData: IItem[] = [
        {
            info: `소정 근무시간: ${parsedData.actualWorkingTime}시간`,
        },
        {
            info: `하루 평균 근무시간: ${parsedData.actualWorkingTimeAvg}시간`,
        },
    ]

    const remainData: IItem[] = [
        {
            info: `남은 근무일: ${parsedData.remainActualWorkingDayCount}일`,
        },
        {
            info: `남은 최소 근무시간: ${parsedData.minRemainWorkingTime}시간`,
        },
        {
            info: `남은 하루 평균 근무시간: ${parsedData.minRemainWorkingTimeAvg}시간`,
            tooltipTitle: '반차 출근일 포함',
        },
    ]

    return (
        <>
            <Paper sx={{ p: 2, background: yellow[50] }} elevation={2}>
                <Box fontSize="1.2rem" lineHeight={1.5} mb={0.5}>
                    {userName}님의 {targetMonth}월 근무 정보
                </Box>
                <Box fontSize="1rem" lineHeight={1.5}>
                    기준일 : {currentTimeFormat()}
                </Box>
                <FormControlLabel
                    control={
                        <Switch
                            checked={!finishToday}
                            onChange={setFinishToday}
                            size="small"
                        />
                    }
                    label={finishToday ? '퇴근' : '근무 중'}
                />
            </Paper>
            <Box pt={2}>
                <List>
                    <TimeResult backgroundColor={pink[100]}>
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

                    <Divider />
                    <Box pt={0.5}>
                        <Box fontSize="1rem" lineHeight={1.5} px={1} py={0.5}>
                            연차 정보
                        </Box>
                        <Box pl={4}>
                            {parsedData.timeOffDays?.map((timeOffDay) => (
                                <Box display="flex" alignItems="center">
                                    <FiberManualRecordIcon
                                        sx={{
                                            fontSize: '0.625rem',
                                            mr: 0.5,
                                        }}
                                    />
                                    <Typography variant="body1">
                                        {timeOffDay.date} -{' '}
                                        {timeOffDay.timeOffType === 'FULL'
                                            ? '연차'
                                            : '반차'}
                                    </Typography>
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
