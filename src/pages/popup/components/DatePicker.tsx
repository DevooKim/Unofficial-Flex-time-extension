import { Dayjs } from 'dayjs'
import {
    DatePicker as DatePickerMui,
    LocalizationProvider,
} from '@mui/x-date-pickers'
import { TextField } from '@mui/material'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'

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
