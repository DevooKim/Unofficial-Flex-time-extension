import { searchUsersParams, searchUsersResult } from './types'

/**
 * 회사에 소속된 유저를 검색합니다.
 */
const searchUsers = async ({
    customerIdHash,
    keyword,
    filter,
    sort,
    size = 20,
    continuationToken,
}: searchUsersParams): Promise<searchUsersResult> => {
    const makePagingQuery = () => {
        const queries = []
        if (size) {
            queries.push(`size=${size}`)
        }
        if (continuationToken) {
            queries.push(`continuationToken=${continuationToken}`)
        }
        return queries.length ? `?${queries.join('&')}` : ''
    }

    const response = await fetch(
        `https://flex.team/action/v2/search/customers/${customerIdHash}/time-series/search-users${makePagingQuery()}`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ...(keyword && { keyword }),
                ...(sort && { sort }),
                filter: {
                    jobTitleIdHashes: [...(filter?.jobTitleIdHashes ?? [])],
                    jobRankIdHashes: [...(filter?.jobRankIdHashes ?? [])],
                    jobRoleIdHashes: [...(filter?.jobRoleIdHashes ?? [])],
                    departmentIdHashes: [...(filter?.departmentIdHashes ?? [])],
                    headUsers: [...(filter?.headUsers ?? [])],
                    userStatuses: [
                        ...(filter?.userStatuses ?? [
                            'LEAVE_OF_ABSENCE',
                            'LEAVE_OF_ABSENCE_SCHEDULED',
                            'RESIGNATION_SCHEDULED',
                            'IN_EMPLOY',
                            'IN_APPRENTICESHIP',
                        ]),
                    ],
                },
            }),
        }
    )

    return await response.json()
}

export default searchUsers
