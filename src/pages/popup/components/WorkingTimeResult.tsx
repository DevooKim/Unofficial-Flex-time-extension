import {
    ArrowBackIosNew,
    ArrowForwardIos,
    CenterFocusWeak,
    ContentCopy,
    Download,
    FiberManualRecord,
    Language,
} from '@mui/icons-material'
import {
    Alert,
    Divider,
    IconButton,
    List,
    Paper,
    Snackbar,
    Tooltip,
} from '@mui/material'
import {
    blue,
    indigo,
    lightBlue,
    lightGreen,
    lime,
    pink,
    yellow,
} from '@mui/material/colors'
import { Box } from '@mui/system'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { useEffect, useMemo, useState } from 'react'

import { parseClockData } from '@utils/parseClockData'
import { parseScheduleData } from '@utils/parseScheduleData'
import { hourToString } from '@utils/utils.time'

import { useBaseTimeContext } from '../contexts/BaseTimeContext'
import {
    useCaptureHandler,
    useCopyToClipboard,
    useFetchClockData,
    useFetchScheduleData,
    useGetTargetDate,
    useOpenFlex,
} from '../hooks'
import DatePicker from './DatePicker'
import LoadingUI from './LoadingUI'
import TimeResult, { IItem } from './TimeResult'

dayjs.extend(utc)

const currentTimeFormat = (timestamp: number) =>
    dayjs(timestamp).format('MM월 DD일 HH시 mm분')

