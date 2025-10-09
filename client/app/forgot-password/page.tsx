// client/app/forgot-password/page.tsx
"use client";
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { AppLogoIcon } from '@/components/froms/LoginForm';
import { toast } from 'react-toastify';
export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
 
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        setError('');

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/request-password-reset`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/reset-password`
                }),
            });

            const data = await response.json();

            if (data.error) {
                setError(data.error);
                toast.error(error);
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
        } 
    };

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
                                Email
                            </Label>
                            <Input
                                type="email"
                                required
                                name="email"
                                id="email"
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <Button className="w-full">Send Reset Link</Button>
                    </div>

                    <div className="mt-6 text-center">
                        <p className="text-muted-foreground text-sm">
                            We&apos;ll send you a link to reset your password.
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


