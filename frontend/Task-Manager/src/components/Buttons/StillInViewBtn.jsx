import React from 'react'

const StillInViewBtn = ({ children, onClick }) => {
    return (
        <button
            className="stillInView-btn"
            onClick={onClick}
        >
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            {children}
        </button>
    )
}

export default StillInViewBtn
