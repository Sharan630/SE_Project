import React, { useState } from "react";
import { Button } from "@/components/ui/button"; // if using shadcn/ui, else use a plain <button>

const ReportIdeas = () => {
    const [ideas, setIdeas] = useState([]);

    const generateReportIdeas = () => {
        const suggestions = [
            {
                reason: "harassment",
                description: "The mentor used inappropriate or offensive language during a session."
            },
            {
                reason: "scam",
                description: "The mentor asked for payment outside the platform or promoted suspicious links."
            },
            {
                reason: "spam",
                description: "The mentor kept sending irrelevant messages or unsolicited promotions."
            },
            {
                reason: "inappropriate content",
                description: "The mentor shared content that was not suitable for a professional environment."
            },
            {
                reason: "other",
                description: "The mentor did not behave professionally or deviated from the session goals."
            }
        ];
        setIdeas(suggestions);
    };

    return (
        <div className="p-4">
            <Button onClick={generateReportIdeas}>Show Report Ideas for Mentor</Button>

            {ideas.length > 0 && (
                <ul className="mt-4 list-disc list-inside space-y-2">
                    {ideas.map((idea, index) => (
                        <li key={index}>
                            <strong>Reason:</strong> {idea.reason} <br />
                            <strong>Description:</strong> {idea.description}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default ReportIdeas;
