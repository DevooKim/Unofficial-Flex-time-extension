import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

const OWNER = import.meta.env.VITE_GITHUB_OWNER
const REPO = import.meta.env.VITE_GITHUB_REPO

export const useFetchLatestVersion = () =>
    useQuery({
        queryKey: ['latestVersion'],
        queryFn: async () => {
            const { data } = await axios.get(
                `https://api.github.com/repos/${OWNER}/${REPO}/releases/latest`
            )

            return data.tag_name
        },
    })
