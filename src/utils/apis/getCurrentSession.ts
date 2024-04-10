import { currentSession } from './types'

/**
 * 현재 로그인 한 세션의 회사 및 유저 정보를 가져옵니다.
 * @returns { Promise<currentSession> }
 */
const getCurrentSession = async (): Promise<currentSession> => {
    const response = await fetch(
        'https://flex.team/api/v2/workspace/users/me/workspace-users'
    )

    const { currentUser } = await response.json()
    delete currentUser.workspaceIdHash

    return currentUser
}

export default getCurrentSession
