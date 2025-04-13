import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import InfoBox from '../../components/InfoBox';
import moment from 'moment';
import AvatarGroup from '../../components/AvatarGroup';
import TodoCheckList from '../../components/Inputs/TodoCheckList';
import Attachment from '../../components/Attachment';

const ViewTaskDetails = () => {
  const { id } = useParams();
  const [task, setTask] = useState(null);

  const getStatusTagColor = (status) => {
    switch (status) {
      case "In Progress":
        return "text-cyan-500 bg-cyan-50 border border-cyan-500/10";
        break;

      case "Completed":
        return "text-lime-500 bg-lime-50 border border-lime-500/10";
        break;

      default:
        return "text-violet-500 bg-violet-50 border border-violet-500/10";
        break;
    }
  };

  // Get task info by ID
  const getTaskDetailsByID = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.TASKS.GET_TASK_BY_ID(id));

      if (response.data) {
        const taskInfo = response.data;
        setTask(taskInfo);
      }
    } catch (error) {
      console.error("Error fetching data!", error);
    }
  };

  // Handle todo Check
  const updateTodoCheckList = async () => { };

  // Handle attachments link click
  const handleLinkClick = (link) => {
    if(!/^https?:\/\//i.test(link)) {
      link = "https://" + link; // Default to https
    }
    window.open(link, "_blank");
  };

  useEffect(() => {
    if (id) {
      getTaskDetailsByID();

      return () => { };
    }
  }, [id]);

  return (
    <DashboardLayout activeMenu={"My Tasks"}>
      <div className="mt-5">
        {task && (
          <div className="grid grid-cols-1 md:grid-cols-4 mt-4">
            <div className="form-card col-span-3">
              <div className="flex items-center justify-between">
                <p className="text-sm md:text-xl font-medium">{task?.title}</p>
                <div className={`text-[13px] font-medium ${getStatusTagColor(task?.status)} px-4 py-0.5 rounded`}
                >
                  {task?.status}
                </div>
              </div>

              <div className="mt-4">
                <InfoBox
                  label={"Description"}
                  value={task?.description}
                />
              </div>

              <div className="grid grid-cols-12 gap-4 mt-4">
                <div className="col-span-6 md:col-span-4">
                  <InfoBox
                    label={"Priority"}
                    value={task?.priority}
                  />
                </div>

                <div className="col-span-6 md:col-span-4">
                  <InfoBox
                    label={"Due Date"}
                    value={task?.dueDate
                      ? moment(task?.dueDate).format("Do MMM YYYY")
                      : "N/A"
                    }
                  />
                </div>

                <div className="col-span-6 md:col-span-4">
                  <label className="text-xs font-medium text-slate-500">Assigned To</label>

                  <AvatarGroup
                    avatars={task?.assignedTo?.map((item) => item?.profileImgUrl) || []}
                    maxVisible={5}
                  />
                </div>
              </div>

              <div className="mt-2">
                <label className="text-xs font-medium text-slate-500">Todo Check List</label>

                {task?.todoCheckList?.map((item, index) => (
                  <TodoCheckList
                    key={`todo_${index}`}
                    text={item.text}
                    isChecked={item?.completed}
                    onChange={() => updateTodoCheckList(index)}
                  />
                ))}
              </div>

              {task?.attachments?.length > 0 && (
                <div className="mt-2">
                  <label className="text-xs font-medium text-slate-500">Attachments</label>

                  {task?.attachments?.map((link, index) => (
                    <Attachment 
                      key={`link_${index}`}
                      link={link}
                      index={index}
                      onClick={() => handleLinkClick(link)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

export default ViewTaskDetails;