const WorkingTimeResult = ({ userIdHash }: { userIdHash: string }) => {
    const { baseTimeData, refreshBaseTimeIfInvalid } = useBaseTimeContext()
    const { firstDay, lastDay, now } = baseTimeData
    const {
        targetDate,
        targetTimeStamp,
        setNextMonth,
        setPrevMonth,
        setDateByDayjs,
    } = useGetTargetDate()

    const { loading: clockLoading, data: clockData } = useFetchClockData({
        userIdHash,
        timeStampFrom: firstDay,
        timeStampTo: lastDay,
    })

    const { loading: scheduleLoading, data: scheduleData } =
        useFetchScheduleData({ userIdHash, timeStamp: targetTimeStamp })

    useEffect(() => {
        refreshBaseTimeIfInvalid()
    }, [targetTimeStamp, refreshBaseTimeIfInvalid])

    const lastUpdateTime = useMemo(() => currentTimeFormat(now), [now])

    const [snackbarOpen, setSnackbarOpen] = useState(false)

    const { captureHandler } = useCaptureHandler({ id: 'capture' })
    const copy = useCopyToClipboard()
    const { openFlex } = useOpenFlex()

    const copyTextData = () => {
        const copyValue = {
            기준시간: dayjs(now).toISOString(),
            워킹데이: myScheduleData.워킹데이,
            최소근무시간: myScheduleData.최소근무시간,
            근무시간총합: myScheduleData.근무시간총합,
            남은근무일: myScheduleData.남은근무일,
            남은근무시간: myScheduleData.남은근무시간,
            남은평균근무시간: myScheduleData.남은평균근무시간,
        }

        copy(JSON.stringify(copyValue))
        setSnackbarOpen(true)
    }

    const onCapture = (mode: 'clipboard' | 'download') => {
        captureHandler({
            filename: `flex_${dayjs(now).format('YYYY_MM_DDTHH_mm')}`,
            mode,
        })
        setSnackbarOpen(true)
    }

    if (clockLoading || scheduleLoading) return <LoadingUI />

    const myClockData = parseClockData({ data: clockData, now })

    const 지금근무중인가 = myClockData.현재근무상태 === '근무중'
    const displayCurrentData =
        dayjs(targetDate).isSame(dayjs(now), 'month') && 지금근무중인가

    const myScheduleData = parseScheduleData({
        data: scheduleData,
        today: baseTimeData.today,
        clockData: myClockData,
    })

    const monthInfo: IItem[] = [
        {
            info: `워킹데이: ${myScheduleData.워킹데이}일`,
        },
        {
            info: `이번달 최소 근무시간: ${hourToString(
                myScheduleData.최소근무시간
            )}`,
        },
    ]
    const overallData: IItem[] = [
        {
            info: `이번달 총 근무한 시간: ${hourToString(
                myScheduleData.근무시간총합
            )}`,
            tooltipTitle: '연차 시간이 포함되어 있습니다.',
        },
    ]

    const remainData: IItem[] = [
        {
            info: displayCurrentData
                ? `남은 근무일: ${myScheduleData.남은근무일}일 (${myScheduleData.지금기준.남은근무일}일)`
                : `남은 근무일: ${myScheduleData.남은근무일}일`,
        },
        {
            info: displayCurrentData
                ? `남은 근무시간: ${hourToString(
                      myScheduleData.남은근무시간
                  )} (${hourToString(myScheduleData.지금기준.남은근무시간)})`
                : `남은 근무시간: ${hourToString(myScheduleData.남은근무시간)}`,
        },
        {
            info: displayCurrentData
                ? `남은 평균 근무시간: ${hourToString(
                      myScheduleData.남은평균근무시간
                  )} (${hourToString(
                      myScheduleData.지금기준.남은평균근무시간
                  )})`
                : `남은 평균 근무시간: ${hourToString(
                      myScheduleData.남은평균근무시간
                  )}`,
        },
    ]

    return (
        <Box>
            <Snackbar
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                open={snackbarOpen}
                onClose={() => setSnackbarOpen(false)}
                autoHideDuration={3000}
                transitionDuration={0}
            >
                <Alert
                    severity="success"
                    sx={{ width: '100%', border: '1px solid black' }}
                >
                    완료되었습니다.
                </Alert>
            </Snackbar>
            <Box
                width="100%"
                display="flex"
                flexDirection="row"
                justifyContent="flex-end"
                gap={0.5}
            >
                <Tooltip title="이미지 복사" arrow>
                    <IconButton
                        size="small"
                        onClick={() => onCapture('clipboard')}
                    >
                        <CenterFocusWeak />
                    </IconButton>
                </Tooltip>
                <Tooltip title="이미지 다운로드" arrow>
                    <IconButton
                        size="small"
                        onClick={() => onCapture('download')}
                    >
                        <Download />
                    </IconButton>
                </Tooltip>
                <Tooltip title="데이터 복사" arrow>
                    <IconButton size="small" onClick={copyTextData}>
                        <ContentCopy />
                    </IconButton>
                </Tooltip>
                <Tooltip title="플렉스로 이동" arrow>
                    <IconButton size="small" onClick={openFlex}>
                        <Language />
                    </IconButton>
                </Tooltip>
            </Box>
            <div id="capture">
                <List
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.5rem',
                    }}
                >
                    <Paper sx={{ p: 1, background: yellow[50] }} elevation={2}>
                        <Box display="flex" alignItems="center" pb={1}>
                            <Box fontSize="0.75rem" lineHeight={1.5}>
                                마지막 업데이트 : {lastUpdateTime}
                            </Box>
                        </Box>
                        <Box
                            display="flex"
                            justifyContent="space-between"
                            alignItems="center"
                            lineHeight={1.5}
                        >
                            <DatePicker
                                value={targetDate}
                                setValue={setDateByDayjs}
                            />

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
                    </Paper>
                    <Paper sx={{ p: 1, background: indigo[100] }} elevation={2}>
                        <List
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '0.5rem',
                                fontWeight: 600,
                                fontSize: '0.875rem',
                            }}
                        >
                            <Box>근무상태: {myClockData.현재근무상태}</Box>
                            <Box>
                                출근시간:{' '}
                                {myClockData.출근시간
                                    ? dayjs(myClockData.출근시간)
                                          .utc()
                                          .local()
                                          .format('HH시 mm분')
                                    : '출근하기 전 입니다.'}
                            </Box>
                            <Box>
                                퇴근시간:{' '}
                                {myClockData.퇴근시간
                                    ? dayjs(myClockData.퇴근시간)
                                          .utc()
                                          .local()
                                          .format('HH시 mm분')
                                    : '퇴근하기 전 입니다.'}
                            </Box>
                            <Box>
                                오늘 한 근무:{' '}
                                {hourToString(myClockData.오늘일한시간)}
                            </Box>
                        </List>
                    </Paper>

                    <Divider sx={{ my: 1 }} />

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

                    {myScheduleData.휴가정보list.length > 0 && (
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
                                {myScheduleData.휴가정보list.map(
                                    (timeOff, index) => (
                                        <Box
                                            display="flex"
                                            flexDirection="column"
                                            key={index}
                                        >
                                            <Box display="flex">
                                                <Box
                                                    sx={{
                                                        fontSize: '0.875rem',
                                                        fontWeight: 700,
                                                    }}
                                                >
                                                    <FiberManualRecord
                                                        sx={{
                                                            fontSize:
                                                                '0.625rem',
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
                                                sx={{
                                                    fontSize: '0.875rem',
                                                }}
                                            >
                                                {timeOff.infos.map(
                                                    (info, index) => (
                                                        <div key={index}>
                                                            {info.name} -{' '}
                                                            {hourToString(
                                                                info.hours
                                                            )}
                                                        </div>
                                                    )
                                                )}
                                                <Box fontWeight={600}>
                                                    총합 -{' '}
                                                    {hourToString(
                                                        timeOff.totalHours
                                                    )}
                                                </Box>
                                            </Box>
                                        </Box>
                                    )
                                )}
                            </Box>
                        </Paper>
                    )}
                </List>
            </div>
        </Box>
    )
}

export default WorkingTimeResult
