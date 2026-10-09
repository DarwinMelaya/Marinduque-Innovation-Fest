import { Form, Head, Link } from "@inertiajs/react";
import { CheckCircle2, ChevronDown, Download } from "lucide-react";
import { useState } from "react";
import InputError from "@/components/input-error";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import {
    authButtonClass,
    authInputClass,
    authLabelClass,
} from "@/lib/auth-styles";
import { register as create } from "@/routes/participants";
import { store } from "@/routes/participants/register";

const SEXES = ["Male", "Female"];

const SECTORS = [
    { name: "is_pwd", label: "PWD" },
    { name: "is_indigenous", label: "Indigenous People" },
    { name: "is_senior_citizen", label: "Senior Citizen" },
    { name: "is_4ps_member", label: "4Ps Member" },
];

const SECTION_TITLE_CLASS =
    "text-xs font-semibold tracking-[0.2em] text-[#F7B600] uppercase";

const SELECT_CLASS =
    "h-11 w-full appearance-none rounded-lg border border-white/10 bg-white/5 px-4 pr-10 text-sm text-white [color-scheme:dark] outline-none focus-visible:border-[#F15E00]/60 focus-visible:ring-[3px] focus-visible:ring-[#F15E00]/25 disabled:cursor-not-allowed disabled:opacity-50 [&_option]:bg-[#1A1919] [&_option]:text-white [&_option:disabled]:text-white/40";

const CHOICE_CLASS =
    "flex h-11 cursor-pointer items-center justify-center rounded-lg border border-white/10 bg-white/5 px-3 text-center text-sm font-medium text-white/70 transition-colors hover:bg-white/10 has-checked:border-[#F15E00]/70 has-checked:bg-[#F15E00]/15 has-checked:text-white has-focus-visible:ring-2 has-focus-visible:ring-[#F15E00]/40";

type Registration = {
    festId: string;
    name: string;
    email: string;
    qrCode: string;
    qrTicket: string;
    emailSent: boolean;
};

type Props = {
    registration: Registration | null;
    barangays: Record<string, string[]>;
    educationLevels: string[];
};

function RegistrationConfirmed({
    registration,
}: {
    registration: Registration;
}) {
    return (
        <div className="flex flex-col items-center gap-6 text-center">
            <Head title="Registered" />

            <div
                role="status"
                className="flex items-center gap-2 rounded-full border border-[#229D1C]/30 bg-[#229D1C]/10 px-4 py-1.5 text-sm font-medium text-[#6FD66A]"
            >
                <CheckCircle2 className="size-4" />
                You're registered, {registration.name}!
            </div>

            <div className="flex flex-col gap-1">
                <p className={SECTION_TITLE_CLASS}>Your Innovation Fest ID</p>
                <p className="font-mono text-4xl font-bold tracking-wider">
                    {registration.festId}
                </p>
            </div>

            <img
                src={registration.qrCode}
                alt={`QR code for ${registration.festId}`}
                className="size-56 rounded-2xl bg-white p-3"
            />

            {registration.emailSent ? (
                <p className="max-w-sm text-sm text-white/60">
                    We sent a copy to{" "}
                    <span className="font-medium text-white">
                        {registration.email}
                    </span>
                    . Present this QR code at the registration desk on the event
                    day.
                </p>
            ) : (
                <p className="max-w-sm rounded-lg border border-[#F7B600]/30 bg-[#F7B600]/10 px-4 py-3 text-sm text-[#FFD66B]">
                    We couldn't email your QR code to{" "}
                    <span className="font-medium text-white">
                        {registration.email}
                    </span>{" "}
                    right now. Download it below and present it at the
                    registration desk on the event day.
                </p>
            )}

            <div className="flex w-full flex-col gap-3 sm:flex-row">
                <a
                    href={registration.qrTicket}
                    download={`${registration.festId}.png`}
                    className={`inline-flex items-center justify-center gap-2 ${authButtonClass}`}
                >
                    <Download className="size-4" />
                    Download QR code
                </a>
                <Link
                    href={create()}
                    className="inline-flex h-11 w-full items-center justify-center rounded-lg border border-white/15 text-sm font-semibold text-white/80 transition-colors hover:bg-white/5 hover:text-white"
                >
                    Register another person
                </Link>
            </div>
        </div>
    );
}

