import React from 'react'
import { Box } from '@mui/system'
import { Divider, Tooltip } from '@mui/material'
import InfoIcon from '@mui/icons-material/Info'

interface ITimeResult {
    children: React.ReactNode
    backgroundColor?: string
}
export interface IItem {
    info: React.ReactNode
    tooltipTitle?: string
}

const TimeResult = ({ children, backgroundColor }: ITimeResult) => (
    <Box
        sx={{
            backgroundColor,
            borderBottom: '2px solid black',
        }}
    >
        {children}
    </Box>
)
const Item = ({ info, tooltipTitle }: IItem) => (
    <>
        <Box display="flex" alignItems="center">
            <Box fontSize="1rem" lineHeight={1.5} px={1} py={0.5}>
                {info}
            </Box>
            {tooltipTitle && (
                <Tooltip title={tooltipTitle} arrow>
                    <InfoIcon sx={{ fontSize: '1.2rem', pl: 0.5 }} />
                </Tooltip>
            )}
        </Box>
        <Divider />
    </>
)

TimeResult.Item = Item

export default TimeResult
