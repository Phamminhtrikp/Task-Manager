import React from 'react'

const TodoCheckList = ({ text, isChecked, onChange }) => {
    return (
        <div className="flex items-center gap-3 p-3">
            <input
                className="w-4 h-4 text-primary bg-gray-100 border border-gray-300 rounded-sm outline-none cursor-pointer"
                type="checkbox"
                checked={isChecked}
                onChange={onChange}
            />

            <p className="text-[13px] text-gray-800">{text}</p>
        </div>
    )
}

export default TodoCheckList;
