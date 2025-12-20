import { FloatingPortal } from '@floating-ui/react'
import {
    CalendarMonth as CalendarMonthIcon,
    FormatListBulleted as FormatListBulletedIcon,
} from '@mui/icons-material'
import {
    DateCalendar,
    LocalizationProvider,
    PickersDay,
    PickersDayProps,
} from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs'
import { useState } from 'react'

import { useMyFloating } from '@src/hooks'
import VocationIcon from '@src/icons/VocationIcon'
import { useBaseTimeContext } from '@src/pages/popup/contexts/BaseTimeContext'
import { useWorkingHoursContext } from '@src/pages/popup/contexts/WorkingHoursContext'
import { parseClockData } from '@src/utils/parseClockData'
import { parseScheduleData } from '@src/utils/parseScheduleData'

import { useFetchClockData } from '@popup/hooks/queries/useFetchClockData'
import { useFetchScheduleData } from '@popup/hooks/queries/useFetchScheduleData'
import { useFetchUserIdHash } from '@popup/hooks/queries/useFetchUserIdHash'

type ViewMode = 'list' | 'calendar'

interface 휴가정보Type {
    date: string
    infos: {
        name: string
        minutes: number
        hours: number
    }[]
    totalMinutes?: number
    totalHours?: number
}

const TimeOff = () => {
    // NOTE: Flex API를 요청하기 위한 기본 시간 데이터가 담겨 있음
    const { baseTimeData } = useBaseTimeContext()
    const { workingHours } = useWorkingHoursContext()

    // NOTE: Flex API를 요청하기 위한 유저 아이디 해시가 담겨 있음
    const { data: userIdHash } = useFetchUserIdHash()

    // NOTE: 나의 근무상태 데이터를 가져옴
    const { data: clockData } = useFetchClockData({
        userIdHash,
        timeStampFrom: baseTimeData.firstDay,
        timestampTo: baseTimeData.lastDay,
        isCached: baseTimeData.isCached,
    })
    // NOTE: 나의 근무상태 데이터를 파싱하여 사용하기 쉽게 만듬
    const myClockData = parseClockData({
        data: clockData,
        now: baseTimeData.today,
    })

    // NOTE: 나의 스케줄 데이터를 가져옴
    const { data: scheduleData } = useFetchScheduleData({
        userIdHash,
        timeStamp: baseTimeData.today,
        isCached: baseTimeData.isCached,
    })
    // NOTE: 나의 스케줄 데이터를 파싱하여 사용하기 쉽게 만듬
    const myScheduleData = parseScheduleData({
        data: scheduleData,
        today: baseTimeData.today,
        clockData: myClockData,
        workingHoursPerDay: workingHours,
    })

    const [viewMode, setViewMode] = useState<ViewMode>('list')

    return (
        <section className="mt-2">
            <TimeOffHeader
                이번달휴가일수={myScheduleData.이번달휴가일수}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
            />
            <TimeOffMain
                휴가정보list={myScheduleData.휴가정보list}
                viewMode={viewMode}
            />
        </section>
    )
}

interface TimeOffHeaderProps {
    이번달휴가일수: number
    viewMode: ViewMode
    onViewModeChange: (mode: ViewMode) => void
}
const TimeOffHeader = (props: TimeOffHeaderProps) => {
    const { 이번달휴가일수, viewMode, onViewModeChange } = props

    return (
        <header className="flex items-center gap-x-5 px-3 py-2">
            <VocationIcon className="" />
            <div className="flex flex-1 flex-col gap-y-1">
                <span className="text-xs text-hint">이번 달 휴가 일수</span>
                <span className="text-lg text-alternative">
                    {이번달휴가일수 === 0
                        ? '사용한 연차가 없어요.'
                        : `${이번달휴가일수}일 쉬어요.`}
                </span>
            </div>
            <div className="flex gap-x-1">
                <button
                    onClick={() => onViewModeChange('list')}
                    className={`rounded p-1.5 transition-colors ${
                        viewMode === 'list'
                            ? 'bg-blue-100 text-blue-600'
                            : 'text-gray-400 hover:bg-gray-100'
                    }`}
                    title="리스트 보기"
                >
                    <FormatListBulletedIcon className="h-5 w-5" />
                </button>
                <button
                    onClick={() => onViewModeChange('calendar')}
                    className={`rounded p-1.5 transition-colors ${
                        viewMode === 'calendar'
                            ? 'bg-blue-100 text-blue-600'
                            : 'text-gray-400 hover:bg-gray-100'
                    }`}
                    title="캘린더 보기"
                >
                    <CalendarMonthIcon className="h-5 w-5" />
                </button>
            </div>
        </header>
    )
}

interface TimeOffMainProps {
    휴가정보list: 휴가정보Type[]
    viewMode: ViewMode
}
const TimeOffMain = (props: TimeOffMainProps) => {
    const { 휴가정보list, viewMode } = props

    if (viewMode === 'calendar') {
        return <TimeOffCalendarView 휴가정보list={휴가정보list} />
    }

    return <TimeOffListView 휴가정보list={휴가정보list} />
}

