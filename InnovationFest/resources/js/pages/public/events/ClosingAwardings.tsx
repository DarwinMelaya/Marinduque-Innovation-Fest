import EventPage from "@/components/public/EventPage";
import type { EventPageData } from "@/components/public/EventPage";

const event: EventPageData = {
    title: "Closing Ceremonies and Awarding",
    tagline:
        "Official recognition of winning teams and participating qualifiers across all challenge components.",
    summary: [
        "The closing program caps the Marinduque Innovation Fest 2026 with the awarding of prize money, medals, and certificates. It follows the final presentations of the Hackathon prototype pitching, Idea Pitching, E-Games Development Challenge, and the Kuwentolohiya video presentation.",
        "The awarding ceremony is held in the last week of October as part of the festival.",
    ],
    facts: [
        { label: "Venue", value: "The Nexus Stage" },
        { label: "When", value: "Last week of October 2026" },
        {
            label: "Awarded",
            value: "Hackathon, Idea Pitching, E-Games Sports Development Challenge, and Kuwentolohiya",
        },
        {
            label: "Recognition",
            value: "Cash prizes, medals, and certificates for winners and qualifiers",
        },
    ],
    prizes: [
        { award: "Champion", prize: "₱10,000" },
        { award: "First Runner-Up", prize: "₱5,000" },
        { award: "Second Runner-Up", prize: "₱3,000" },
    ],
    prizeNote:
        "Each challenge gives these prizes, plus medals. All shortlisted qualifiers who present during the event receive a Certificate of Participation.",
    faqs: [
        {
            question: "Which competitions are awarded?",
            answer: {
                bullets: [
                    "Innovation Fest Hackathon",
                    "Idea Pitching Competition",
                    "E-Games Sports Development Challenge",
                    "Kuwentolohiya: A Short Video Contest",
                ],
            },
        },
        {
            question: "How are winners chosen?",
            answer: [
                "Each challenge has two stages. An initial screening picks five finalists, then a separate set of judges scores the finalists with an official rubric. The decision of the final judging panel is final and irrevocable.",
            ],
        },
        {
            question: "Do attendees receive certificates?",
            answer: [
                "Participants who register for the festival get an e-certificate of attendance.",
            ],
        },
    ],
};

const ClosingAwardings = () => <EventPage event={event} />;

export default ClosingAwardings;
