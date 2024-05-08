import { TextField } from '@mui/material'
import {
    DatePicker as DatePickerMui,
    LocalizationProvider,
} from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { Dayjs } from 'dayjs'

type DatePickerProps = {
    value: Dayjs
    setValue: (day: Dayjs) => void
}

const DatePicker: React.FC<DatePickerProps> = ({ value, setValue }) => (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="kr">
        <DatePickerMui
            label="근무 정보"
            value={value}
            openTo="month"
            views={['year', 'month']}
            onChange={(newValue) => {
                setValue(newValue as Dayjs)
            }}
            renderInput={(params) => {
                if (params.inputProps) {
                    params.inputProps.value = `${value.get('year')}년 ${
                        value.get('month') + 1
                    }월`
                    params.inputProps.readOnly = true
                }

                return <TextField size="small" {...params} />
            }}
        />
    </LocalizationProvider>
)

export default DatePicker
