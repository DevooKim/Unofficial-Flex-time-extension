import {
    userCurrentStatusLabel,
    userCurrentStatusRequests,
    userCurrentStatusResponse,
} from './types'

const checkScheduledCurrentStatus = (
    currentStatus: userCurrentStatusResponse
): userCurrentStatusLabel => {
    const {
        targetDayWorkSchedule: { timeOffs, workRecords },
        onGoingRecordPack,
    } = currentStatus
    const currentTimeStamp = new Date().getTime()

    // 휴가중인지 체크
    for (const timeOff of timeOffs) {
        // 연차 단위인 경우, 휴가중
        if (timeOff.timeOffRegisterUnit === 'DAY') {
            return '휴가중'
        }
        // 연차가 아니고 시간대가 존재하는 경우, 현재 시간이 휴가 시간대에 속하면 휴가중
        else if (timeOff.blockTimeFrom && timeOff.blockTimeTo) {
            if (
                timeOff.blockTimeFrom.timeStamp <= currentTimeStamp &&
                currentTimeStamp < timeOff.blockTimeTo.timeStamp
            ) {
                return '휴가중'
            }
        }
    }

    // 휴가가 없으면 근무중인지 체크
    if (onGoingRecordPack && onGoingRecordPack.onGoing) {
        // 현재 휴게중인지 체크
        const currentRestRecord =
            onGoingRecordPack.restRecords?.pop() ?? undefined
        if (
            !currentRestRecord?.restStopRecord &&
            currentRestRecord?.restStartRecord &&
            currentRestRecord.restStartRecord.targetTime <= currentTimeStamp
        ) {
            return '휴게중'
        } else if (
            currentRestRecord?.restStopRecord &&
            currentRestRecord.restStartRecord &&
            currentRestRecord.restStartRecord.targetTime <= currentTimeStamp &&
            currentTimeStamp < currentRestRecord.restStopRecord.targetTime
        ) {
            return '휴게중'
        }
        return '근무중'
    }
    // 근무중이 아닌데 근무 기록이 있으면 퇴근
    else if (workRecords.length) {
        return '퇴근'
    }

    // 아무 것도 해당되지 않을 경우, 출근 전
    return '출근전'
}

/**
 * 특정 유저의 현재 근무 및 휴가 상태를 가져옵니다.
 * @param params 파라미터
 * @param params.userIdHash 유저 아이디 해시값
 * @returns {Promise<userCurrentStatusResponse>}
 */
const getUserCurrentStatus = async ({
    userIdHash,
}: userCurrentStatusRequests): Promise<userCurrentStatusResponse> => {
    const response = await fetch(
        `https://flex.team/api/v2/time-tracking/work-clock/users/${userIdHash}/current-status`
    )

    const userCurrentStatus: userCurrentStatusResponse = await response.json()
    userCurrentStatus.status = checkScheduledCurrentStatus(userCurrentStatus)

    return userCurrentStatus
}

export default getUserCurrentStatus