export default function ParticipantsRegistration({
    registration,
    barangays,
    educationLevels,
}: Props) {
    const [municipality, setMunicipality] = useState("");
    const [educationLevel, setEducationLevel] = useState("");

    if (registration) {
        return <RegistrationConfirmed registration={registration} />;
    }

    return (
        <>
            <Head title="Register" />

            <Form
                {...store.form()}
                resetOnSuccess
                disableWhileProcessing
                onSuccess={() => {
                    setMunicipality("");
                    setEducationLevel("");
                }}
                className="flex flex-col gap-10"
            >
                {({ processing, errors }) => (
                    <>
                        <fieldset className="flex flex-col gap-5">
                            <legend className={`mb-5 ${SECTION_TITLE_CLASS}`}>
                                Personal information
                            </legend>

                            <div className="grid gap-5 sm:grid-cols-2">
                                <div className="grid gap-2">
                                    <Label
                                        htmlFor="first_name"
                                        className={authLabelClass}
                                    >
                                        First name
                                    </Label>
                                    <Input
                                        id="first_name"
                                        name="first_name"
                                        required
                                        autoFocus
                                        autoComplete="given-name"
                                        placeholder="Juan"
                                        className={authInputClass}
                                    />
                                    <InputError message={errors.first_name} />
                                </div>
                                <div className="grid gap-2">
                                    <Label
                                        htmlFor="last_name"
                                        className={authLabelClass}
                                    >
                                        Last name
                                    </Label>
                                    <Input
                                        id="last_name"
                                        name="last_name"
                                        required
                                        autoComplete="family-name"
                                        placeholder="Dela Cruz"
                                        className={authInputClass}
                                    />
                                    <InputError message={errors.last_name} />
                                </div>
                            </div>

                            <div className="grid gap-5 sm:grid-cols-2">
                                <div className="grid gap-2">
                                    <Label
                                        htmlFor="age"
                                        className={authLabelClass}
                                    >
                                        Age
                                    </Label>
                                    <Input
                                        id="age"
                                        name="age"
                                        type="number"
                                        inputMode="numeric"
                                        min={1}
                                        max={120}
                                        required
                                        placeholder="18"
                                        className={authInputClass}
                                    />
                                    <InputError message={errors.age} />
                                </div>
                                <div
                                    role="radiogroup"
                                    aria-labelledby="sex-label"
                                    className="grid gap-2"
                                >
                                    <span
                                        id="sex-label"
                                        className={`text-sm leading-none font-medium ${authLabelClass}`}
                                    >
                                        Sex
                                    </span>
                                    <div className="grid grid-cols-2 gap-2">
                                        {SEXES.map((sex) => (
                                            <label
                                                key={sex}
                                                className={CHOICE_CLASS}
                                            >
                                                <input
                                                    type="radio"
                                                    name="sex"
                                                    value={sex}
                                                    required
                                                    className="sr-only"
                                                />
                                                {sex}
                                            </label>
                                        ))}
                                    </div>
                                    <InputError message={errors.sex} />
                                </div>
                            </div>
                        </fieldset>

                        <fieldset className="flex flex-col gap-3">
                            <legend className={`mb-1 ${SECTION_TITLE_CLASS}`}>
                                Sector
                            </legend>
                            <p className="mb-2 text-sm text-white/50">
                                Check all that apply.
                            </p>
                            <div className="grid gap-3 sm:grid-cols-2">
                                {SECTORS.map((sector) => (
                                    <label
                                        key={sector.name}
                                        className="flex h-12 cursor-pointer items-center gap-3 rounded-lg border border-white/10 bg-white/5 px-4 text-sm font-medium text-white/80 transition-colors hover:bg-white/10 has-data-[state=checked]:border-[#F15E00]/70 has-data-[state=checked]:bg-[#F15E00]/15 has-data-[state=checked]:text-white"
                                    >
                                        <Checkbox
                                            name={sector.name}
                                            value="1"
                                            className="border-white/30 data-[state=checked]:border-[#F15E00] data-[state=checked]:bg-[#F15E00] data-[state=checked]:text-white"
                                        />
                                        {sector.label}
                                    </label>
                                ))}
                            </div>
                        </fieldset>

                        <fieldset className="flex flex-col gap-5">
                            <legend className={`mb-5 ${SECTION_TITLE_CLASS}`}>
                                Address
                            </legend>
                            <div className="grid gap-5 sm:grid-cols-2">
                                <div className="grid gap-2">
                                    <Label
                                        htmlFor="municipality"
                                        className={authLabelClass}
                                    >
                                        Municipality
                                    </Label>
                                    <div className="relative">
                                        <select
                                            id="municipality"
                                            name="municipality"
                                            required
                                            value={municipality}
                                            onChange={(e) =>
                                                setMunicipality(e.target.value)
                                            }
                                            className={SELECT_CLASS}
                                        >
                                            <option value="" disabled>
                                                Select municipality
                                            </option>
                                            {Object.keys(barangays).map(
                                                (name) => (
                                                    <option
                                                        key={name}
                                                        value={name}
                                                    >
                                                        {name}
                                                    </option>
                                                ),
                                            )}
                                        </select>
                                        <ChevronDown className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-white/50" />
                                    </div>
                                    <InputError message={errors.municipality} />
                                </div>
                                <div className="grid gap-2">
                                    <Label
                                        htmlFor="barangay"
                                        className={authLabelClass}
                                    >
                                        Barangay
                                    </Label>
                                    <div className="relative">
                                        <select
                                            key={municipality}
                                            id="barangay"
                                            name="barangay"
                                            required
                                            defaultValue=""
                                            disabled={!municipality}
                                            className={SELECT_CLASS}
                                        >
                                            <option value="" disabled>
                                                {municipality
                                                    ? "Select barangay"
                                                    : "Select a municipality first"}
                                            </option>
                                            {(
                                                barangays[municipality] ?? []
                                            ).map((name) => (
                                                <option key={name} value={name}>
                                                    {name}
                                                </option>
                                            ))}
                                        </select>
                                        <ChevronDown className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-white/50" />
                                    </div>
                                    <InputError message={errors.barangay} />
                                </div>
                            </div>
                            <p className="-mt-2 text-sm text-white/40">
                                Province of Marinduque
                            </p>
                        </fieldset>

                        <fieldset className="flex flex-col gap-5">
                            <legend className={`mb-5 ${SECTION_TITLE_CLASS}`}>
                                Education
                            </legend>
                            <div
                                role="radiogroup"
                                aria-labelledby="education-label"
                                className="grid gap-2"
                            >
                                <span
                                    id="education-label"
                                    className={`text-sm leading-none font-medium ${authLabelClass}`}
                                >
                                    Are you currently a student?
                                </span>
                                <div className="grid grid-cols-3 gap-2">
                                    {["", ...educationLevels].map((level) => (
                                        <label
                                            key={level || "none"}
                                            className={CHOICE_CLASS}
                                        >
                                            <input
                                                type="radio"
                                                name="education_level"
                                                value={level}
                                                checked={
                                                    educationLevel === level
                                                }
                                                onChange={() =>
                                                    setEducationLevel(level)
                                                }
                                                className="sr-only"
                                            />
                                            {level || "Not a student"}
                                        </label>
                                    ))}
                                </div>
                                <InputError message={errors.education_level} />
                            </div>

                            {educationLevel && (
                                <div className="grid gap-5 sm:grid-cols-2">
                                    <div
                                        className={`grid gap-2 ${educationLevel === "College" ? "" : "sm:col-span-2"}`}
                                    >
                                        <Label
                                            htmlFor="school"
                                            className={authLabelClass}
                                        >
                                            School
                                        </Label>
                                        <Input
                                            id="school"
                                            name="school"
                                            required
                                            placeholder={
                                                educationLevel === "College"
                                                    ? "e.g. Marinduque State University"
                                                    : "e.g. Marinduque National High School"
                                            }
                                            className={authInputClass}
                                        />
                                        <InputError message={errors.school} />
                                    </div>
                                    {educationLevel === "College" && (
                                        <div className="grid gap-2">
                                            <Label
                                                htmlFor="course"
                                                className={authLabelClass}
                                            >
                                                Course
                                            </Label>
                                            <Input
                                                id="course"
                                                name="course"
                                                required
                                                placeholder="e.g. BS Information Technology"
                                                className={authInputClass}
                                            />
                                            <InputError
                                                message={errors.course}
                                            />
                                        </div>
                                    )}
                                </div>
                            )}
                        </fieldset>

                        {!educationLevel && (
                            <fieldset className="flex flex-col gap-5">
                                <legend
                                    className={`mb-5 ${SECTION_TITLE_CLASS}`}
                                >
                                    Affiliation
                                </legend>
                                <div className="grid gap-5 sm:grid-cols-2">
                                    <div className="grid gap-2">
                                        <Label
                                            htmlFor="agency"
                                            className={authLabelClass}
                                        >
                                            Agency{" "}
                                            <span className="font-normal text-white/40">
                                                (optional)
                                            </span>
                                        </Label>
                                        <Input
                                            id="agency"
                                            name="agency"
                                            placeholder="e.g. LGU Boac"
                                            className={authInputClass}
                                        />
                                        <InputError message={errors.agency} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label
                                            htmlFor="organization"
                                            className={authLabelClass}
                                        >
                                            Organization{" "}
                                            <span className="font-normal text-white/40">
                                                (optional)
                                            </span>
                                        </Label>
                                        <Input
                                            id="organization"
                                            name="organization"
                                            autoComplete="organization"
                                            placeholder="e.g. Marinduque State University"
                                            className={authInputClass}
                                        />
                                        <InputError
                                            message={errors.organization}
                                        />
                                    </div>
                                </div>
                            </fieldset>
                        )}

                        <fieldset className="flex flex-col gap-5">
                            <legend className={`mb-5 ${SECTION_TITLE_CLASS}`}>
                                Contact details
                            </legend>
                            <div className="grid gap-5 sm:grid-cols-2">
                                <div className="grid gap-2">
                                    <Label
                                        htmlFor="contact_number"
                                        className={authLabelClass}
                                    >
                                        Contact number
                                    </Label>
                                    <Input
                                        id="contact_number"
                                        name="contact_number"
                                        type="tel"
                                        inputMode="tel"
                                        required
                                        autoComplete="tel"
                                        placeholder="09171234567"
                                        className={authInputClass}
                                    />
                                    <InputError
                                        message={errors.contact_number}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label
                                        htmlFor="email"
                                        className={authLabelClass}
                                    >
                                        Email
                                    </Label>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        required
                                        autoComplete="email"
                                        placeholder="you@example.com"
                                        className={authInputClass}
                                    />
                                    <InputError message={errors.email} />
                                </div>
                            </div>
                        </fieldset>

                        <Button
                            type="submit"
                            className={authButtonClass}
                            disabled={processing}
                            data-test="participant-register-button"
                        >
                            {processing && <Spinner />}
                            Submit registration
                        </Button>
                    </>
                )}
            </Form>
        </>
    );
}

ParticipantsRegistration.layout = {
    title: "Register",
    description:
        "Join the Marinduque Innovation Fest 2026 on October 30-31 at Marinduque State University.",
    wide: true,
};
