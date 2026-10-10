import EventPage from "@/components/public/EventPage";
import type { EventPageData } from "@/components/public/EventPage";

const event: EventPageData = {
    title: "Kuwentolohiya: A Short Video Contest",
    tagline:
        "Tell the story of Marinduque by weaving together kuwento (stories), kultura (culture), and teknolohiya (technology).",
    theme: "Likha ng Marinduque: Kuwento, Kultura, at Teknolohiya",
    summary: [
        "Kuwentolohiya is a short video contest that showcases the identity, experiences, and creativity of Marinduqueños. Stories express experiences and aspirations, culture carries traditions and heritage, and technology offers new ways to create, preserve, interpret, and share them.",
        "Teams explore how technology can bring cultural stories to life, and how heritage can inspire creative, meaningful use of technology.",
    ],
    facts: [
        { label: "Video length", value: "Up to 5 minutes, MP4 or MOV, landscape 16:9, at least 1080p" },
        {
            label: "Who can join",
            value: "Groups of 3 members of any age, from any school, organization, or community, with 1 faculty coach or adviser.",
        },
        { label: "Registration and concept deadline", value: "October 6, 2026" },
        { label: "Final video deadline", value: "October 16, 2026" },
    ],
    links: [
        { label: "Register your team", href: "https://forms.gle/z6KGX7EyQR2zvkZt8" },
        { label: "Submit final video", href: "https://forms.gle/VPw1vF2zuLj2RpSY7" },
    ],
    timeline: [
        { date: "October 6, 2026", activity: "Registration and submission of the proposed video concept" },
        { date: "October 16, 2026", activity: "Deadline for the final video, poster, and required documents" },
        { date: "October 17–20, 2026", activity: "Initial screening and evaluation" },
        { date: "October 21, 2026", activity: "Announcement of the five (5) finalists" },
        { date: "Last week of October", activity: "Final judging, video presentation, and awarding" },
    ],
    criteria: [
        {
            title: "Final judging",
            rows: [
                { criterion: "Storytelling and Impact", weight: "30%" },
                { criterion: "Representation of Marinduque Culture and Identity", weight: "25%" },
                { criterion: "Meaningful Integration of Technology", weight: "20%" },
                { criterion: "Creativity and Originality", weight: "15%" },
                { criterion: "Technical Execution and Overall Production Quality", weight: "10%" },
            ],
        },
    ],
    prizes: [
        { award: "Champion", prize: "₱10,000" },
        { award: "First Runner-Up", prize: "₱5,000" },
        { award: "Second Runner-Up", prize: "₱3,000" },
    ],
    prizeNote:
        "Awardees also receive medals. All shortlisted qualifiers who present their video during the event receive a Certificate of Participation.",
    faqs: [
        {
            question: "What should our video be about?",
            answer: {
                bullets: [
                    "Kuwento: stories, experiences, memories, aspirations, and voices of Marinduqueños.",
                    "Kultura: traditions, practices, heritage, people, places, arts, and local identity.",
                    "Teknolohiya: digital and creative tools used to create, preserve, interpret, or share the story.",
                    "The creative interpretation and video format are up to you, as long as the theme is clear.",
                ],
            },
        },
        {
            question: "What goes into the concept submission?",
            answer: {
                bullets: [
                    "Working title",
                    "Story or topic to be featured",
                    "Cultural element or aspect of Marinduque to be highlighted",
                    "How technology will be incorporated",
                    "Intended message or purpose",
                ],
            },
        },
        {
            question: "What are the video rules?",
            answer: {
                bullets: [
                    "Original work only. Plagiarism or copyright infringement means immediate disqualification.",
                    "Filipino, English, or a local dialect. Local dialects need Filipino or English subtitles.",
                    "No unauthorized copyrighted music, images, or clips.",
                    "No offensive, defamatory, discriminatory, political campaign, or commercial promotional content.",
                    "Get permission from people, places, or communities featured when needed.",
                    "Must have a title and credits. Organizers may request raw footage or editable files to verify originality.",
                    "Each second over 5 minutes costs 1 point.",
                ],
            },
        },
        {
            question: "Is AI allowed?",
            answer: [
                "Entries entirely generated or significantly assisted by AI are strictly prohibited. Limited AI help for minor enhancements is allowed, such as color correction, noise reduction, spell checking, subtitle generation (reviewed and edited by you), and transcription.",
                "Disclose all AI tools used and their purpose. Judges may deduct points depending on the degree of AI involvement.",
            ],
        },
        {
            question: "What do we submit?",
            answer: {
                bullets: [
                    "Registration stage (October 6): registration form, member details, Team Leader, Parent/Guardian Consent Form for those below 18, and the proposed concept.",
                    "Final stage (October 16): the final video (MP4 or MOV), a video poster in PNG, member information, and other required forms.",
                    "The video poster is portrait, 2 ft × 3 ft (24 × 36 in).",
                ],
            },
        },
        {
            question: "How are entries judged?",
            answer: [
                "A screening panel first selects the Top 5 finalists by standardized rubric: Storytelling and Creativity, Integration of Kuwento, Kultura, at Teknolohiya, Technical/Visual and Audio Execution, and Compliance with Submission Requirements.",
                "A separate set of judges then scores the five finalist videos to choose the Champion, First Runner-Up, and Second Runner-Up.",
            ],
        },
    ],
};

const Kunwentolohiya = () => <EventPage event={event} />;

export default Kunwentolohiya;
