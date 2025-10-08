// client/app/reset-password/page.tsx
"use client";
import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { AppLogoIcon } from '@/components/froms/LoginForm';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
export default function ResetPasswordPage() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [token, setToken] = useState('');
    const [tokenError, setTokenError] = useState('');

    const searchParams = useSearchParams();
    const router = useRouter();

    useEffect(() => {
        // Check for token or error in URL parameters
        const tokenFromUrl = searchParams.get('token');
        const errorFromUrl = searchParams.get('error');

        if (errorFromUrl === 'INVALID_TOKEN') {
            setTokenError('Invalid or expired reset token. Please request a new reset link.');
        } else if (tokenFromUrl) {
            setToken(tokenFromUrl);
        } else {
            setTokenError('No reset token found. Please check your email for the correct link.');
        }
    }, [searchParams]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters long');
            setLoading(false);
            return;
        }

        try {
            const response = await fetch('http://localhost:8000/api/auth/reset-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    token,
                    newPassword: password,
                }),
            });

            const data = await response.json();

            if (data.error) {
                setError(data.error);
            } else {
                setMessage('Password has been reset successfully! Redirecting to login...');
                setTimeout(() => {
                    router.push('/login');
                }, 2000);
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (tokenError) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-8">
                    <div className="rounded-md bg-red-50 p-4">
                        <div className="text-sm text-red-700">{tokenError}</div>
                    </div>
                    <div className="text-center">
                        <Link
                            href="/forgot-password"
                            className="font-medium text-blue-600 hover:text-blue-500"
                        >
                            Request a new reset link
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <section className="flex min-h-screen bg-zinc-50 px-4 py-16 md:py-32 dark:bg-transparent">
            <form
                action=""
                onSubmit={handleSubmit}
                className="bg-muted m-auto h-fit w-full max-w-sm overflow-hidden rounded-[calc(var(--radius)+.125rem)] border shadow-md shadow-zinc-950/5 dark:[--color-muted:var(--color-zinc-900)]"
            >
                <div className="bg-card -m-px rounded-[calc(var(--radius)+.125rem)] border p-8 pb-6">
                    <div>
                        <Link href="/" aria-label="go home">
                            <AppLogoIcon className="h-10 fill-current text-black sm:h-12" />
                        </Link>
                        <h1 className="mb-1 mt-4 text-xl font-semibold">
                            Recover Password
                        </h1>
                        <p className="text-sm">Enter your email to receive a reset link</p>
                    </div>

                    <div className="mt-6 space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="block text-sm">
                                New Password
                            </Label>
                            <Input
                                type="password"
                                required
                                name="password"
                                id="password"
                                placeholder=""
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email" className="block text-sm">
                                Confirm New Password
                            </Label>
                            <Input
                                type="password"
                                required
                                name="confirmPassword"
                                id="confirmPassword"
                                placeholder=""
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </div>

                        <Button className="w-full">Save Password </Button>
                    </div>

                    <div className="mt-6 text-center">
                        <p className="text-muted-foreground text-sm">
                            We'll send you a link to reset your password.
                        </p>
                    </div>
                </div>

                <div className="p-3">
                    <p className="text-accent-foreground text-center text-sm">
                        Remembered your password?
                        <Button asChild variant="link" className="px-2">
                            <Link href="/preview/login/two">Log in</Link>
                        </Button>
                    </p>
                </div>
            </form>
        </section>
    );
}