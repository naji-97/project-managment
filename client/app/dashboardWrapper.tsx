"use client";

import React, { useEffect } from "react";
import Navbar from "@/components/navbar/Navbar";
import Sidebar from "@/components/sidebar/Sidebar";
import StoreProvider, { useAppSelector } from "./redux";
import { ToastContainer } from 'react-toastify';
import { Toaster } from "@/components/ui/sonner"
import 'react-toastify/dist/ReactToastify.css';
import {AuthProvider} from "./AuthProvider";
import { useGetAuthUserQuery } from "@/state/api";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
    const isSidebarCollapsed =useAppSelector(
        (state) => state.global.isSidebarCollapsed,
        
    );
    const isDarkMode =  useAppSelector((state) => state.global.isDarkMode);
    const { data: currentUser} = useGetAuthUserQuery({});
    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    }, [isDarkMode]);

    return (
        <div className="flex min-h-screen w-full bg-gray-50 text-gray-900">
            <ToastContainer position="top-center" autoClose={3000} theme={isDarkMode ? "dark" : "light"} />
            <Sidebar />
            <main
                className={`flex w-full flex-col bg-gray-50 dark:bg-dark-bg ${isSidebarCollapsed || !currentUser ? "" : "md:pl-64"
                    }`}
            >
                <Navbar />
                {children}
                <Toaster />
            </main>
        </div>
    );
};

const DashboardWrapper = ({ children }: { children: React.ReactNode }) => {
    return (
        <StoreProvider>
            {/* <Authenticator.Provider> */}
            <AuthProvider>
                <DashboardLayout>{children}</DashboardLayout>
            </AuthProvider>
            {/* </Authenticator.Provider> */}
        </StoreProvider>
    );
};

export default DashboardWrapper;