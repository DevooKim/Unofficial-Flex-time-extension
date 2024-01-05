import { IconButton, List, Paper, Tooltip } from '@mui/material'
import { Box } from '@mui/system'
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord'
import {
    yellow,
    pink,
    lightGreen,
    lime,
    lightBlue,
    blue,
} from '@mui/material/colors'
import { ArrowBackIosNew, ArrowForwardIos } from '@mui/icons-material'
import InfoIcon from '@mui/icons-material/Info'

import {
    useFetchUserIdHash,
    useFetchWorkingData,
    useGetTargetDate,
} from '../hooks'

import { hourToString } from '../utils/utils.time'
import DatePicker from './DatePicker'
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
    const {
        targetDate,
        targetTimeStamp,
        setNextMonth,
        setPrevMonth,
        setDateByDayjs,
    } = useGetTargetDate()
    const hash: string = useFetchUserIdHash()
    const { loading, data: parsedData } = useFetchWorkingData(
        hash,
        targetTimeStamp
    )

    if (loading) return <div>loading...</div>

    const monthInfo: IItem[] = [
        {
            info: `워킹데이: ${parsedData.워킹데이}일`,
        },
        {
            info: `이번달 최소 근무시간: ${hourToString(
                parsedData.최소근무시간
            )}`,
        },
    ]
    const overallData: IItem[] = [
        {
            info: `총 근무한 시간: ${hourToString(parsedData.근무시간총합)}`,
            tooltipTitle: '연차 시간이 포함됨',
        },
    ]

    const remainData: IItem[] = [
        {
            info: `남은 근무일: ${parsedData.남은근무일}일`,
            tooltipTitle: '연차 1일, 반차 0.5일이 제외됨',
        },
        {
            info: `남은 근무시간: ${hourToString(parsedData.남은근무시간)}`,
        },
        {
            info: `남은 평균 근무시간: ${hourToString(
                parsedData.남은평균근무시간
            )}`,
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
                    <DatePicker value={targetDate} setValue={setDateByDayjs} />

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
                        마지막 업데이트 : {currentTimeFormat()}
                    </Box>
                    <Tooltip
                        title="오늘 근무 정보는 퇴근 후에 반영됩니다."
                        arrow
                    >
                        <InfoIcon sx={{ fontSize: '1.2rem', pl: 0.5 }} />
                    </Tooltip>
                </Box>
            </Paper>
            <Box pt={1}>
                <List
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.5rem',
                    }}
                >
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
                    <TimeResult backgroundColor={lightGreen[100]}>
                        {remainData.map(({ info, tooltipTitle }, index) => (
                            <TimeResult.Item
                                key={index}
                                info={info}
                                tooltipTitle={tooltipTitle}
                            />
                        ))}
                    </TimeResult>

                    {parsedData.휴가정보list.length > 0 && (
                        <Paper
                            sx={{ backgroundColor: lightBlue[50] }}
                            elevation={2}
                        >
                            <Box
                                fontSize="1rem"
                                px={1}
                                py={0.5}
                                borderBottom={1}
                            >
                                연차 정보
                            </Box>
                            <Box
                                pl={2}
                                py={0.5}
                                display="flex"
                                flexDirection="column"
                                gap={0.5}
                            >
                                {parsedData.휴가정보list.map((timeOff) => (
                                    <Box display="flex" flexDirection="column">
                                        <Box display="flex">
                                            <Box
                                                sx={{
                                                    fontSize: '0.875rem',
                                                    fontWeight: 700,
                                                }}
                                            >
                                                <FiberManualRecordIcon
                                                    sx={{
                                                        fontSize: '0.625rem',
                                                        mr: 0.5,
                                                    }}
                                                />
                                                {timeOff.date}
                                            </Box>
                                        </Box>

                                        <Box
                                            display="flex"
                                            flexDirection="column"
                                            pl="1rem"
                                            sx={{ fontSize: '0.875rem' }}
                                        >
                                            {timeOff.infos.map((info) => (
                                                <>
                                                    <div>
                                                        {info.name} -{' '}
                                                        {hourToString(
                                                            info.hours
                                                        )}
                                                    </div>
                                                </>
                                            ))}
                                            <Box fontWeight={600}>
                                                총합 -{' '}
                                                {hourToString(
                                                    timeOff.totalHours
                                                )}
                                            </Box>
                                        </Box>
                                    </Box>
                                ))}
                            </Box>
                        </Paper>
                    )}
                </List>
            </Box>
        </>
    )
}

export default WorkingTimeResult
