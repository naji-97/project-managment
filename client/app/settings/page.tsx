"use client";
import Header from "@/components/header/Header";
import { Button } from "@/components/ui/button";
import { useGetAuthUserQuery, useUpdateUserMutation } from "@/state/api";
import React, { useEffect, useState } from "react";
import GridLoader from "react-spinners/GridLoader";
import { toast } from "react-toastify";

const Settings = () => {
    // All Hooks must be called unconditionally at the top level
    const { data: currentUser, isLoading, error } = useGetAuthUserQuery({});
    const [userName, setUserName] = useState(""); // Initialize with an empty string
    const [userEmail, setUserEmail] = useState(""); // Initialize with an empty string
    const [userTeam, setUserTeam] = useState(""); // Initialize with an empty string
    const [inputFocused, setInputFocused] = useState(false);
    const [updateUser, { isLoading: isUpdating, isError: isUpdatingError, isSuccess: isUpdatingSuccess }] = useUpdateUserMutation();

    // Use a useEffect hook to set state after data is loaded
    useEffect(() => {
        if (currentUser) {
            setUserName(currentUser.userDetails.username || "");
            setUserEmail(currentUser.userDetails.email || "");
            setUserTeam(currentUser.userDetails.team?.teamName || "");
        }
        console.log('currentUser in Settings', currentUser);
        
    }, [currentUser]); // Run this effect when currentUser changes
    if (!currentUser) return null;
    // Conditional return should come after all hooks
   

    const handleUpdate = async () => {
        try {
            const cognitoId = currentUser.userDetails?.cognitoId;
            if (!cognitoId) throw new Error("User Cognito ID is missing");
            await updateUser({
                cognitoId,
                username: userName,
                email: userEmail,
                teamId: currentUser.userDetails.team?.teamId  
            }).unwrap();
            toast.success("User updated successfully");
            setInputFocused(false);
            // Optionally, show a success message or perform additional actions
        } catch (error) {
            console.error("Error updating user:", error);
        }
    };

        if (isLoading || !currentUser) return <div className="flex items-center justify-center h-full"><GridLoader speedMultiplier={0.7} color="#b2ced9" size={20}/></div>;
        if (error) return <div className="flex items-center justify-center h-full text-xl text-red-500">An error occurred while fetching tasks</div>;
    

    const labelStyles = "block text-sm font-medium dark:text-white";
    const textStyles = "mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 dark:text-white";

    return (
        <div className="p-8">
            <Header name="Settings" />
            <div className="space-y-4">
                {/* Your form JSX here */}
                <div>
                    <label className={labelStyles}>Username</label>
                    <input
                        onFocus={() => setInputFocused(true)}
                        value={userName}
                        type="text"
                        placeholder="Username"
                        onChange={(e) => setUserName(e.target.value)}
                        className={textStyles}
                    />
                </div>
                <div>
                    <label className={labelStyles}>Email</label>
                    <input
                        onFocus={() => setInputFocused(true)}
                        // onBlur={() => setInputFocused(false)}
                        value={userEmail}
                        type="email"
                        placeholder="Email"
                        onChange={(e) => setUserEmail(e.target.value)}
                        className={textStyles}
                    />
                </div>
                <div>
                    <label className={labelStyles}>Team</label>
                    <div className={textStyles}>{userTeam}</div>
                </div>
                <div>
                    <label className={labelStyles}>Role</label>
                    <div className={textStyles}>Developer</div>
                </div>
                {
                    inputFocused && (
                        <div className={`flex justify-end transition-all duration-500 ${inputFocused ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
                            <Button
                                onClick={handleUpdate}
                                disabled={isLoading}
                                className="rounded bg-blue-500 px-4 py-2 cursor-pointer font-bold text-white hover:bg-blue-700 disabled:opacity-50"
                            >
                                {isUpdating ? "Updating..." : "Update "}
                            </Button>
                            <Button  className="cursor-pointer ml-2 bg-[#e54848] text-white hover:bg-amber-600" onClick={() => setInputFocused(false)}>Cancel</Button>
                        </div>
                    )
                }
            </div>
        </div>
    );
};

export default Settings;
