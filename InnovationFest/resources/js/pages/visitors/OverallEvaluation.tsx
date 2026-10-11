import EvaluationFlow from "@/components/visitors/EvaluationFlow";
import { store } from "@/routes/visitor/evaluation";

type Props = {
    points: number;
    questions: {
        key: string;
        label: string;
        type: "choice" | "rating" | "text";
        options?: string[];
    }[];
    submitted: { points: number } | null;
};

const OverallEvaluation = (props: Props) => (
    <EvaluationFlow
        title="Overall evaluation"
        submitUrl={store.url()}
        {...props}
    />
);

export default OverallEvaluation;
