import EventPage from "@/components/public/EventPage";
import type { EventPageData } from "@/components/public/EventPage";

const event: EventPageData = {
    title: "Technology Exhibits, Gamers Den, and Robots Den",
    tagline:
        "Interactive exhibition spaces with robotics, playable contest games, and technology showcases.",
    summary: [
        "The festival features an exhibition area showcasing technologies, innovations, and projects from partners and stakeholders, including DevCon, E-Rovoutika, Cybercraft PH, Marinduque startups, the Marinduque Innovation Hub, and Marinduque State University.",
        "The area may also host private sector partners and sponsors who want to showcase their products, services, and technology solutions.",
    ],
    facts: [
        {
            label: "Robots Den",
            value: "Different types of robots, with robotics competitions, demonstrations, and interactive discussions on robotics and emerging technologies.",
        },
        {
            label: "Gamers Den",
            value: "All games submitted to the E-Games Sports Development Challenge, open for visitors to play and explore.",
        },
        { label: "Opening", value: "Ribbon cutting for the exhibits after the opening program" },
        { label: "Admission", value: "Free for the public" },
    ],
    faqs: [
        {
            question: "Who is exhibiting?",
            answer: {
                bullets: [
                    "DevCon",
                    "E-Rovoutika",
                    "Cybercraft PH",
                    "Startups in Marinduque",
                    "Marinduque Innovation Hub",
                    "Marinduque State University",
                ],
            },
        },
        {
            question: "What is in the Robots Den?",
            answer: [
                "Robots on display, robotics competitions and training led by Erovoutika, live demonstrations, and discussions about robotics.",
            ],
        },
        {
            question: "What is in the Gamers Den?",
            answer: [
                "Playable entries from the E-Games Sports Development Challenge, made by student teams in Marinduque.",
            ],
        },
        {
            question: "How can my organization exhibit?",
            answer: [
                "Contact the organizers at pstc.marinduque@mimaropa.dost.gov.ph or marinduqueihub@gmail.com, or through the DOST-Provincial S&T Center Marinduque or Marinduque iHub Facebook pages.",
            ],
        },
    ],
};

const Exhibits = () => <EventPage event={event} />;

export default Exhibits;
