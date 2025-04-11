import React, { useState } from 'react'
import { HiOutlineTrash, HiPlus } from 'react-icons/hi';

const TodoListInput = ({ todoList, setTodoList }) => {
    const [option, setOption] = useState("");

    // Function to handle adding an option
    const handleAddOption = () => {
        if (option.trim()) {
            setTodoList([...todoList, option.trim()]);
            setOption("");
        }
    };

    // Function to handle delete an option
    const handleDeleteOption = (index) => {
        const updateArr = todoList.filter((_, idx) => idx !== index);
        setTodoList(updateArr);
    };

    return (
        <div>
            {todoList.map((item, index) => (
                <div
                    className="flex justify-between bg-gray-50 border border-gray-100 px-3 py-2 rounded-md mb-3 mt-2"
                    key={item}
                >
                    <p className="text-xs text-black">
                        <span className="text-xs text-gray-400 font-semibold">
                            {index < 9 ? `0${index + 1}` : index + 1}{" "}
                        </span>
                        {item}
                    </p>

                    <button 
                        className="cursor-pointer "
                        onClick={() => {
                            handleDeleteOption(index);
                        }}    
                    >
                        <HiOutlineTrash className="text-lg text-red-500" />
                    </button>
                </div>
            ))}

            <div className="flex items-center gap-4 mt-4">
                <input 
                    className="w-full text-[13px] text-black outline-none bg-white border border-gray-100 px-3 py-2 rounded-md"
                    type="text"
                    placeholder="Enter Task"
                    value={option}
                    onChange={({ target }) => setOption(target.value)}
                />

                <button
                    className="card-btn text-nowrap"
                    onClick={handleAddOption}
                >
                    <HiPlus className="text-lg" /> Add
                </button>
            </div>
        </div>
    )
}

export default TodoListInput
