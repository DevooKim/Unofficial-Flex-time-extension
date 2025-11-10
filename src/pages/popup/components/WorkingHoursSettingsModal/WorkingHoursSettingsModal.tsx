import { useState } from 'react'

import { useWorkingHoursContext } from '@popup/contexts/WorkingHoursContext'

type WorkingHoursSettingsModalProps = {
    isOpen: boolean
    onClose: () => void
}

const WorkingHoursSettingsModal = ({
    isOpen,
    onClose,
}: WorkingHoursSettingsModalProps) => {
    const { workingHours, updateWorkingHours, resetWorkingHours } =
        useWorkingHoursContext()
    const [localHours, setLocalHours] = useState(workingHours)

    if (!isOpen) return null

    const handleSave = () => {
        updateWorkingHours(localHours)
        onClose()
    }

    const handleCancel = () => {
        setLocalHours(workingHours)
        onClose()
    }

    const handleReset = () => {
        resetWorkingHours()
        onClose()
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
                className="absolute inset-0 bg-black opacity-30"
                onClick={handleCancel}
            />
            <div className="relative z-10 w-80 rounded-lg bg-white p-6 shadow-lg">
                <h2 className="mb-4 text-h6 font-bold">근무시간 설정</h2>
                <div className="mb-4">
                    <label className="mb-2 block text-paragraph-sm text-alternative">
                        하루 근무시간 (시간)
                    </label>
                    <input
                        type="number"
                        min="1"
                        max="24"
                        value={localHours}
                        onChange={(e) =>
                            setLocalHours(Number(e.target.value) || 0)
                        }
                        className="w-full rounded border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                    />
                    <p className="mt-2 text-paragraph-xs text-gray-500">
                        초기화하면 근무규칙의 기본 근무시간으로 되돌아갑니다.
                    </p>
                </div>
                <div className="flex justify-between gap-2">
                    <button
                        onClick={handleReset}
                        className="rounded bg-orange-500 px-4 py-2 text-paragraph-sm text-white hover:bg-orange-600"
                    >
                        초기화
                    </button>
                    <div className="flex gap-2">
                        <button
                            onClick={handleCancel}
                            className="rounded bg-gray-200 px-4 py-2 text-paragraph-sm hover:bg-gray-300"
                        >
                            취소
                        </button>
                        <button
                            onClick={handleSave}
                            className="rounded bg-blue-500 px-4 py-2 text-paragraph-sm text-white hover:bg-blue-600"
                        >
                            저장
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default WorkingHoursSettingsModal
