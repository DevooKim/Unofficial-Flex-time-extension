import InfoIcon from '@mui/icons-material/Info'
import { Paper, Tooltip } from '@mui/material'
import { Box } from '@mui/system'
import React from 'react'

interface ITimeResult {
    children: React.ReactNode
    backgroundColor?: string
    label?: string
}
export interface IItem {
    info: React.ReactNode
    tooltipTitle?: string
    borderColor?: string
}

const TimeResult = ({ children, backgroundColor, label }: ITimeResult) => (
    <Paper sx={{ background: backgroundColor }} elevation={2}>
        {label && <div>{label}</div>}
        {children}
    </Paper>
)
const Item = ({ info, tooltipTitle, borderColor = 'black' }: IItem) => (
    <>
        <Box
            display="flex"
            alignItems="center"
            sx={{
                borderBottom: `1px solid ${borderColor}`,
                ':last-child': {
                    borderBottom: 'none',
                },
            }}
        >
            <Box fontSize="1rem" lineHeight={1.5} px={1} py={0.5}>
                {info}
            </Box>
            {tooltipTitle && (
                <Tooltip title={tooltipTitle} arrow>
                    <InfoIcon sx={{ fontSize: '1.2rem', pl: 0.5 }} />
                </Tooltip>
            )}
        </Box>
    </>
)

TimeResult.Item = Item

export default TimeResult
