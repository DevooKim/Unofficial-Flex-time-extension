import { useQuery } from '@tanstack/react-query'
import axios, { AxiosError } from 'axios'

const OWNER = import.meta.env.VITE_GITHUB_OWNER
const REPO = import.meta.env.VITE_GITHUB_REPO

interface GitHubRelease {
    tag_name: string
    name: string
    prerelease: boolean
    draft: boolean
}

const fetchLatestVersion = async (): Promise<string> => {
    try {
        const { data } = await axios.get<GitHubRelease>(
            `https://api.github.com/repos/${OWNER}/${REPO}/releases/latest`,
            {
                headers: {
                    Accept: 'application/vnd.github.v3+json',
                },
                timeout: 10000, // 10초 타임아웃
            }
        )

        return data.tag_name
    } catch (error) {
        if (error instanceof AxiosError) {
            if (error.response?.status === 404) {
                console.warn('No releases found for this repository')
            } else if (error.response?.status === 403) {
                console.warn('GitHub API rate limit exceeded')
            } else if (error.code === 'ECONNABORTED') {
                console.warn('Request timeout while fetching latest version')
            }
        }
        throw error
    }
}

export const useFetchLatestVersion = () =>
    useQuery({
        queryKey: ['latestVersion'],
        queryFn: fetchLatestVersion,
        staleTime: 1000 * 60 * 60, // 1시간 동안 캐시 유지
        gcTime: 1000 * 60 * 60 * 6, // 6시간 동안 가비지 컬렉션 방지
        retry: 2, // 실패 시 2번 재시도
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // 지수 백오프
        refetchOnWindowFocus: false, // 창 포커스 시 재요청 안 함
        refetchOnMount: false, // 마운트 시 재요청 안 함 (staleTime 내)
    })
