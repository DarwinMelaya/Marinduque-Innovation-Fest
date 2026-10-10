import EventPage from "@/components/public/EventPage";
import type { EventPageData } from "@/components/public/EventPage";

const event: EventPageData = {
    title: "Innovation Fest Hackathon",
    tagline:
        "A two-day collaborative challenge to build technology-driven solutions to local problems in Marinduque.",
    theme: "Code for Marinduque: Innovate, Create, Transform",
    summary: [
        "The Marinduque Innovation Fest 2026 Hackathon brings together students, developers, designers, and innovators to create technology-driven solutions to local challenges. Teams work together within a given timeframe, supported by mentors and technical experts.",
        "Each team conceptualizes its own tech-business Information System and delivers a fully working prototype, either an app or a website, then pitches it live before the Board of Judges.",
    ],
    facts: [
        { label: "Venue", value: "Marinduque State University" },
        {
            label: "Development phase",
            value: "2 days: 1:00–5:00 PM on day 1 and 8:00 AM–5:00 PM on day 2. No overnight stay; lunch and snacks provided.",
        },
        {
            label: "Who can join",
            value: "Currently enrolled high school and college students in Marinduque. 3 members plus 1 coach or mentor per team.",
        },
        {
            label: "Registration deadline",
            value: "October 6, 2026",
        },
    ],
    links: [
        {
            label: "Register your team",
            href: "https://forms.gle/LZJ2Y7p3EqPaZ5V86",
        },
        {
            label: "Submit proposal",
            href: "https://forms.gle/oE93tCN8h1YjBJuX7",
        },
    ],
    timeline: [
        { date: "October 6, 2026", activity: "Registration deadline" },
        { date: "October 8, 2026", activity: "Webinar Bootcamp on Design Thinking and Idea Pitching" },
        {
            date: "October 16, 2026",
            activity: "Deadline for the final proposal and required documents",
        },
        { date: "October 17–20, 2026", activity: "Initial screening and evaluation" },
        {
            date: "October 21, 2026",
            activity: "Announcement of the five (5) finalists",
        },
        {
            date: "Last week of October",
            activity: "Hackathon proper, prototype pitching, and awarding",
        },
    ],
    criteria: [
        {
            title: "Initial screening",
            rows: [
                { criterion: "Team Capability & Technical Skills", weight: "25%" },
                { criterion: "Problem Identification & Relevance", weight: "25%" },
                { criterion: "Proposed Solution & Innovation", weight: "20%" },
                { criterion: "Technical & Business Viability", weight: "15%" },
                { criterion: "Clarity & Completeness of Submission", weight: "15%" },
            ],
        },
        {
            title: "Final judging",
            rows: [
                { criterion: "Relevance to the Theme", weight: "25%" },
                { criterion: "Technical Execution & Prototype Functionality", weight: "25%" },
                { criterion: "Tech-Business Viability & Innovation", weight: "20%" },
                { criterion: "User Interface (UI) & User Experience (UX)", weight: "15%" },
                { criterion: "Pitch Presentation & Live Demo", weight: "15%" },
            ],
        },
    ],
    prizes: [
        { award: "Champion", prize: "₱10,000" },
        { award: "First Runner-Up", prize: "₱5,000" },
        { award: "Second Runner-Up", prize: "₱3,000" },
    ],
    prizeNote:
        "Awardees also receive medals. All shortlisted qualifiers who present during the event receive a Certificate of Participation.",
    faqs: [
        {
            question: "What themes and sectors can we work on?",
            answer: {
                bullets: [
                    "Agriculture & Food Innovation",
                    "Disaster Risk Reduction / Climate Change Adaptation",
                    "Blue Economy & Marine Innovation",
                    "Digital Technology & AI",
                    "Health & Wellness Innovation",
                    "Tourism & Cultural Innovation",
                    "Creative Technology & E-Sports Game",
                    "Governance & Smart Communities",
                ],
            },
        },
        {
            question: "How do we join?",
            answer: {
                bullets: [
                    "The Team Leader registers the whole team using the official form on or before October 6, 2026.",
                    "Submit names and contact details of the three members and the coach.",
                    "Participants below 18 submit a Parent/Guardian Consent Form.",
                    "Attend the Webinar Bootcamp on October 8, 2026.",
                ],
            },
        },
        {
            question: "What must we submit for initial screening?",
            answer: {
                bullets: [
                    "Curriculum Vitae of each team member",
                    "Official group photo (one portrait and one landscape, plain white background, JPG or PNG)",
                    "Proposal in PDF: A4, Times New Roman 12 pt, double spaced, 1-inch margins, with a title page and abstract",
                    "No prototype is required at this stage. Deadline: October 16, 2026. Late submissions are not accepted.",
                ],
            },
        },
        {
            question: "What are the in-house contest rules?",
            answer: {
                bullets: [
                    "A formal draw decides the sector each team focuses on.",
                    "All coding, database creation, and UI/UX design must be built from scratch during the two days. Pre-existing projects are not accepted.",
                    "Use of AI tools such as ChatGPT or Copilot is allowed, and must be disclosed.",
                    "Mobile phones are not allowed during the development phase.",
                    "Give your facilitator access to your GitHub or Google Drive repository at the end of each day.",
                    "Teams may not leave the venue during working hours except for health breaks or authorized purposes. No spectators are allowed.",
                    "Each team gets one official mentor.",
                ],
            },
        },
        {
            question: "How does the pitching proper work?",
            answer: [
                "Finalists present live before the Board of Judges and an audience, with a pitch deck covering the problem, solution, STI component, implementation approach, and expected community impact.",
                "Each team has 7 minutes for the Innovation Pitch and 13 minutes for the Q&A. Prototypes, demo models, and videos are required.",
            ],
        },
        {
            question: "What are the expected outputs?",
            answer: {
                bullets: [
                    "Working prototype",
                    "Project documentation",
                    "Source code and technical files",
                    "Pitch deck",
                    "Live prototype demonstration",
                    "Final pitch presentation",
                ],
            },
        },
        {
            question: "Who is not eligible, and how do protests work?",
            answer: [
                "DOST employees and members of the organizing committee cannot join. Only one entry per team is allowed.",
                "A mentor or representative may file a protest by letter to pstc.marinduque@mimaropa.dost.gov.ph within 30 minutes after the competition proper ends. The decision of the Board of Judges is final.",
            ],
        },
    ],
};

const Hackton = () => <EventPage event={event} />;

export default Hackton;
