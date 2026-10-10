import EventPage from "@/components/public/EventPage";
import type { EventPageData } from "@/components/public/EventPage";

const event: EventPageData = {
    title: "Launching of Marinduque Innovation Hub (iHUB)",
    tagline:
        "The official inauguration of the Marinduque iHUB, a platform for innovation, technology development, and entrepreneurship in the province.",
    summary: [
        "The Marinduque Innovation Hub will be officially launched at the DOST Marinduque Office. The ceremony features the Ceremonial Signing of the Memorandum of Understanding (MOU) and Pledge of Commitment with key partners and stakeholders.",
        "The signing shows their shared commitment to support the Hub's programs, foster innovation, and strengthen collaboration within the Marinduque innovation ecosystem.",
    ],
    facts: [
        { label: "Date and time", value: "October 6, 2026 · 8:00 AM" },
        {
            label: "Venue",
            value: "DOST Marinduque Office, Capitol Compound, Bangbangalon, Boac, Marinduque",
        },
        {
            label: "Highlights",
            value: "Ceremonial MOU signing and Pledge of Commitment with regional partners",
        },
        {
            label: "Partners",
            value: "Marinduque TBI, DevCon, Cybercraft PH, Erovoutika, Marinduque State University",
        },
    ],
    faqs: [
        {
            question: "What is the Marinduque Innovation Hub?",
            answer: [
                "The Marinduque iHUB supports innovation, technology development, entrepreneurship, and collaboration in the province. It also helps identify and develop promising technology-based ideas and potential startups through its programs and partner organizations.",
            ],
        },
        {
            question: "What happens at the launch?",
            answer: {
                bullets: [
                    "Official launching of the Marinduque iHUB.",
                    "Ceremonial signing of the MOU and Pledge of Commitment with key partners and stakeholders.",
                    "Opening program of the Marinduque Innovation Fest 2026 and ribbon cutting for the exhibits.",
                ],
            },
        },
        {
            question: "Who is invited?",
            answer: [
                "Local government officials, national agencies such as DTI, DepEd, DICT, DOLE, and TESDA, academe, and technology organizations including Erovoutika, Cybercraft, and DevCon.",
            ],
        },
        {
            question: "What follows the launch?",
            answer: [
                "Forums and panel discussions at The Nexus Stage continue the same afternoon and the next morning, alongside the exhibits, hackathon, and other challenges.",
            ],
        },
    ],
};

const IhubLaunching = () => <EventPage event={event} />;

export default IhubLaunching;
