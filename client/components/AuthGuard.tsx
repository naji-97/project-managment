'use client';
import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useGetAuthUserQuery } from '@/state/api';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
    const { data: currentUser, isLoading, error } = useGetAuthUserQuery({});
    const router = useRouter();
    const pathname = usePathname();

    const publicRoutes = ['/login', '/register', '/forgot-password', '/reset-password'];
    const isPublicRoute = publicRoutes.includes(pathname);

    useEffect(() => {
        if (!isLoading) {
            // If no user and trying to access protected route, redirect to login
            if (!currentUser?.user && !isPublicRoute) {
                console.log('🛡️ AuthGuard: Redirecting to login');
                router.push('/login');
            }

            // If user exists and trying to access auth pages, redirect to home
            if (currentUser?.user && isPublicRoute) {
                console.log('🛡️ AuthGuard: Redirecting to home');
                router.push('/');
            }
        }
    }, [currentUser, isLoading, isPublicRoute, pathname, router]);

    if (isLoading) return <div>Loading...</div>;
    if (!currentUser?.user && !isPublicRoute) return <div>Redirecting...</div>;

    return <>{children}</>;
}