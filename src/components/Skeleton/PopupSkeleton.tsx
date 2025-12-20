import { Skeleton } from '@mui/material'

const PopupSkeleton = () => (
    <div className="flex flex-col gap-4 p-5">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
                <Skeleton variant="text" width={80} height={28} />
                <Skeleton variant="text" width={60} height={20} />
            </div>
            <div className="flex items-center gap-1">
                <Skeleton variant="circular" width={24} height={24} />
                <Skeleton variant="circular" width={24} height={24} />
                <Skeleton variant="circular" width={24} height={24} />
            </div>
        </div>

        {/* UserData Skeleton */}
        <div>
            {/* WorkingStatus Skeleton */}
            <div className="pb-4">
                <Skeleton
                    variant="rounded"
                    height={120}
                    sx={{ borderRadius: '8px' }}
                />
            </div>

            {/* TimeDataSwitch Skeleton */}
            <div>
                <Skeleton
                    variant="rounded"
                    height={40}
                    sx={{ borderRadius: '8px', marginBottom: '16px' }}
                />
                <div className="flex flex-col gap-3">
                    <Skeleton variant="rounded" height={60} />
                    <Skeleton variant="rounded" height={60} />
                    <Skeleton variant="rounded" height={60} />
                </div>
            </div>
        </div>
    </div>
)

export default PopupSkeleton
