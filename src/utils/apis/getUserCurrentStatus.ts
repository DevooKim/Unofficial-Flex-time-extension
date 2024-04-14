import { userCurrentStatusRequests, userCurrentStatusResponse } from './types'

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

    return userCurrentStatus
}

export default getUserCurrentStatus
