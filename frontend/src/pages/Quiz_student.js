import React, { useEffect, useState } from "react";
import { Dialog, DialogTitle, DialogContent, Button } from "@mui/material";
import axios from "axios";
import './Quiz_student.css';

const QuizTakingDialog = ({ inclose, onclose, title }) => {
    const [quiz, setQuiz] = useState(null);
    const [answers, setAnswers] = useState({});

    useEffect(() => {
        const fetchQuiz = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/quizzes/fetch_quiz/?title=${title}`);
                setQuiz(response.data);
            } catch (error) {
                console.error("Error fetching quiz:", error);
            }
        };
        fetchQuiz();
    }, [title]);

    const handleOptionSelect = (questionId, optionId) => {
        setAnswers({ ...answers, [questionId]: optionId });
    };

    const handleSubmitQuiz = () => {
        // Logic to submit quiz answers to the backend
        console.log("Submitted answers:", answers);
        let score = 0;

        quiz.questions.forEach((question, index) => {
            const id = index + 1; // Assuming questions are indexed starting from 1
            const correctOptionIndex = question.options.findIndex(option => option.is_correct);
            if (answers[id] === correctOptionIndex) {
                score++;
            }
        });
        setAnswers({});
        // Remove the "selected-option" class from all buttons
        const buttons = document.querySelectorAll(".selected-option");
        buttons.forEach((button) => {
            button.classList.remove("selected-option");
        });
        console.log(score);
        onclose();
        alert(`Your score: ${score}`);

    };

    return (
        <Dialog open={inclose} onClose={onclose}>
            {quiz && (
                <>
                    <DialogTitle>{quiz.title}</DialogTitle>
                    <DialogContent>
                        {quiz.questions.map((question, index) => (
                            <div key={index}>
                                <p>{question.text}</p>
                                {question.options.map((option, optionIndex) => (
                                    <Button
                                        key={optionIndex}
                                        variant={answers[index + 1] === optionIndex ? "contained" : "outlined"}
                                        onClick={() => handleOptionSelect(index + 1, optionIndex)}
                                        className={answers[index + 1] === optionIndex ? "selected-option" : ""}
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
                </>
            )}
        </Dialog>
    );
};

export default QuizTakingDialog;
