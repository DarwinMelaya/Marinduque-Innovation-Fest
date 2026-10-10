import EventPage from "@/components/public/EventPage";
import type { EventPageData } from "@/components/public/EventPage";

const event: EventPageData = {
    title: "Forums and Panel Discussions",
    tagline:
        "Tech talks and fireside chats with industry experts, researchers, government agencies, and technology organizations.",
    summary: [
        "A series of forums, talk shows, and panel discussions at The Nexus Stage on technopreneurship, design thinking, robotics, and emerging technologies, to promote innovation, entrepreneurship, and technology development.",
        "Everyone is welcome to attend, including students, teachers, entrepreneurs, and community members.",
    ],
    facts: [
        { label: "Venue", value: "The Nexus Stage" },
        { label: "Who can attend", value: "Open to everyone" },
        {
            label: "Session 1 · October 6, PM",
            value: "Facilitated by the Marinduque Technology Business Incubator (MTBI)",
        },
        {
            label: "Session 2 · October 7, AM",
            value: "Facilitated by the Marinduque Innovation Hub (iHUB)",
        },
    ],
    timeline: [
        {
            date: "October 6, 2026 · PM",
            activity: "MTBI-led series of forums, talk shows, and panel discussions with resource speakers",
        },
        {
            date: "October 7, 2026 · AM",
            activity: "iHUB-led forum and panel discussion on innovation, technology, and entrepreneurship",
        },
    ],
    faqs: [
        {
            question: "What topics will be discussed?",
            answer: {
                bullets: [
                    "Technopreneurship",
                    "Innovation and design thinking",
                    "Robotics",
                    "Emerging technologies",
                ],
            },
        },
        {
            question: "Who are the organizers and partners?",
            answer: [
                "The sessions are led by the Marinduque Technology Business Incubator and the Marinduque Innovation Hub, with Marinduque State University and partners such as DevCon, Erovoutika, and Cybercraft PH.",
            ],
        },
        {
            question: "Do I need to register?",
            answer: [
                "Forums and panel discussions are open to the public. You can also register as a participant in the festival to receive a Fest ID and earn points at booths.",
            ],
        },
    ],
};

const ForumsPanelDiscussions = () => <EventPage event={event} />;

export default ForumsPanelDiscussions;
