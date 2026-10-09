import { Form, Head, Link } from "@inertiajs/react";
import InputError from "@/components/input-error";
import PasswordInput from "@/components/password-input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import {
    authButtonClass,
    authInputClass,
    authLabelClass,
    authLinkClass,
} from "@/lib/auth-styles";
import { register } from "@/routes/admin";
import { store } from "@/routes/login";
import { request } from "@/routes/password";

type Props = {
    status?: string;
    canResetPassword: boolean;
    canRegisterFirstAdmin: boolean;
};

export default function Login({
    status,
    canResetPassword,
    canRegisterFirstAdmin,
}: Props) {
    return (
        <>
            <Head title="Log in" />

            {status && (
                <div className="mb-6 rounded-lg border border-[#229D1C]/30 bg-[#229D1C]/10 px-4 py-3 text-sm font-medium text-[#6FD66A]">
                    {status}
                </div>
            )}

            <Form
                {...store.form()}
                resetOnSuccess={["password"]}
                className="flex flex-col gap-6"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="grid gap-2">
                            <Label htmlFor="email" className={authLabelClass}>
                                Email or booth name
                            </Label>
                            <Input
                                id="email"
                                type="text"
                                name="email"
                                required
                                autoFocus
                                tabIndex={1}
                                autoComplete="username"
                                placeholder="you@example.com or your booth name"
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
                                tabIndex={2}
                                autoComplete="current-password"
                                placeholder="Password"
                                className={authInputClass}
                            />
                            <InputError message={errors.password} />
                        </div>

                        <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <Checkbox
                                    id="remember"
                                    name="remember"
                                    tabIndex={3}
                                />
                                <Label
                                    htmlFor="remember"
                                    className="text-sm font-normal text-white/70"
                                >
                                    Remember me
                                </Label>
                            </div>
                            {canResetPassword && (
                                <Link
                                    href={request()}
                                    className="text-sm text-white/70 hover:text-white"
                                    tabIndex={5}
                                >
                                    Forgot password?
                                </Link>
                            )}
                        </div>

                        <Button
                            type="submit"
                            className={authButtonClass}
                            tabIndex={4}
                            disabled={processing}
                            data-test="login-button"
                        >
                            {processing && <Spinner />}
                            Log in
                        </Button>
                    </>
                )}
            </Form>

            {canRegisterFirstAdmin && (
                <p className="mt-8 text-center text-sm text-white/50">
                    No admin account yet?{" "}
                    <Link href={register()} className={authLinkClass}>
                        Create the first admin
                    </Link>
                </p>
            )}
        </>
    );
}

Login.layout = {
    title: "Welcome back",
    description:
        "Admins log in with their email. Booth staff log in with their booth name.",
};