interface TimeOffListViewProps {
    휴가정보list: 휴가정보Type[]
}

const TimeOffListView = (props: TimeOffListViewProps) => {
    const { 휴가정보list } = props
    return (
        <main className="py-2 pl-[88px] pr-4">
            <ul className="flex flex-col">
                {휴가정보list.map((휴가정보) => (
                    <li
                        className="mb-2 flex flex-col text-sm text-alternative"
                        key={휴가정보.date}
                    >
                        <span>{휴가정보.date}</span>
                        <ul className="flex-flex-col">
                            {휴가정보.infos.map((info) => (
                                <li
                                    key={info.name}
                                    className="list-inside list-disc"
                                >
                                    {info.hours === 0
                                        ? ''
                                        : `${info.hours}시간`}{' '}
                                    {info.minutes % 60 === 0
                                        ? ''
                                        : `${info.minutes}분`}
                                </li>
                            ))}
                        </ul>
                    </li>
                ))}
            </ul>
        </main>
    )
}

interface TimeOffCalendarViewProps {
    휴가정보list: 휴가정보Type[]
}

// 휴가 정보를 담는 Map 타입
type VacationInfoMap = Map<string, 휴가정보Type['infos']>

// 휴가일에 툴팁을 표시하는 Day 컴포넌트
const VacationDayWithTooltip = (
    props: PickersDayProps & {
        vacationInfoMap: VacationInfoMap
    }
) => {
    const { day, outsideCurrentMonth, vacationInfoMap, ...other } = props

    const dateStr = dayjs(day).format('YYYY-MM-DD')
    const vacationInfo = vacationInfoMap.get(dateStr)
    const isVacation = !!vacationInfo

    const { floating, getFloatingInteraction, isOpen } = useMyFloating({
        placement: 'top',
        offset: 4,
        delay: { open: 200, close: 0 },
    })

    const floatingInteraction = getFloatingInteraction()

    return (
        <>
            <div
                ref={floating.refs.setReference}
                {...floatingInteraction.getReferenceProps()}
            >
                <PickersDay
                    {...other}
                    day={day}
                    outsideCurrentMonth={outsideCurrentMonth}
                    sx={{
                        ...(isVacation && {
                            backgroundColor: '#fce4ec',
                            color: '#e91e63',
                            fontWeight: 'bold',
                            '&:hover': {
                                backgroundColor: '#f8bbd9',
                            },
                            '&.Mui-selected': {
                                backgroundColor: '#e91e63',
                                color: '#fff',
                                '&:hover': {
                                    backgroundColor: '#c2185b',
                                },
                            },
                        }),
                    }}
                />
            </div>
            {isVacation && isOpen && (
                <FloatingPortal>
                    <div
                        ref={floating.refs.setFloating}
                        className="tooltip z-50"
                        style={floating.floatingStyles}
                        {...floatingInteraction.getFloatingProps()}
                    >
                        {vacationInfo.map((info, index) => (
                            <div key={index}>{info.name}</div>
                        ))}
                    </div>
                </FloatingPortal>
            )}
        </>
    )
}

// VacationDayWithTooltip를 위한 wrapper 생성 함수
const createVacationDay = (vacationInfoMap: VacationInfoMap) => {
    const VacationDayComponent = (props: PickersDayProps) => {
        return (
            <VacationDayWithTooltip
                {...props}
                vacationInfoMap={vacationInfoMap}
            />
        )
    }
    return VacationDayComponent
}

const TimeOffCalendarView = (props: TimeOffCalendarViewProps) => {
    const { 휴가정보list } = props

    // 휴가 날짜와 정보를 Map으로 변환
    // date 형식: "2025-12-15 (월)"
    const vacationInfoMap: VacationInfoMap = new Map()
    휴가정보list.forEach((휴가정보) => {
        // "2025-12-15 (월)" 형식에서 날짜 부분만 추출
        const dateStr = 휴가정보.date.split(' ')[0] // "2025-12-15"
        if (dateStr) {
            vacationInfoMap.set(dateStr, 휴가정보.infos)
        }
    })

    const VacationDay = createVacationDay(vacationInfoMap)

    return (
        <main className="flex justify-center">
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ko">
                <DateCalendar
                    readOnly
                    slots={{
                        day: VacationDay,
                    }}
                    sx={{
                        width: '100%',
                        maxWidth: 320,
                        '& .MuiPickersCalendarHeader-root': {
                            paddingLeft: 1,
                            paddingRight: 1,
                        },
                        '& .MuiDayCalendar-weekDayLabel': {
                            width: 36,
                            height: 36,
                            fontSize: '0.75rem',
                        },
                        '& .MuiPickersDay-root': {
                            width: 36,
                            height: 36,
                            fontSize: '0.875rem',
                        },
                    }}
                />
            </LocalizationProvider>
        </main>
    )
}

export default TimeOff
