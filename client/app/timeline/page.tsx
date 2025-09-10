"use client";

import { useAppSelector } from "@/app/redux";
import Header from "@/components/header/Header";
import { useGetProjectsQuery } from "@/state/api";
import { DisplayOption, Gantt, ViewMode } from "@rsagiev/gantt-task-react-19";
import "@rsagiev/gantt-task-react-19/dist/index.css";
import React, { useMemo, useState } from "react";
import GridLoader from "react-spinners/GridLoader";

type TaskTypeItems = "task" | "milestone" | "project";

const Timeline = () => {
    const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
    const { data: projects, isLoading, isError } = useGetProjectsQuery();

    const [displayOptions, setDisplayOptions] = useState<DisplayOption>({
        viewMode: ViewMode.Month,
        locale: "en-US",
    });

    const ganttTasks = useMemo(() => {
        return (
            projects?.map((project) => ({
                start: new Date(project.startDate as string),
                end: new Date(project.endDate as string),
                name: project.name,
                id: `Project-${project.id}`,
                type: "project" as TaskTypeItems,
                progress: 50,
                isDisabled: false,
            })) || []
        );
    }, [projects]);

    const handleViewModeChange = (
        event: React.ChangeEvent<HTMLSelectElement>,
    ) => {
        setDisplayOptions((prev) => ({
            ...prev,
            viewMode: event.target.value as ViewMode,
        }));
    };

    if (isLoading) return <div className="flex items-center justify-center h-full"><GridLoader speedMultiplier={0.7} color="#b2ced9" size={20} /></div>;
    if (isError ) return <div className="flex items-center justify-center h-full text-xl text-red-500">An error occurred while fetching tasks</div>;


    return (
        <div className="max-w-full p-8">
            <header className="mb-4 flex items-center justify-between">
                <Header name="Projects Timeline" />
                <div className="relative inline-block w-64">
                    <select
                        className="focus:shadow-outline block w-full appearance-none rounded border border-gray-400 bg-white px-4 py-2 pr-8 leading-tight shadow hover:border-gray-500 focus:outline-none dark:border-dark-secondary dark:bg-dark-secondary dark:text-white"
                        value={displayOptions.viewMode}
                        onChange={handleViewModeChange}
                        title="Select view mode"
                    >
                        <option value={ViewMode.Day}>Day</option>
                        <option value={ViewMode.Week}>Week</option>
                        <option value={ViewMode.Month}>Month</option>
                    </select>
                </div>
            </header>

            <div className="overflow-hidden rounded-md bg-white shadow dark:bg-dark-secondary dark:text-white">
                <div className="timeline">
                    <Gantt
                        tasks={ganttTasks}
                        {...displayOptions}
                        columnWidth={displayOptions.viewMode === ViewMode.Month ? 150 : 100}
                        listCellWidth="100px"
                        projectBackgroundColor={isDarkMode ? "#101214" : "#1f2937"}
                        projectProgressColor={isDarkMode ? "#1f2937" : "#aeb8c2"}
                        projectProgressSelectedColor={isDarkMode ? "#000" : "#9ba1a6"}
                    />
                </div>
            </div>
        </div>
    );
};

export default Timeline;