import { useAppSelector } from "@/app/redux";
import Header from "@/components/header/Header";
import { dataGridClassNames, dataGridSxStyles } from "@/lib/data-grid-style";
import { useGetTasksQuery } from "@/state/api";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import React from "react";
import GridLoader from "react-spinners/GridLoader";

type Props = {
    id: string;
    setIsModalNewTaskOpen: (isOpen: boolean) => void;
};

const columns: GridColDef[] = [
    {
        field: "title",
        headerName: "Title",
        width: 100,
    },
    {
        field: "description",
        headerName: "Description",
        width: 200,
    },
    {
        field: "status",
        headerName: "Status",
        width: 130,
        renderCell: (params) => {
            let colorClass = "";

            switch (params.value) {
                case "To Do":
                    colorClass = "bg-blue-100 text-blue-800"; // red for "to do"
                    break;
                case "Work In Progress":
                    colorClass = "bg-yellow-100 text-yellow-800"; // yellow for "in progress"
                    break;
                case "Completed":
                    colorClass = "bg-green-100 text-green-800"; // green for "completed"
                    break;
                default:
                    colorClass = "bg-gray-100 text-gray-800"; // fallback
            }

            return (
                <span
                    className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${colorClass}`}
                >
                    {params.value}
                </span>
            );
        }
    },
    {
        field: "priority",
        headerName: "Priority",
        width: 75,
    },
    {
        field: "tags",
        headerName: "Tags",
        width: 130,
    },
    {
        field: "startDate",
        headerName: "Start Date",
        width: 130,
    },
    {
        field: "dueDate",
        headerName: "Due Date",
        width: 130,
    },
    {
        field: "author",
        headerName: "Author",
        width: 150,
        renderCell: (params) => params.value?.author || "Unknown",
    },
    {
        field: "assignee",
        headerName: "Assignee",
        width: 150,
        renderCell: (params) => params.value?.assignee || "Unassigned",
    },
];

const TableView = ({ id, setIsModalNewTaskOpen }: Props) => {
    const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
    const {
        data: tasks,
        error,
        isLoading,
    } = useGetTasksQuery({ projectId: Number(id) });


    if (isLoading) return <div className="flex items-center justify-center h-full"><GridLoader color="#b2ced9" size={20} speedMultiplier={0.7} /></div>;
    if (error) return <div className="flex items-center justify-center h-full text-xl text-red-500">An error occurred while fetching tasks</div>;


    return (
        <div className="h-[540px] w-full px-4 pb-8 xl:px-6">
            <div className="pt-5">
                <Header
                    name="Table"
                    buttonComponent={
                        <button
                            className="flex items-center rounded bg-blue-primary px-3 py-2 text-white hover:bg-blue-600"
                            onClick={() => setIsModalNewTaskOpen(true)}
                        >
                            Add Task
                        </button>
                    }
                    isSmallText
                />
            </div>
            <DataGrid
                rows={tasks || []}
                columns={columns}
                className={dataGridClassNames}
                sx={dataGridSxStyles(isDarkMode)}
            />
        </div>
    );
};

export default TableView;