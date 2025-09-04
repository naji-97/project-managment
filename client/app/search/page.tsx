"use client";

import Header from "@/components/header/Header";
import ProjectCard from "@/components/ProjectCard";
import TaskCard from "@/components/TaskCard";
import UserCard from "@/components/UserCard";
import { useSearchQuery } from "@/state/api";
import { debounce } from "lodash";
import React, { useEffect, useState } from "react";
import PulseLoader from "react-spinners/PulseLoader";

const Search = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const {
        data: searchResults,
        isLoading,
        isError,
    } = useSearchQuery(searchTerm, {
        skip: searchTerm.length < 3,
    });

    const handleSearch = debounce(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            setSearchTerm(event.target.value);
        },
        500,
    );

    useEffect(() => {
        return handleSearch.cancel;
    }, [handleSearch.cancel]);

    return (
        <div className="p-8">
            <Header name="Search" />
            <div>
                <input
                    type="text"
                    placeholder="Search..."
                    className="w-1/2 rounded border p-3 shadow"
                    onChange={handleSearch} 
                />
            </div>
            <div className="p-5 h-full">
                {isLoading && <div className="flex items-center justify-center h-full"><PulseLoader
                    color="#477b83"
                    margin={14}
                    size={20}
                    speedMultiplier={0.8}
                /></div>}
                {isError && <div className="flex items-center justify-center h-full text-xl text-red-500">An error occurred while fetching tasks</div>}
                                 
                {!isLoading && !isError && searchResults && (
                    
                    <div>
                        <div className="p-5">
                            
                            {!isLoading && !isError && searchResults?.tasks?.length || searchResults?.projects?.length || searchResults?.users?.length === 0 && <div className="flex items-center justify-center h-full text-xl text-red-500">No results found</div>}

                            {!isLoading && !isError && searchResults && (
                                <div>
                                    {searchResults.tasks && searchResults.tasks?.length > 0 && (
                                        <h2>Tasks</h2>
                                    )}
                                    {searchResults.tasks?.map((task) => (
                                        <TaskCard key={task.id} task={task} />
                                    ))}

                                    {searchResults.projects && searchResults.projects?.length > 0 && (
                                        <h2>Projects</h2>
                                    )}
                                    {searchResults.projects?.map((project) => (
                                        <ProjectCard key={project.id} project={project} />
                                    ))}

                                    {searchResults.users && searchResults.users?.length > 0 && (
                                        <h2>Users</h2>
                                    )}
                                    {searchResults.users?.map((user) => (
                                        <UserCard key={user.userId} user={user} />
                                    ))}

                                </div>
                            )}
                        </div>
                        {searchResults.tasks && searchResults.tasks?.length > 0 && (
                            <h2>Tasks</h2>
                        )}
                        {searchResults.tasks?.map((task) => (
                            <TaskCard key={task.id} task={task} />
                        ))}

                        {searchResults.projects && searchResults.projects?.length > 0 && (
                            <h2>Projects</h2>
                        )}
                        {searchResults.projects?.map((project) => (
                            <ProjectCard key={project.id} project={project} />
                        ))}

                        {searchResults.users && searchResults.users?.length > 0 && (
                            <h2>Users</h2>
                        )}
                        {searchResults.users?.map((user) => (
                            <UserCard key={user.userId} user={user} />
                        ))}

                    </div>
                )}
            </div>
        </div>
    );
};

export default Search;