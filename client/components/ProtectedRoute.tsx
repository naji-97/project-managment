// client/components/ProtectedRoute.tsx
'use client';
import { useEffect } from 'react';
import { useAuth } from '@/app/AuthProvider';
import { useRouter } from 'next/navigation';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            // Redirect to login if not authenticated
            router.push('/login');
        }
    }, [user, loading, router]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-lg">Loading...</div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-lg">Redirecting to login...</div>
            </div>
        );
    }

    return <>{children}</>;
}