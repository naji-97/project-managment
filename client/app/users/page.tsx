"use client";
import { useGetUsersQuery } from "@/state/api";
import React from "react";
import { useAppSelector } from "../redux";
import Header from "@/components/header/Header";
import {
    DataGrid,
    GridColDef,
} from "@mui/x-data-grid";


import Image from "next/image";
import { dataGridClassNames, dataGridSxStyles } from "@/lib/utils";
import GridLoader from "react-spinners/GridLoader";



const columns: GridColDef[] = [
    { field: "userId", headerName: "ID", width: 100 },
    { field: "username", headerName: "Username", width: 150 },
    {
        field: "profilePictureUrl",
        headerName: "Profile Picture",
        width: 100,
        renderCell: (params) => (
            <div className="flex h-full w-full items-center justify-center">
                <div className="h-9 w-9">
                    <Image
                        src={`/${params.value}`}
                        alt={params.row.username}
                        width={100}
                        height={50}
                        className="h-full rounded-full object-cover"
                    />
                </div>
            </div>
        ),
    },
];

const Users = () => {
    const { data: users, isLoading, isError } = useGetUsersQuery();
    const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

    if (isLoading) return <div className="flex items-center justify-center h-full"><GridLoader speedMultiplier={0.7} color="#b2ced9" size={30} /></div>
    if (isError || !users) return <div className="flex items-center justify-center h-full text-red-600 text-2xl">Error fetching users</div>;

    return (
        <div className="flex w-full flex-col p-8">
            <Header name="Users" />
            <div className="h-[650px] w-full">
                <DataGrid
                    rows={users || []}
                    columns={columns}
                    getRowId={(row) => row.userId}
                    pagination
                   showToolbar
                    className={dataGridClassNames}
                    sx={dataGridSxStyles(isDarkMode)}
                />
            </div>
        </div>
    );
};

export default Users;