import Modal from "@/components/projects/Modal";
import { Priority, Status, useCreateTaskMutation, useGetAuthUserQuery, useGetUsersQuery } from "@/state/api";
import React, { useState } from "react";
import { formatISO } from "date-fns";
import { toast } from "react-toastify";

type Props = {
    isOpen: boolean;
    onClose: () => void;
    id?: string | null;
    priorety?: Priority;
};

const ModalNewTask = ({ isOpen, onClose, id = null, priorety }: Props) => {
    const [createTask, { isLoading }] = useCreateTaskMutation();
    const { data: allUsers, isError } = useGetUsersQuery();
    const { data: currentUser } = useGetAuthUserQuery({});
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [status, setStatus] = useState<Status>(Status.ToDo);
    const [priority, setPriority] = useState<Priority>(priorety || Priority.Backlog);
    const [tags, setTags] = useState("");
    const [startDate, setStartDate] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [assignedUserId, setAssignedUserId] = useState("");
    const [projectId, setProjectId] = useState("");
    console.log("this is ", allUsers, currentUser);
    const authorUserId= currentUser?.user.id || "";

    const handleSubmit = async () => {
        console.log("before create new prj", title, authorUserId, id, projectId);
        if (!title || !authorUserId || !(id !== null || projectId)) return;

        const formattedStartDate = formatISO(new Date(startDate), {
            representation: "complete",
        });
        const formattedDueDate = formatISO(new Date(dueDate), {
            representation: "complete",
        });
        console.log('before create new task', title, description, status, priority, tags, formattedStartDate, formattedDueDate, authorUserId, assignedUserId, id, projectId);

      const res =  await createTask({
            title,
            description,
            status,
            priority,
            tags,
            startDate: formattedStartDate,
            dueDate: formattedDueDate,
            authorUserId: authorUserId,
            assignedUserId: assignedUserId || null,
            projectId: id !== null ? Number(id) : Number(projectId),
        });

        if (res.data) {
            toast.success("Task created successfully");
            setTitle("");
            setDescription("");
            setStatus(Status.ToDo);
            setPriority(Priority.Backlog);
            setTags("");
            setStartDate("");
            setDueDate("");
            // setAuthorUserId("");
            setAssignedUserId("");
            setProjectId("");
            onClose();
        }
    };

    const isFormValid = () => {
        return title && description && status && priority && startDate && dueDate &&  authorUserId && (id !== null || projectId);
    };

    const selectStyles =
        "mb-4 block w-full rounded border border-gray-300 px-3 py-2 dark:border-dark-tertiary dark:bg-dark-tertiary dark:text-white dark:focus:outline-none";

    const inputStyles =
        "w-full rounded border border-gray-300 p-2 shadow-sm dark:border-dark-tertiary dark:bg-dark-tertiary dark:text-white dark:focus:outline-none";

    return (
        <Modal isOpen={isOpen} onClose={onClose} name="Create New Task">
            <form
                className="mt-4 space-y-6"
                onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmit();
                }}
            >
                <input
                    type="text"
                    className={inputStyles}
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <textarea
                    className={inputStyles}
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-2">
                    <select
                        className={selectStyles}
                        value={status}
                        title="Select Status"
                        onChange={(e) =>
                            setStatus(Status[e.target.value as keyof typeof Status])
                        }
                    >
                        <option value="">Select Status</option>
                        <option value={Status.ToDo}>To Do</option>
                        <option value={Status.WorkInProgress}>Work In Progress</option>
                        <option value={Status.UnderReview}>Under Review</option>
                        <option value={Status.Completed}>Completed</option>
                    </select>
                    <select
                        title="Select Priority"
                        className={selectStyles}
                        value={priority}
                        onChange={(e) =>
                            setPriority(Priority[e.target.value as keyof typeof Priority])
                        }
                    >
                        <option value="">Select Priority</option>
                        <option value={Priority.Urgent}>Urgent</option>
                        <option value={Priority.High}>High</option>
                        <option value={Priority.Medium}>Medium</option>
                        <option value={Priority.Low}>Low</option>
                        <option value={Priority.Backlog}>Backlog</option>
                    </select>
                </div>
                <input
                    type="text"
                    className={inputStyles}
                    placeholder="Tags (comma separated)"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                />

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-2">
                    <input
                    title="Start Date"
                        type="date"
                        className={inputStyles}
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                    />
                    <input
                        type="date"
                        title="Due Date"
                        className={inputStyles}
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                    />
                </div>
                <div className="rounded-md bg-gray-50 p-3 dark:bg-gray-700">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Author: <span className="font-semibold">{currentUser?.user?.name || currentUser?.user?.email}</span>
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                        (You are the author of this task)
                    </p>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Assign to (optional)
                    </label>
                    <select
                        title="Select team member to assign"
                        className={selectStyles}
                        value={assignedUserId}
                        onChange={(e) => setAssignedUserId(e.target.value)}
                    >
                        <option value="">Select team member to assign</option>
                        {allUsers?.map((user) => (
                            <option key={user.id} value={user.id}>
                                {user.name} ({user.email})
                            </option>
                        ))}
                    </select>
                </div>

                <input
                    type="text"
                    className={inputStyles}
                    placeholder="Assigned User ID"
                    value={assignedUserId}
                    onChange={(e) => setAssignedUserId(e.target.value)}
                />
                {id === null && (
                    <input
                        type="text"
                        className={inputStyles}
                        placeholder="ProjectId"
                        value={projectId}
                        onChange={(e) => setProjectId(e.target.value)}
                    />
                )}
                <button
                    type="submit"
                    className={`focus-offset-2 mt-4 flex w-full justify-center rounded-md border border-transparent bg-blue-primary px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600 ${!isFormValid() || isLoading ? "cursor-not-allowed opacity-50" : ""
                        }`}
                    disabled={!isFormValid() || isLoading}
                >
                    {isLoading ? "Creating..." : "Create Task"}
                </button>
            </form>
        </Modal>
    );
};

export default ModalNewTask;