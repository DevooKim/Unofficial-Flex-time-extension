## 현재 work-rule 조회

GET https://flex.team/api/v2/work-rule/users/{userId}/work-rules/current

```json
{
    "workRule": {
        "customerIdHash": "customerIdHash",
        "userIdHash": "userIdHash",
        "dateFrom": "2025-03-01",
        "dateTo": "9999-12-31",
        "customerWorkRuleId": "230756",
        "userWorkRuleId": "1182796",
        "userWorkRuleActor": {
            "customerIdHash": "customerIdHash",
            "userIdHash": "aaa",
            "interfaceType": "FLEX"
        },
        "eventTimeStamp": 1741561661393
    }
}
```

## rule 정보 조회

GET https://flex.team/api/v2/work-rule/customers/{customerIdHash}/work-rules/{customerWorkRuleId}

```json
{
    "workRules": [
        {
            "customerIdHash": "customerIdHash",
            "customerWorkRuleId": "230756",
            "workRecordRule": {
                "customerIdHash": "customerIdHash",
                "customerWorkRecordRuleId": "230760",
                "recordRuleName": "",
                "checkWorkDensity": false,
                "onTimeRecord": {
                    "bufferMinutes": 0,
                    "recordType": "PLAN",
                    "enabled": true
                },
                "realTimeRecord": {
                    "enabled": true,
                    "restEnabled": true
                },
                "autoWorkPlanEnabled": false,
                "possibleOverStatutoryWorkingMinutes": false,
                "possibleEarlyWorkStart": true,
                "forceMinimumRestTime": true,
                "allowLackOfWeeklyHolidays": false,
                "possibleAutoWorkStop": false,
                "skipWorkClockConfirm": false,
                "workClockStopPreference": "REAL_TIME",
                "gpsBasedCommuteRestrictionEnabled": false
            },
            "ruleName": "46시간,7시30분시작,휴게 12:00~13:00",
            "controlType": "FULL_FLEXIBLE",
            "workingHourType": "FULL_TIME",
            "autoConversionEnabled": true,
            "workingPeriodRule": {
                "unit": "MONTH",
                "count": 1,
                "beginDate": "2025-03-01"
            },
            "primary": true,
            "hidden": false,
            "workingHourCalculationStrategy": "FLEXIBLE_CALENDAR_DAY_BASED",
            "weekWorkingHourRule": [
                {
                    "dayOfWeek": "MONDAY",
                    "agreedWorkingMinutes": 480,
                    "usualWorkingMinutes": 480,
                    "dayWorkingType": "WORKING_DAY",
                    "recommendedRestTimeRanges": [
                        {
                            "from": "12:00:00",
                            "to": "13:00:00"
                        },
                        {
                            "from": "06:00:00",
                            "to": "07:30:00"
                        }
                    ],
                    "regularWorkDay": true
                },
                {
                    "dayOfWeek": "TUESDAY",
                    "agreedWorkingMinutes": 480,
                    "usualWorkingMinutes": 480,
                    "dayWorkingType": "WORKING_DAY",
                    "recommendedRestTimeRanges": [
                        {
                            "from": "12:00:00",
                            "to": "13:00:00"
                        },
                        {
                            "from": "06:00:00",
                            "to": "07:30:00"
                        }
                    ],
                    "regularWorkDay": true
                },
                {
                    "dayOfWeek": "WEDNESDAY",
                    "agreedWorkingMinutes": 480,
                    "usualWorkingMinutes": 480,
                    "dayWorkingType": "WORKING_DAY",
                    "recommendedRestTimeRanges": [
                        {
                            "from": "12:00:00",
                            "to": "13:00:00"
                        },
                        {
                            "from": "06:00:00",
                            "to": "07:30:00"
                        }
                    ],
                    "regularWorkDay": true
                },
                {
                    "dayOfWeek": "THURSDAY",
                    "agreedWorkingMinutes": 480,
                    "usualWorkingMinutes": 480,
                    "dayWorkingType": "WORKING_DAY",
                    "recommendedRestTimeRanges": [
                        {
                            "from": "12:00:00",
                            "to": "13:00:00"
                        },
                        {
                            "from": "06:00:00",
                            "to": "07:30:00"
                        }
                    ],
                    "regularWorkDay": true
                },
                {
                    "dayOfWeek": "FRIDAY",
                    "agreedWorkingMinutes": 480,
                    "usualWorkingMinutes": 480,
                    "dayWorkingType": "WORKING_DAY",
                    "recommendedRestTimeRanges": [
                        {
                            "from": "12:00:00",
                            "to": "13:00:00"
                        },
                        {
                            "from": "06:00:00",
                            "to": "07:30:00"
                        }
                    ],
                    "regularWorkDay": true
                },
                {
                    "dayOfWeek": "SATURDAY",
                    "agreedWorkingMinutes": 0,
                    "usualWorkingMinutes": 0,
                    "dayWorkingType": "WEEKLY_UNPAID_HOLIDAY",
                    "recommendedRestTimeRanges": [
                        {
                            "from": "12:00:00",
                            "to": "13:00:00"
                        },
                        {
                            "from": "06:00:00",
                            "to": "07:30:00"
                        }
                    ],
                    "regularWorkDay": false
                },
                {
                    "dayOfWeek": "SUNDAY",
                    "agreedWorkingMinutes": 0,
                    "usualWorkingMinutes": 0,
                    "dayWorkingType": "WEEKLY_PAID_HOLIDAY",
                    "recommendedRestTimeRanges": [
                        {
                            "from": "12:00:00",
                            "to": "13:00:00"
                        },
                        {
                            "from": "06:00:00",
                            "to": "07:30:00"
                        }
                    ],
                    "regularWorkDay": false
                }
            ],
            "baseAgreedDayWorkingMinutes": 480,
            "applyAllHolidaysIfShortHoursPartTimer": false,
            "useRegardedOverWork": true,
            "exceedStatutoryWorkingMinutesSettingEnabled": false,
            "distributePeriodOverToDay": false,
            "schedulingEnabled": true
        }
    ]
}
```

## ACTIONS

-   customerIdHash는 환경변수로 설정
-   헤더의 설정에서 ruleName(이름), baseAgreedDayWorkingMinutes(하루 근무시간), dateFrom(적용일) 표시 - flex에서 적용된 규칙

-   src/pages/popup/contexts/WorkingHoursContext.tsx
    -   storage에 값이 없다면 baseAgreedDayWorkingMinutes 값을 사용
    -   baseAgreedDayWorkingMinutes도 없다면  DEFAULT_WORKING_HOURS 사용
    -   storage.local의 workingHoursPerDay값 초기화 기능과 UI추가

## BUGS

-   src/pages/popup/components/WorkingTimeResult.tsx의 WorkingTimeResult()에서 refreshBaseTimeIfInvalid 버그 수정
