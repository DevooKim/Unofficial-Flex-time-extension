import { FloatingPortal } from '@floating-ui/react'
import {
    CalendarMonth as CalendarMonthIcon,
    FormatListBulleted as FormatListBulletedIcon,
} from '@mui/icons-material'
import { CircularProgress } from '@mui/material'
import {
    DateCalendar,
    LocalizationProvider,
    PickersDay,
    PickersDayProps,
} from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs, { Dayjs } from 'dayjs'
import { startTransition, useState } from 'react'

import { useMyFloating } from '@src/hooks'
import VocationIcon from '@src/icons/VocationIcon'
import { useBaseTimeContext } from '@src/pages/popup/contexts/BaseTimeContext'
import { useWorkingHoursContext } from '@src/pages/popup/contexts/WorkingHoursContext'
import { myHolidayDay, myTimeOffDay, myTimeOffInfo } from '@src/types'

import { useFetchTimeOffUses } from '@popup/hooks/queries/useFetchTimeOffUses'
import { useFetchUserIdHash } from '@popup/hooks/queries/useFetchUserIdHash'
import { useFetchWorkingDayAttributes } from '@popup/hooks/queries/useFetchWorkingDayAttributes'

type ViewMode = 'list' | 'calendar'

const formatVacationDays = (days: number) =>
    Number.isInteger(days) ? `${days}` : days.toFixed(1)

const getDayDisplayType = (infos: myTimeOffInfo[]) => {
    const hasFull = infos.some((info) => info.displayType === 'full')
    const hasMorningHalf = infos.some(
        (info) => info.displayType === 'morningHalf'
    )
    const hasAfternoonHalf = infos.some(
        (info) => info.displayType === 'afternoonHalf'
    )

    if (hasFull || (hasMorningHalf && hasAfternoonHalf)) {
        return 'full'
    }

    if (hasMorningHalf) {
        return 'morningHalf'
    }

    if (hasAfternoonHalf) {
        return 'afternoonHalf'
    }

    return 'full'
}

const TimeOff = () => {
    const { baseTimeData } = useBaseTimeContext()
    const { workingHours } = useWorkingHoursContext()
    const { data: userIdHash } = useFetchUserIdHash()
    const [viewMode, setViewMode] = useState<ViewMode>('list')
    const [calendarMonth, setCalendarMonth] = useState(() =>
        dayjs(baseTimeData.today).startOf('month')
    )

    const {
        data: timeOffData,
        isFetching,
        isPending,
    } = useFetchTimeOffUses({
        userIdHash,
        timeStampFrom: calendarMonth.startOf('month').valueOf(),
        timeStampTo: calendarMonth.endOf('month').valueOf(),
        workingHoursPerDay: workingHours,
    })

    const resolvedTimeOffData = timeOffData || {
        휴가정보list: [],
        휴가일수: 0,
    }
    const {
        data: holidayData,
        isFetching: isHolidayFetching,
        isPending: isHolidayPending,
    } = useFetchWorkingDayAttributes({
        userIdHash,
        from: calendarMonth
            .startOf('month')
            .startOf('week')
            .format('YYYY-MM-DD'),
        to: calendarMonth.endOf('month').endOf('week').format('YYYY-MM-DD'),
        timezone: 'Asia/Seoul',
    })
    const resolvedHolidayData = holidayData || {
        휴일정보list: [],
    }

    const handleMonthChange = (nextMonth: Dayjs) => {
        startTransition(() => {
            setCalendarMonth(nextMonth.startOf('month'))
        })
    }

    return (
        <section className="mt-2">
            <TimeOffHeader
                monthLabel={calendarMonth.format('M월')}
                휴가일수={resolvedTimeOffData.휴가일수}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
            />
            <TimeOffMain
                calendarMonth={calendarMonth}
                isLoading={
                    isFetching ||
                    isPending ||
                    isHolidayFetching ||
                    isHolidayPending
                }
                onMonthChange={handleMonthChange}
                휴일정보list={resolvedHolidayData.휴일정보list}
                휴가정보list={resolvedTimeOffData.휴가정보list}
                viewMode={viewMode}
            />
        </section>
    )
}

