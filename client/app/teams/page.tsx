"use client";
import { useGetTeamsQuery } from "@/state/api";
import React from "react";
import { useAppSelector } from "../redux";
import Header from "@/components/header/Header";
import {
    DataGrid,
    GridColDef,
} from "@mui/x-data-grid";
import { dataGridClassNames, dataGridSxStyles } from "@/lib/utils";
import GridLoader from "react-spinners/GridLoader";






const columns: GridColDef[] = [
    { field: "id", headerName: "Team ID", width: 100 },
    { field: "teamName", headerName: "Team Name", width: 200 },
    { field: "productOwnerUsername", headerName: "Product Owner", width: 200 },
    {
        field: "projectManagerUsername",
        headerName: "Project Manager",
        width: 200,
    },
];

const Teams = () => {
    const { data: teams, isLoading, isError } = useGetTeamsQuery();
    const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

    if (isLoading) return <div className="flex items-center justify-center h-full"><GridLoader speedMultiplier={0.7} color="#b2ced9" size={30} /></div>;
    if (isError || !teams) return <div>Error fetching teams</div>;

    return (
        <div className="flex w-full flex-col p-8">
            <Header name="Teams" />
            <div className="h-[650px] w-full" >
                <DataGrid
                    rows={teams || []}
                    columns={columns}
                    pagination
                    showToolbar
                    className={dataGridClassNames}
                    sx={dataGridSxStyles(isDarkMode)}
                    slotProps={{
                        toolbar: {
                            sx: {
                                backgroundColor: isDarkMode ? "#07bc0c" : "#f1c40f",
                                color: isDarkMode ? "#1976d2" : "#c62828",
                                padding: "0.5rem 1rem",
                                "& .MuiButton-root": {
                                    color: isDarkMode ? "#d1d5db" : "#111827",
                                },
                                "& .MuiSvgIcon-root": {
                                    color: isDarkMode ? "#d1d5db" : "#111827",
                                },
                            },
                        },
                    }}
                />
            </div>
        </div>
    );
};

export default Teams;