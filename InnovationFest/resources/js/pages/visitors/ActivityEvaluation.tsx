import EvaluationFlow from "@/components/visitors/EvaluationFlow";
import { store } from "@/routes/visitor/activity-evaluation";

type Props = {
    visitId: number;
    forumName: string;
    points: number;
    questions: {
        key: string;
        label: string;
        type: "choice" | "rating";
        options?: string[];
    }[];
    submitted: { points: number } | null;
};

const ActivityEvaluation = ({ visitId, forumName, ...props }: Props) => (
    <EvaluationFlow
        title={forumName}
        submitUrl={store.url(visitId)}
        {...props}
    />
);

export default ActivityEvaluation;
