import React from 'react'

const DeleteAlert = ({ content, onDelete, onClose }) => {
    return (
        <div>
            <p className="text-sm text-red-500">{content}</p>
            <div className="flex justify-end mt-6 gap-3">
                <button
                    className="flex items-center justify-center gap-1 5 textx-xs md:text-sm font-medium text-rose-500 whitespace-nowrap bg-rose-50 hover:bg-rose-300 hover:text-rose-700 border border-rose-100 rounded-lg px-4 py-2 cursor-pointer"
                    onClick={onDelete}
                    type={"button"}
                >
                    Delete
                </button>
                <button
                    className="flex items-center justify-center gap-1 5 textx-xs md:text-sm font-medium text-green-500 whitespace-nowrap bg-green-50 border border-green-100 rounded-lg px-4 py-2 cursor-pointer"
                    onClick={onClose}
                    type={"button"}
                >
                    Cancel
                </button>
            </div>
        </div>
    )
}

export default DeleteAlert;
