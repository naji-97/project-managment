"use client";

import React, { useEffect } from 'react';
import { Amplify } from 'aws-amplify';

import { Authenticator, Heading, useAuthenticator, View } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { usePathname, useRouter } from 'next/navigation';
import axios from 'axios';

Amplify.configure({
    Auth: {
        Cognito: {

            userPoolId: process.env.NEXT_PUBLIC_AWS_COGNITO_USER_POOL_ID! || "",
            userPoolClientId: process.env.NEXT_PUBLIC_AWS_COGNITO_USER_POOL_CLIENT_ID! || "",

        },
    },
});

const components = {
    Header() {
        return (
            <View textAlign="center" padding="1.5rem">
                <Heading level={3} className='mt-4 mb-7'>Project Management Dashboard</Heading>
                <p className='text-muted-foreground mt-2'>Welcome! <span>Sign in to continue</span> </p>
            </View>
        );
    },
    SignIn: {
        Footer() {
            const { toSignUp } = useAuthenticator();
            return (
                <View className="text-center mt-4">
                    <p className="text-muted-foreground">
                        Don&apos;t have an account?{" "}
                        <button
                            onClick={toSignUp}
                            className="text-primary hover:underline hover:text-indigo-600 bg-transparent border-none p-0 cursor-pointer"
                        >
                            Sign up here
                        </button>
                    </p>
                </View>
            );
        },
    },
    SignUp: {

        Footer() {
            const { toSignIn } = useAuthenticator();
            return (
                <View className="text-center mt-4">
                    <p className="text-muted-foreground">
                        Already have an account?{" "}
                        <button
                            onClick={toSignIn}
                            className="text-primary hover:underline bg-transparent border-none p-0"
                        >
                            Sign in
                        </button>
                    </p>
                </View>
            );
        },
    },
}




const formFields = {
    signIn: {
        username: {
            placeholder: "Enter your email",
            label: "Email",
            isRequired: true,
            type: "email",
        },
        password: {
            placeholder: "Enter your password",
            label: "Password",
            isRequired: true,
        },
    },
    signUp: {
        username: {
            order: 1,
            placeholder: "Choose a username",
            label: "Username",
            isRequired: true,
        },
        email: {
            order: 2,
            placeholder: "Enter your email address",
            label: "Email",
            isRequired: true,
        },
        password: {
            order: 3,
            placeholder: "Create a password",
            label: "Password",
            isRequired: true,
        },
        confirm_password: {
            order: 4,
            placeholder: "Confirm your password",
            label: "Confirm Password",
            isRequired: true,
        },
    },
};
export default function Auth({ children }: { children: React.ReactNode }) {
    const { user } = useAuthenticator((context) => [context.user]);

    const router = useRouter();
    const pathname = usePathname();
    const isAuthPage = pathname.match(/^\/(signin|signup)$/);



    useEffect(() => {
        if (user ) {
            const register = async () => {
                try {
                    await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users`, {
                        username: user.username,
                        cognitoId: user.userId,
                        email: user.signInDetails?.loginId
                    }

                    )
                } catch (error) {
                    console.error("Error registering user: ", error);
                }
            }
            register();
            if (isAuthPage) {

                router.push("/dashboard");
            }
            
        }
    }, [user, isAuthPage, router]);
    // Allow access to public pages without authentication

    return (
        <div className='h-full '>
            <Authenticator
                components={components}
                formFields={formFields}
                initialState={pathname.includes("signup") ? "signUp" : "signIn"}

            >

                {() => <>{children} </>}
            </Authenticator>
        </div>
    );
}