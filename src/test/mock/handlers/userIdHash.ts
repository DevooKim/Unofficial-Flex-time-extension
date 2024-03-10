import { HttpResponse, http } from 'msw'

export const fetchUserIdHash = http.get(
    'https://flex.team/api/v2/core/users/me/user-settings',
    () => {
        const setting = {
            userIdHash: 'test-user-id-hash',
            locale: 'KO_KR',
            localeTag: 'ko-KR',
            localeName: '한국어 (대한민국)',
            timeZone: 'ASIA_SEOUL',
            timeZoneId: 'Asia/Seoul',
            timeZoneName: '대한민국 시간',
        }
        return HttpResponse.json({ setting })
    }
)
