"use client";
import React from "react";
import { Menu, Moon, Search, Settings, Sun, User } from "lucide-react";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/app/redux";
import { setIsDarkMode, setIsSidebarCollapsed } from "@/state";
import { useGetAuthUserQuery } from "@/state/api";
import { signOut } from "aws-amplify/auth";
import Image from "next/image";
import { Button } from "../ui/button";
import { authAPI } from "@/lib/auth";
import { redirect, useRouter } from "next/navigation";

const Navbar = () => {
    const dispatch = useAppDispatch();
    const isSidebarCollapsed = useAppSelector(
        (state) => state.global.isSidebarCollapsed,
    );
    const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
    const router = useRouter();

    const { data: currentUser } = useGetAuthUserQuery({});
    const handleSignOut = async () => {
        try {
             await authAPI.signOut();
             console.log("signed out successfully");
            window.location.href = '/login';
        } catch (error) {
            console.error("Error signing out: ", error);
        }
    };

    if (!currentUser) return null;
    const currentUserDetails = currentUser?.userDetails;
console.log('currentUserDetails in Navbar', currentUser);

    return (
        <div className="flex items-center justify-between bg-white px-4 py-3 dark:bg-black">
            {/* Search Bar */}
            <div className="flex items-center gap-8">
                {!isSidebarCollapsed ? null : (
                    <Button
                        variant="secondary"
                    title="Toggle sidebar"
                        className="cursor-pointer rounded  hover:bg-gray-200 dark:hover:bg-gray-700"
                        onClick={() => dispatch(setIsSidebarCollapsed(!isSidebarCollapsed))}
                    >
                        <Menu className="h-8 w-8 dark:text-white" />
                    </Button>
                 )} 
                <div className="relative flex h-min w-[200px]">
                    <Search className="absolute left-[4px] top-1/2 mr-2 h-5 w-5 -translate-y-1/2 transform cursor-pointer dark:text-white" />
                    <input
                        className="w-full rounded border-none bg-gray-100 p-2 pl-8 placeholder-gray-500 focus:border-transparent focus:outline-none dark:bg-gray-700 dark:text-white dark:placeholder-white"
                        type="search"
                        placeholder="Search..."
                    />
                </div>
            </div>

            {/* Icons */}
            <div className="flex items-center">
                <Button
                    variant="secondary"
                    onClick={() => dispatch(setIsDarkMode(!isDarkMode))}
                    className={
                        isDarkMode
                            ? `rounded p-2 dark:hover:bg-gray-700`
                            : `rounded p-2 hover:bg-gray-200`
                    }
                >
                    {isDarkMode ? (
                        <Sun className="h-6 w-6 cursor-pointer  dark:text-white" />
                    ) : (
                        <Moon className="h-6 w-6 cursor-pointer dark:text-white" />
                    )}
                </Button>
                <Link
                    href="/settings"
                    className={
                        isDarkMode
                            ? `h-min w-min rounded p-2 dark:hover:bg-gray-700`
                            : `h-min w-min rounded p-2 hover:bg-gray-200`
                    }
                >
                    <Settings className="h-5 w-5 cursor-pointer dark:text-white" />
                </Link>
                <div className="ml-2 mr-5 hidden min-h-[2em] w-[0.1rem] bg-gray-200 md:inline-block"></div>
                <div className="hidden items-center justify-between md:flex">
                    <div className="align-center flex h-9 w-9 justify-center">
                        {!!currentUserDetails?.profilePictureUrl ? (
                            <Image
                                src={`https://pm-s3-iamges.s3.us-east-1.amazonaws.com/${currentUserDetails?.profilePictureUrl}`}
                                alt={currentUserDetails?.username || "User Profile Picture"}
                                width={100}
                                height={50}
                                className="h-full rounded-full object-cover"
                            />
                        ) : (
                            <User className="h-6 w-6 cursor-pointer self-center rounded-full dark:text-white" />
                        )}
                    </div>
                    <span className="mx-3 text-gray-800 dark:text-white">
                        {currentUser?.user?.username}
                    </span>
                    <button
                        className="hidden rounded bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-600/80 cursor-pointer md:block"
                        onClick={handleSignOut}
                    >
                        Sign out
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Navbar;