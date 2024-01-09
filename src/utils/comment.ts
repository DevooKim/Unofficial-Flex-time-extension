import _sample from 'lodash/sample'

export const getComment1 = () => {
    const comments = [
        '오늘 하루도 힘을 내서 일해봐요. 기운 넘치게 시작해보죠.',
        '상쾌한 아침! 이번에도 즐겁게 업무를 시작해봐요. 오늘 하루도 힘차게 화이팅!',
        '오늘도 힘을 내서 최선을 다해보아요. 에너지 가득한 하루가 되길 기대해봐요.',
        '오늘은 느긋하게 시작해보면 어떨까요? 조금씩 진행하며 최선을 다하면 될 거예요.',
        '새로운 아침, 무리하지 않고 조금씩 업무에 힘을 주어봐요.',
        '새로운 아침이네요. 업무에 차근차근 힘을 내어봐요. 기운 넘치게 하루를 보내봐요.',
    ]

    return _sample(comments)
}

export const getComment2 = () => {
    const comments = [
        '조금만 더 힘내서 퇴근을 맞이하세요!',
        '곧 퇴근이에요. 오늘도 수고 많았어요!',
    ]

    return _sample(comments)
}

export const getComment3 = () => {
    const comments = [
        '오늘도 고생 많았어요. 이제 퇴근 후에는 마음 편하게 즐겁게 시간을 보내봐요.',
        '수고했어요! 이제 퇴근하고 나서 자유롭게 휴식을 취해봐요.',
    ]

    return _sample(comments)
}
