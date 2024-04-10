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
