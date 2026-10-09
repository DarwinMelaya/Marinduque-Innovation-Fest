import { Form, Head, Link } from '@inertiajs/react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import {
    authButtonClass,
    authInputClass,
    authLabelClass,
    authLinkClass,
} from '@/lib/auth-styles';
import { login } from '@/routes';
import { dashboard } from '@/routes/admin';
import { store } from '@/routes/admin/register';

type Props = {
    isFirstAdmin: boolean;
};

export default function AdminRegister({ isFirstAdmin }: Props) {
    return (
        <>
            <Head title="Register admin" />

            {isFirstAdmin && (
                <div className="mb-6 rounded-lg border border-[#F7B600]/30 bg-[#F7B600]/10 px-4 py-3 text-sm text-[#F7B600]">
                    No admin exists yet. This account will be the first
                    administrator, and you'll be logged in right after.
                </div>
            )}

            <Form
                {...store.form()}
                resetOnSuccess
                disableWhileProcessing
                className="flex flex-col gap-6"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="grid gap-2">
                            <Label htmlFor="name" className={authLabelClass}>
                                Full name
                            </Label>
                            <Input
                                id="name"
                                type="text"
                                name="name"
                                required
                                autoFocus
                                autoComplete="name"
                                placeholder="Juan Dela Cruz"
                                className={authInputClass}
                            />
                            <InputError message={errors.name} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="email" className={authLabelClass}>
                                Email address
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                name="email"
                                required
                                autoComplete="email"
                                placeholder="you@example.com"
                                className={authInputClass}
                            />
                            <InputError message={errors.email} />
                        </div>

                        <div className="grid gap-2">
                            <Label
                                htmlFor="password"
                                className={authLabelClass}
                            >
                                Password
                            </Label>
                            <PasswordInput
                                id="password"
                                name="password"
                                required
                                autoComplete="new-password"
                                placeholder="Password"
                                className={authInputClass}
                            />
                            <InputError message={errors.password} />
                        </div>

                        <div className="grid gap-2">
                            <Label
                                htmlFor="password_confirmation"
                                className={authLabelClass}
                            >
                                Confirm password
                            </Label>
                            <PasswordInput
                                id="password_confirmation"
                                name="password_confirmation"
                                required
                                autoComplete="new-password"
                                placeholder="Confirm password"
                                className={authInputClass}
                            />
                            <InputError
                                message={errors.password_confirmation}
                            />
                        </div>

                        <Button
                            type="submit"
                            className={authButtonClass}
                            disabled={processing}
                            data-test="admin-register-button"
                        >
                            {processing && <Spinner />}
                            Create admin account
                        </Button>
                    </>
                )}
            </Form>

            <p className="mt-8 text-center text-sm text-white/50">
                {isFirstAdmin ? (
                    <>
                        Already have an account?{' '}
                        <Link href={login()} className={authLinkClass}>
                            Log in
                        </Link>
                    </>
                ) : (
                    <Link href={dashboard()} className={authLinkClass}>
                        Back to dashboard
                    </Link>
                )}
            </p>
        </>
    );
}

AdminRegister.layout = {
    title: 'Register an admin',
    description:
        'Create an account that can manage the Marinduque Innovation Fest.',
};
