import React, { useState } from "react";
import { Dialog, DialogTitle, DialogContent, Button } from "@mui/material";

const QuizTakingDialog = ({ quiz, inclose, onclose }) => {
    const [answers, setAnswers] = useState({});

    const handleOptionSelect = (questionId, optionId) => {
        setAnswers({ ...answers, [questionId]: optionId });
    };

    const handleSubmitQuiz = () => {
        // Logic to submit quiz answers to the backend
        console.log("Submitted answers:", answers);
    };

    return (
        <Dialog open={inclose} onClose={onclose}>
            <DialogTitle>Take Quiz</DialogTitle>
            <DialogContent>
                {quiz.questions.map((question) => (
                    <div key={question.id}>
                        <p>{question.text}</p>
                        {question.options.map((option) => (
                            <Button
                                key={option.id}
                                variant="outlined"
                                onClick={() => handleOptionSelect(question.id, option.id)}
                                style={{ backgroundColor: option.isCorrect ? "lightgreen" : "white" }}
                            >
                                {option.text}
                            </Button>
                        ))}
                    </div>
                ))}
                <Button variant="contained" onClick={handleSubmitQuiz}>
                    Submit Quiz
                </Button>
            </DialogContent>
        </Dialog>
    );
};

export default QuizTakingDialog;
