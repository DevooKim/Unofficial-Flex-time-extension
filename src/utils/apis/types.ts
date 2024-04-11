/** 현재 로그인 한 유저에 대한 회사 및 유저 정보 응답 데이터 타입 정의 */
export type currentSession = {
    /** 회사 정보 */
    customer: {
        /** 회사 아이디 해시값 */
        customerIdHash: string
        /** 설립일 */
        establishDate: string
        /** 회사명 */
        name: string
    }
    /** 로그인 유저 정보 */
    user: {
        /** 회사 아이디 해시값 */
        customerIdHash: string
        /** 영문 유저명 */
        englishName: {
            /** 영문 이름 */
            firstName: string
            /** 영문 성 */
            lastName: string
        }
        /** 유저명 */
        name: string
        /** 유저 아이디 해시값 */
        userIdHash: string
    }
}

/** 회사에 소속된 유저 검색 - 필터: 유저 상태 타입 정의 */
type usersStatusesTypes =
    | 'LEAVE_OF_ABSENCE'
    | 'LEAVE_OF_ABSENCE_SCHEDULED'
    | 'RESIGNATION_SCHEDULED'
    | 'IN_EMPLOY'
    | 'IN_APPRENTICESHIP'
/** 회사에 소속된 유저 검색 - 정렬: 정렬 기준 타입 정의 */
type searchUsersSortMethodTypes = 'DISPLAY_NAME' // | and so on...
/** 회사에 소속된 유저 검색 - 정렬: 정렬 순서 타입 정의 */
type searchUsersSortDirectionTypes = 'ASC' | 'DESC'

/** 회사에 소속된 유저 검색 파라미터 타입 정의 */
export type searchUsersParams = {
    /** 회사 아이디 해시값 */
    customerIdHash: string
    /** 검색 키워드 */
    keyword?: string
    /** 필터 */
    filter?: {
        jobTitleIdHashes?: string[]
        jobRankIdHashes?: string[]
        jobRoleIdHashes?: string[]
        departmentIdHashes?: string[]
        headUsers: string[]
        userStatuses: usersStatusesTypes[]
    }
    /** 정렬 */
    sort?: {
        /** 정렬 기준 */
        sortType: searchUsersSortMethodTypes
        /** 정렬 순서 */
        directionType: searchUsersSortDirectionTypes
    }
    /** 페이지네이션 크기 */
    size?: number
    /** 다음 페이지네이션 지점 - 이전 API 호출에서 나온 continuation 값을 넣을 경우 해당 유저 기준 다음 데이터 부터 불러옵니다. */
    continuationToken?: string
}

interface searchUsersListTypesBase {
    /** 회사 아이디 해시값 */
    customerIdHash: string
    /** 직위 정보 */
    employeeInfo: {
        jobLevels: object[]
        jobRanks: object[]
        jobRoles: object[]
        position: object[]
    }
    /** 유저 상태 태그 */
    tagInfo: {
        userStatuses: usersStatusesTypes[]
    }
    /** 유저 아이디 해시값 */
    userIdHash: string
}

/** 유저 리스트 타입 정의 */
interface searchUsersListTypes extends searchUsersListTypesBase {
    /** 기본 정보 */
    basicInfo: {
        /** 내 소개 글 */
        aboutMe: string
        /** 생일 */
        birth: {
            /** 월 */
            month: number
            /** 일 */
            day: number
        }
        /** 입사일 */
        companyJoined: {
            /** 연도 */
            year: number
            /** 월 */
            month: number
            /** 일 */
            day: number
        }
        /** 표시 이름 */
        displayName: string
        /** 이메일 */
        email: string
        /** 성별 */
        gender: 'MALE' | 'FEMAIL' | 'UNKNOWN'
        /** 성함 */
        name: string
        /** 영문 유저명 */
        englishName: {
            /** 영문 이름 */
            firstName: string
            /** 영문 성 */
            lastName: string
        }
        /** 원본 이메일 */
        originEmail: string
        /** 프로필 커버 이미지 */
        profileCoverImageUrl: string
        /** 프로필 이미지 */
        profileImageUrl: string
        /** 프로필 썸네일 이미지 */
        profileThumbnailImageUrl: string
    }
}

interface searchUsersListOriginalTypes extends searchUsersListTypesBase {
    basicInfo: {
        aboutMe: string
        birth: {
            monthDaySplit: {
                month: number
                day: number
            }
        }
        companyJoin: {
            yearMonthDaySplit: {
                year: number
                month: number
                day: number
            }
        }
        displayName: string
        email: string
        gender: 'MALE' | 'FEMAIL' | 'UNKNOWN'
        name: string
        nameInEnglishFirst: string
        nameInEnglishLast: string
        originEmail: string
        profileCoverImageUrl: string
        profileImageUrl: string
        profileThumbnailImageUrl: string
    }
}

interface searchUsersResultBase {
    /** 다음 페이지네이션 지점 - 다음 API 호출 시 해당 값을 전달하면 이후 유저 데이터 부터 불러옵니다. */
    continuation: string
    /** 다음 페이지 존재 유무 */
    hasNext: boolean
    /** 전체 값 */
    total: {
        /** 총 유저 수 */
        value: number
        relation: string
    }
}

/** 회사에 소속된 유저 검색 응답 데이터 타입 정의 */
export interface searchUsersResult extends searchUsersResultBase {
    /** 유저 리스트 */
    list: searchUsersListTypes[]
}

export interface searchUsersResultOriginal extends searchUsersResultBase {
    list: searchUsersListOriginalTypes[]
}
