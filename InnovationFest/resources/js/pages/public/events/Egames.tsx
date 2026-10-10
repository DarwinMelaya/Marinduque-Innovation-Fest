import EventPage from "@/components/public/EventPage";
import type { EventPageData } from "@/components/public/EventPage";

const event: EventPageData = {
    title: "E-Games Sports Development Challenge",
    tagline:
        "A student competition to design and develop an original, competitive game with real-world potential.",
    theme: "Create. Play. Innovate",
    summary: [
        "The E-Games Sports Development Challenge encourages creativity, innovation, and technical skills through game development. Participants design and develop an original game that shows engaging gameplay, effective use of technology, and potential for real-world application.",
        "Finalist games are showcased to visitors in the Gamers Den during the festival.",
    ],
    facts: [
        { label: "Showcase", value: "Gamers Den, Marinduque Innovation Fest 2026" },
        {
            label: "Who can join",
            value: "Enrolled high school and college students. Up to 3 students plus 1 faculty coach or adviser per team.",
        },
        { label: "Registration deadline", value: "October 6, 2026" },
        { label: "Game submission deadline", value: "October 16, 2026" },
    ],
    links: [
        { label: "Register your team", href: "https://forms.gle/w6VcDSBH4N5epufg8" },
        { label: "Submit your game", href: "https://forms.gle/dpD5STaJVaaa1HjHA" },
    ],
    timeline: [
        { date: "October 6, 2026", activity: "Registration deadline" },
        { date: "October 8, 2026", activity: "Bootcamp" },
        { date: "October 16, 2026", activity: "Deadline for submission of the final game and required documents" },
        { date: "October 17–20, 2026", activity: "Initial screening and evaluation" },
        { date: "October 21, 2026", activity: "Announcement of the five (5) finalists" },
        { date: "Last week of October", activity: "Final judging, game demonstration, and awarding" },
    ],
    criteria: [
        {
            title: "Initial screening",
            rows: [
                { criterion: "Completeness", weight: "20%" },
                { criterion: "Theme Relevance", weight: "20%" },
                { criterion: "Originality", weight: "20%" },
                { criterion: "Gameplay", weight: "20%" },
                { criterion: "Aesthetics and Creativity", weight: "20%" },
            ],
        },
        {
            title: "Final judging",
            rows: [
                { criterion: "Gameplay", weight: "25%" },
                { criterion: "E-Games Sports Potential", weight: "25%" },
                { criterion: "Creativity and Innovation", weight: "20%" },
                { criterion: "Graphics and Art", weight: "15%" },
                { criterion: "Music and Sound Design", weight: "15%" },
            ],
        },
    ],
    prizes: [
        { award: "Champion", prize: "₱10,000" },
        { award: "First Runner-Up", prize: "₱5,000" },
        { award: "Second Runner-Up", prize: "₱3,000" },
    ],
    prizeNote:
        "Awardees also receive medals. All shortlisted qualifiers receive a Certificate of Participation.",
    faqs: [
        {
            question: "What themes can our game follow?",
            answer: {
                bullets: [
                    "Smart City",
                    "Disaster Risk Reduction and Management",
                    "Climate Change",
                    "Education",
                    "Circular Economy",
                    "Philippine Games and Sports",
                    "Board Games / Brain Games",
                ],
            },
        },
        {
            question: "What are the game rules?",
            answer: {
                bullets: [
                    "Playable online or over a local area network.",
                    "Must have Player-versus-Player matches, or Player-versus-Environment with leaderboards such as fastest time or highest score.",
                    "Skill-based or knowledge-based matches finished in a reasonable time, with a clear way to determine the winner.",
                    "Playable on a browser, PC, or mobile device without buying a subscription or license.",
                    "Any programming language or engine is allowed (Unity, Unreal, Godot, RPG Maker, etc.).",
                    "The game must not have been published on any platform or store such as Steam, Google Play, App Store, or itch.io.",
                ],
            },
        },
        {
            question: "What content is prohibited?",
            answer: {
                bullets: [
                    "Material that infringes privacy, copyright, trademark, patent, or other rights.",
                    "Footage, images, or artwork the team did not create, unless included in the chosen platform or properly licensed.",
                    "Inappropriate, obscene, hateful, defamatory, or discriminatory content.",
                    "Anything unlawful in the Philippines, including AI-generated content that violates these rules.",
                ],
            },
        },
        {
            question: "How strict is the code originality rule?",
            answer: [
                "All game logic, mechanics, and source code must be created by the registered team. Do not reuse code from other competitions, other developers without permission, or open-source projects, tutorials, or templates that implement the core mechanics.",
                "Personal code libraries may be reused only if you made them entirely and they were never part of a published or submitted game, and you declare them. Violations lead to disqualification or loss of the prize.",
            ],
        },
        {
            question: "Can we use AI?",
            answer: [
                "AI-generated code is allowed only as an assistive tool, such as utility functions or boilerplate, and not as a substitute for authoring the core gameplay logic and narrative. Disclose all AI tools and their purpose.",
                "Judges may deduct points depending on how much AI was involved.",
            ],
        },
        {
            question: "What do we submit?",
            answer: {
                bullets: [
                    "Form 01: team members, game title, and a synopsis of up to 500 words.",
                    "Form 02: Asset and AI Usage Disclosure (not needed for fully original entries).",
                    "Game trailer: a 1–2 minute teaser that can play in a loop.",
                    "Prototype or demo: a 3–5 minute gameplay recording in .mp4.",
                    "Promotional poster: 2 ft × 3 ft (24 × 36 in).",
                    "Upload everything to Google Drive and submit only the link by October 16, 2026.",
                ],
            },
        },
    ],
};

const Egames = () => <EventPage event={event} />;

export default Egames;
