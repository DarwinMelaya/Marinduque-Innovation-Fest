import EventPage from "@/components/public/EventPage";
import type { EventPageData } from "@/components/public/EventPage";

const event: EventPageData = {
    title: "Idea Pitching Competition",
    tagline:
        "A platform for student innovators to pitch creative, research-backed solutions to local challenges.",
    theme: "Imagine. Innovate. Impact: Building a Smarter Marinduque",
    summary: [
        "Participants pitch their ideas to a panel of judges, highlighting the solution's potential impact, feasibility, and sustainability. The activity aims to inspire innovation, entrepreneurship, and problem-solving among Marinduqueño youth.",
        "It also gives proponents a way to turn academic studies into deployable solutions and connect with industry experts for mentorship.",
    ],
    facts: [
        { label: "Venue", value: "The Nexus Stage, Marinduque Innovation Fest 2026" },
        {
            label: "Who can join",
            value: "Enrolled college and high school students. Individuals or teams of up to 3 members, with 1 faculty coach or adviser.",
        },
        { label: "Registration deadline", value: "October 6, 2026" },
        { label: "Proposal and poster deadline", value: "October 16, 2026" },
    ],
    links: [
        { label: "Register your team", href: "https://forms.gle/oSps4BPjbXm73TQ49" },
        { label: "Submit proposal & poster", href: "https://forms.gle/BS29eNNmFZ4uAVgk7" },
    ],
    timeline: [
        { date: "October 6, 2026", activity: "Registration deadline" },
        { date: "October 8, 2026", activity: "Webinar Bootcamp on Design Thinking and Idea Pitching" },
        { date: "October 16, 2026", activity: "Deadline for the final proposal, poster, and required documents" },
        { date: "October 17–20, 2026", activity: "Initial screening and evaluation" },
        { date: "October 21, 2026", activity: "Announcement of the five (5) finalists" },
        { date: "Last week of October", activity: "Pitching proper and awarding" },
    ],
    criteria: [
        {
            title: "Initial screening",
            rows: [
                { criterion: "Relevance and Significance", weight: "25%" },
                { criterion: "Innovativeness and Originality", weight: "25%" },
                { criterion: "Potential Impact and Value", weight: "25%" },
                { criterion: "Clarity and Completeness of the Concept", weight: "15%" },
                { criterion: "Compliance with Submission Requirements", weight: "10%" },
            ],
        },
    ],
    prizes: [
        { award: "Champion", prize: "₱10,000" },
        { award: "First Runner-Up", prize: "₱5,000" },
        { award: "Second Runner-Up", prize: "₱3,000" },
    ],
    prizeNote:
        "Awardees also receive medals. All shortlisted qualifiers who present their research during the event receive a Certificate of Participation.",
    faqs: [
        {
            question: "What areas can our idea focus on?",
            answer: {
                bullets: [
                    "Agriculture and Food Innovation",
                    "Disaster Risk Reduction and Climate Change Adaptation",
                    "Blue Economy and Marine Innovation",
                    "Digital Technology and AI",
                    "Health and Wellness Innovation",
                    "Tourism and Cultural Innovation",
                    "Creative Technology and E-Games",
                    "Governance and Smart Communities",
                ],
            },
        },
        {
            question: "What do we need to submit?",
            answer: {
                bullets: [
                    "Proposal in PDF: A4, Times New Roman 12 pt, double spaced, 1-inch margins, with a title page and abstract.",
                    "Promotional poster, portrait, 2 ft × 3 ft (24 × 36 in), submitted as a high-resolution PNG.",
                    "Parent/Guardian Consent Form for participants below 18.",
                    "Deadline: October 16, 2026. Late submissions are not accommodated.",
                ],
            },
        },
        {
            question: "Is AI allowed?",
            answer: [
                "Entries entirely generated or significantly assisted by AI are strictly prohibited. Limited AI use for minor enhancements is allowed if the output is primarily your own work.",
                "Disclose all AI tools used and their purpose in the submission form. Judges may deduct points depending on the degree of AI involvement.",
            ],
        },
        {
            question: "How does the initial screening work?",
            answer: [
                "A screening panel scores all entries with a standardized rubric to select the Top 5 finalists. Where practicable, entries are scored by entry code instead of team or school names.",
                "Finalists are notified on October 21, 2026.",
            ],
        },
        {
            question: "How does the pitching proper work?",
            answer: {
                bullets: [
                    "Finalists pitch live before the Board of Judges and an audience.",
                    "Prepare a five-slide deck: Title and Team Information; Problem Statement and Target Beneficiaries; Proposed Solution; Science, Technology, and Innovation (STI) Component; Expected Community Impact.",
                    "7 minutes for the pitch and 13 minutes for Q&A with the judges.",
                    "Prototypes, models, and videos are optional and are not part of the evaluation.",
                    "The pitch must match the final proposal submitted on October 16, 2026.",
                    "Pitching order is decided by random draw or announced by the organizers.",
                ],
            },
        },
        {
            question: "Who is not eligible?",
            answer: [
                "DOST employees and members of the organizing committee. Each team may submit only one entry, with one Team Leader as the contact person.",
            ],
        },
    ],
};

const IdeaPitching = () => <EventPage event={event} />;

export default IdeaPitching;
