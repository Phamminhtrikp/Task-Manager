import React from 'react'

const StatCard = ({ label, count, status }) => {
    const getStatusTagColor = () => {
        switch (status) {
            case "In Progress":
                return "text-cyan-500 bg-gray-50";
                break;

            case "Completed":
                return "text-indigo-500 bg-gray-50";
                break;

            default:
                return "text-violet-500 bg-gray-50";
                break;
        }
    }
    return (
        <div
            className={`flex-1 text-[10px] font-medium ${getStatusTagColor()} px-4 py-0.5 rounded`}
        >
            <span className={"text-[12px] font-semibold"}> {count} </span> <br /> {label}
        </div>
    )
}

export default StatCard;
