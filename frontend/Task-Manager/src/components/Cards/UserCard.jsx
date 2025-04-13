import React from 'react'
import StatCard from './StatCard';

const UserCard = ({ userInfo }) => {
    return (
        <div className="user-card p-2">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <img
                        src={userInfo?.profileImgUrl || null}
                        alt={`${userInfo?.name}-avatar`}
                        className="w-12 h-12 rounded-full border-2 border-white"
                    />

                    <div>
                        <p className="text-sm font-medium">{userInfo?.name}</p>
                        <p className="text-xs text-gray-500">{userInfo?.email}</p>
                    </div>
                </div>
            </div>

            <div className="flex items-end gap-3 mt-5">
                <StatCard
                    label={"Pending"}
                    count={userInfo?.pendingTasks || 0}
                    status={"Pending"}
                />

                <StatCard
                    label={"In Progress"}
                    count={userInfo?.inProgressTasks || 0}
                    status={"In Progress"}
                />

                <StatCard
                    label={"Completed"}
                    count={userInfo?.completedTask || 0}
                    status={"Completed"}
                />
            </div>
        </div>
    )
}

export default UserCard;
