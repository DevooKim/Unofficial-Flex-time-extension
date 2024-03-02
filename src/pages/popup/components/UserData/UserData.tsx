import TimeDataSwitch from '../TimeDataSwitch'
import WorkingStatus from '../WorkingStatus'

const UserData = () => {
    return (
        <div>
            <div className="pb-4">
                <WorkingStatus />
            </div>
            <div>
                <TimeDataSwitch />
            </div>
        </div>
    )
}

export default UserData