interface TimeOffHeaderProps {
    monthLabel: string
    휴가일수: number
    viewMode: ViewMode
    onViewModeChange: (mode: ViewMode) => void
}
const TimeOffHeader = (props: TimeOffHeaderProps) => {
    const { monthLabel, 휴가일수, viewMode, onViewModeChange } = props

    return (
        <header className="flex items-center gap-x-5 px-3 py-2">
            <VocationIcon className="" />
            <div className="flex flex-1 flex-col gap-y-1">
                <span className="text-xs text-hint">
                    {monthLabel} 휴가 일수
                </span>
                <span className="text-lg text-alternative">
                    {휴가일수 === 0
                        ? '등록된 휴가가 없어요.'
                        : `${formatVacationDays(휴가일수)}일 쉬어요.`}
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
    calendarMonth: Dayjs
    isLoading: boolean
    onMonthChange: (nextMonth: Dayjs) => void
    휴일정보list: myHolidayDay[]
    휴가정보list: myTimeOffDay[]
    viewMode: ViewMode
}
const TimeOffMain = (props: TimeOffMainProps) => {
    const {
        calendarMonth,
        isLoading,
        onMonthChange,
        휴일정보list,
        휴가정보list,
        viewMode,
    } = props

    if (viewMode === 'calendar') {
        return (
            <TimeOffCalendarView
                calendarMonth={calendarMonth}
                isLoading={isLoading}
                onMonthChange={onMonthChange}
                휴일정보list={휴일정보list}
                휴가정보list={휴가정보list}
            />
        )
    }

    return <TimeOffListView 휴가정보list={휴가정보list} />
}

interface TimeOffListViewProps {
    휴가정보list: myTimeOffDay[]
}

const TimeOffListView = (props: TimeOffListViewProps) => {
    const { 휴가정보list } = props

    if (휴가정보list.length === 0) {
        return (
            <main className="px-4 py-6 text-center text-sm text-hint">
                이 달에 등록된 휴가가 없어요.
            </main>
        )
    }

    return (
        <main className="py-2 pl-[88px] pr-4">
            <ul className="flex flex-col">
                {휴가정보list.map((휴가정보) => (
                    <li
                        className="mb-2 flex flex-col text-sm text-alternative"
                        key={휴가정보.date}
                    >
                        <span>{휴가정보.date}</span>
                        <ul className="flex flex-col">
                            {휴가정보.infos.map((info) => (
                                <li
                                    key={info.key}
                                    className="list-inside list-disc"
                                >
                                    {info.label}
                                    {info.timeRangeText
                                        ? ` (${info.timeRangeText})`
                                        : ''}
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
    calendarMonth: Dayjs
    isLoading: boolean
    onMonthChange: (nextMonth: Dayjs) => void
    휴일정보list: myHolidayDay[]
    휴가정보list: myTimeOffDay[]
}

type HolidayInfoMap = Map<string, myHolidayDay>
type VacationInfoMap = Map<string, myTimeOffDay>

const VacationDayWithTooltip = (
    props: PickersDayProps & {
        holidayInfoMap: HolidayInfoMap
        vacationInfoMap: VacationInfoMap
    }
) => {
    const {
        day,
        outsideCurrentMonth,
        holidayInfoMap,
        vacationInfoMap,
        ...other
    } = props

    const dateStr = dayjs(day).format('YYYY-MM-DD')
    const holidayDay = holidayInfoMap.get(dateStr)
    const hasHoliday = !!holidayDay
    const vacationDay = vacationInfoMap.get(dateStr)
    const isVacation = !!vacationDay
    const dayDisplayType = vacationDay
        ? getDayDisplayType(vacationDay.infos)
        : 'full'

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
                        ...(hasHoliday && {
                            color: '#d32f2f',
                            fontWeight: 700,
                        }),
                        ...(isVacation && {
                            color: hasHoliday ? '#d32f2f' : '#e91e63',
                            fontWeight: 'bold',
                            backgroundColor:
                                dayDisplayType === 'full'
                                    ? '#fce4ec'
                                    : 'transparent',
                            backgroundImage:
                                dayDisplayType === 'morningHalf'
                                    ? 'linear-gradient(to right, #fce4ec 50%, transparent 50%)'
                                    : dayDisplayType === 'afternoonHalf'
                                      ? 'linear-gradient(to right, transparent 50%, #fce4ec 50%)'
                                      : 'none',
                            '&:hover': {
                                backgroundColor:
                                    dayDisplayType === 'full'
                                        ? '#f8bbd9'
                                        : 'transparent',
                                backgroundImage:
                                    dayDisplayType === 'morningHalf'
                                        ? 'linear-gradient(to right, #f8bbd9 50%, transparent 50%)'
                                        : dayDisplayType === 'afternoonHalf'
                                          ? 'linear-gradient(to right, transparent 50%, #f8bbd9 50%)'
                                          : 'none',
                            },
                        }),
                    }}
                />
            </div>
            {(hasHoliday || isVacation) && isOpen && (
                <FloatingPortal>
                    <div
                        ref={floating.refs.setFloating}
                        className="tooltip z-50"
                        style={floating.floatingStyles}
                        {...floatingInteraction.getFloatingProps()}
                    >
                        {holidayDay?.infos.map((info) => (
                            <div
                                key={info.key}
                                className="mb-1 text-[#fecaca] last:mb-0"
                            >
                                {info.label}
                            </div>
                        ))}
                        {holidayDay && vacationDay && (
                            <div className="my-1 border-t border-white/20" />
                        )}
                        {vacationDay?.infos.map((info) => (
                            <div key={info.key} className="mb-1 last:mb-0">
                                <div>{info.label}</div>
                                {info.timeRangeText && (
                                    <div className="text-[11px] text-gray-200">
                                        {info.timeRangeText}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </FloatingPortal>
            )}
        </>
    )
}

const createVacationDay = ({
    holidayInfoMap,
    vacationInfoMap,
}: {
    holidayInfoMap: HolidayInfoMap
    vacationInfoMap: VacationInfoMap
}) => {
    const VacationDayComponent = (props: PickersDayProps) => {
        return (
            <VacationDayWithTooltip
                {...props}
                holidayInfoMap={holidayInfoMap}
                vacationInfoMap={vacationInfoMap}
            />
        )
    }
    return VacationDayComponent
}

const TimeOffCalendarView = (props: TimeOffCalendarViewProps) => {
    const {
        calendarMonth,
        isLoading,
        onMonthChange,
        휴일정보list,
        휴가정보list,
    } = props

    const holidayInfoMap: HolidayInfoMap = new Map()
    휴일정보list.forEach((휴일정보) => {
        holidayInfoMap.set(휴일정보.rawDate, 휴일정보)
    })
    const vacationInfoMap: VacationInfoMap = new Map()
    휴가정보list.forEach((휴가정보) => {
        vacationInfoMap.set(휴가정보.rawDate, 휴가정보)
    })

    const VacationDay = createVacationDay({
        holidayInfoMap,
        vacationInfoMap,
    })

    return (
        <main className="relative flex justify-center">
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ko">
                <DateCalendar
                    readOnly
                    value={null}
                    referenceDate={calendarMonth}
                    onMonthChange={onMonthChange}
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
            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-white/60">
                    <CircularProgress size={28} className="text-link" />
                </div>
            )}
        </main>
    )
}

export default TimeOff
