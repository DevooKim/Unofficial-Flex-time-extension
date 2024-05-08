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

/** 회사 소속 유저 검색 응답 데이터 원본 타입 정의 */
export interface searchUsersResultOriginal extends searchUsersResultBase {
    list: searchUsersListOriginalTypes[]
}

/** 특정 유저의 현재 근무 및 휴가 상태를 가져오는 API 함수 요청 파라미터 정의 */
export type userCurrentStatusRequests = {
    /** 유저 아이디 해시값 */
    userIdHash: string
}

/** 휴가중 데이터 타입 정의 */
type userCurrentStatusTimeOffs = {
    /** 휴가 이벤트 아이디 */
    userTimeOffEventId: string
    /** 휴가 유형 아이디 */
    timeOffPolicyId: string
    /** 휴가 유형 */
    timeOffPolicyType: 'ANNUAL' | 'CUSTOM'
    /** 휴가 시작 시간 */
    blockTimeFrom: {
        /** 적용 타임 존 */
        zoneId: string
        /** 타임스탬프 */
        timeStamp: EpochTimeStamp
    }
    /** 휴가 종료 시간 */
    blockTimeTo: {
        /** 적용 타임 존 */
        zoneId: string
        /** 타임스탬프 */
        timeStamp: EpochTimeStamp
    }
    /** 승인 상태 */
    approval: {
        /** 승인 상태 */
        status: 'APPROVED'
        /** 태스크 키 */
        taskKey: string
        /** 승인 아이디 */
        approvalId: string
    }
    /** 승인 취소 진행 중 여부 */
    cancelApprovalInProgress: boolean
    /** 적용 시간 (분) */
    usedMinutes: number
    /** 실제(?) 적용 시간 (분) */
    usedPaidMinutes: number
    /** 휴게 시간 */
    restMinutes: number
    /** 휴가 사용 상태 */
    timeOffUseStatus: 'APPROVAL_COMPLETED'
    /** 휴가 등록 단위 */
    timeOffRegisterUnit: 'DAY' | 'HALF_DAY_AM' | 'HALF_DAY_PM'
}

/** 근무 기록 데이터 타입 정의 */
type userCurrentStatusRecords = {
    /** 이벤트 종류 */
    eventType: 'START' | 'STOP' | 'REST_START' | 'REST_STOP'
    /** 시간 (타임스탬프) */
    targetTime: EpochTimeStamp
    /** customerWorkFormId */
    customerWorkFormId?: string
    /** 기록 유형 */
    recordType: 'RECORD' | 'PLAN_BY_AUTO'
    /** 적용 타임 존 */
    zoneId: string
}

export type userCurrentStatusLabel =
    | '출근전'
    | '근무중'
    | '퇴근'
    | '휴게중'
    | '휴가중'

/** 특정 유저의 현재 근무 및 휴가 상태를 가져오는 API 함수 응답 데이터 타입 정의 */
export type userCurrentStatusResponse = {
    status: userCurrentStatusLabel
    /** 타깃(현재) 날짜 */
    targetDate: string
    /** 타깃(현재) 날짜에 대한 스케쥴 */
    targetDayWorkSchedule: {
        /** 날짜 */
        date: string
        /** 근무 기록 */
        workRecords: object[] // ? -> 추후 타입체크 필요
        /** 휴가 내역 */
        timeOffs: userCurrentStatusTimeOffs[]
    }
    /** 현재 진행 중인 근무 기록 */
    onGoingRecordPack?: {
        /** 근무 시작 기록 */
        startRecord: userCurrentStatusRecords
        /** 근무 유형 전환 기록(?) */
        switchRecords: userCurrentStatusRecords[] // ? -> 우선 userCurrentStatusRecords 타입으로 / 추후 타입체크 필요
        /** 휴게 기록 */
        restRecords:
            | [
                  {
                      /** 휴게 시작 */
                      restStartRecord: userCurrentStatusRecords
                      /** 휴게 종료 */
                      restStopRecord: userCurrentStatusRecords
                  },
              ]
            | []
        /** 근무 중 여부 */
        onGoing: boolean
    }
    /** 적용 타임 존 */
    appliedZoneId: string
}
