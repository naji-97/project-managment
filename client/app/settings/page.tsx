"use client";

import { useState, useEffect } from "react";
import { useGetAuthUserQuery, useUpdateUserMutation } from "@/state/api";
import { useAuth } from "@/app/AuthProvider";
import Header from "@/components/header/Header";

export default function SettingsPage() {
    const { data: authData, isLoading: authLoading } = useGetAuthUserQuery({});
    const [updateUser, { isLoading: updating }] = useUpdateUserMutation();


    const [formData, setFormData] = useState({
        username: "",
        email: "",
        firstName: "",
        lastName: "",
        profilePictureUrl: ""
    });

    const [message, setMessage] = useState({ type: "", text: "" });

    // Populate form with current user data
    useEffect(() => {
        if (authData?.userDetails) {
            const user = authData.userDetails;
            // Split the stored name into first and last names
            const nameParts = user.name?.split(' ') || ['', ''];
            const firstName = nameParts[0] || '';
            const lastName = nameParts.slice(1).join(' ') || '';
            setFormData({
                username: user.username || "",
                email: user.email || "",
                firstName: firstName,
                lastName: lastName,
                profilePictureUrl: user.profilePictureUrl || ""
            });
        }
    }, [authData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage({ type: "", text: "" });
        const fullName=`${formData.firstName} ${formData.lastName}`

        try {
            const result = await updateUser({
                id: authData?.userSub || "",
                username: formData.username,
                email: formData.email,
                name: fullName,
                profilePictureUrl: formData.profilePictureUrl
            }).unwrap();

            setMessage({
                type: "success",
                text: result.message || "Profile updated successfully!"
            });
        } catch (error: any) {
            setMessage({
                type: "error",
                text: error.data?.message || "Failed to update profile"
            });
        }
    };

    if (authLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-lg">Loading...</div>
            </div>
        );
    }

    const user = authData?.userDetails;

    return (
        <div className="p-8">
            <Header name="Settings" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
                Profile Settings
            </h1>

            {/* Current Profile Display */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
                <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                    Current Profile
                </h2>

                <div className="flex items-center space-x-4 mb-6">
                    <div className="h-20 w-20 rounded-full overflow-hidden bg-gray-200">
                        {user?.profilePictureUrl ? (
                            <img
                                src={user.profilePictureUrl.startsWith('http')
                                    ? user.profilePictureUrl
                                    : `/${user.profilePictureUrl}`}
                                alt={user.username}
                                className="h-full w-full object-cover"
                                onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                    // e.currentTarget.nextSibling?.style.display = 'flex';
                                }}
                            />
                        ) : null}
                        <div
                            className={`h-full w-full flex items-center justify-center bg-gray-300 ${user?.profilePictureUrl ? 'hidden' : 'flex'
                                }`}
                        >
                            <span className="text-2xl font-bold text-gray-600">
                                {user?.username?.charAt(0)?.toUpperCase() || '?'}
                            </span>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                            {user?.name}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400">{user?.username}</p>
                        <p className="text-gray-600 dark:text-gray-400">{user?.email}</p>
                    </div>
                </div>
            </div>

            {/* Update Form */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                    Update Profile
                </h2>

                {message.text && (
                    <div className={`p-4 rounded-md mb-4 ${message.type === "success"
                            ? "bg-green-50 text-green-800 border border-green-200"
                            : "bg-red-50 text-red-800 border border-red-200"
                        }`}>
                        {message.text}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            First Name
                        </label>
                        <input
                            type="text"
                            id="firstName"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                            placeholder="Enter your firstName"
                        />
                    </div>
                    <div>
                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Last Name
                        </label>
                        <input
                            type="text"
                            id="lastName"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                            placeholder="Enter your lastName"
                        />
                    </div>
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Username
                        </label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                            placeholder="Enter your username"
                        />
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                            placeholder="Enter your email"
                        />
                    </div>

                    <div>
                        <label htmlFor="profilePictureUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Profile Picture URL
                        </label>
                        <input
                            type="url"
                            id="profilePictureUrl"
                            name="profilePictureUrl"
                            value={formData.profilePictureUrl}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                            placeholder="Enter profile picture URL"
                        />
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            Enter a direct image URL or leave empty to use default avatar
                        </p>
                    </div>

                    {/* Preview of new profile picture */}
                    {formData.profilePictureUrl && (
                        <div>
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Preview:
                            </p>
                            <div className="h-16 w-16 rounded-full overflow-hidden bg-gray-200">
                                <img
                                    src={formData.profilePictureUrl}
                                    alt="Preview"
                                    className="h-full w-full object-cover"
                                    onError={(e) => {
                                        e.currentTarget.style.display = 'none';
                                        // e.currentTarget.nextSibling?.style.display = 'flex';
                                    }}
                                />
                                <div className="h-full w-full hidden items-center justify-center bg-gray-300">
                                    <span className="text-sm font-bold text-gray-600">Invalid URL</span>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="flex justify-end space-x-4">
                       

                        <button
                            type="submit"
                            disabled={updating}
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {updating ? "Updating..." : "Update Profile"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}