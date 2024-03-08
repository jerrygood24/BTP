import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
} from '@mui/material';

const QuizDialog = ({ isOpen, onClose, onAddQuiz }) => {
  const [questions, setQuestions] = useState([{ question: '', options: ['', '', '', ''], correctOptionIndex: -1 }]);

  const handleAddQuestion = () => {
    setQuestions([...questions, { question: '', options: ['', '', '', ''], correctOptionIndex: -1 }]);
  };

  const handleRemoveQuestion = (index) => {
    const updatedQuestions = [...questions];
    updatedQuestions.splice(index, 1);
    setQuestions(updatedQuestions);
  };

  const handleAddQuiz = () => {
    // Validate and submit quiz data
    if (questions.every(question => question.question && question.options.every(option => option.trim() !== '') && question.correctOptionIndex !== -1)) {
      onAddQuiz(questions);
      // Close the dialog
      onClose();
    } else {
      alert('Please fill in all fields for each question and select the correct option.');
    }
  };

  const handleQuestionInputChange = (index, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].question = value;
    setQuestions(updatedQuestions);
  };

  const handleOptionChange = (questionIndex, optionIndex, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].options[optionIndex] = value;
    setQuestions(updatedQuestions);
  };

  const handleCorrectOptionChange = (questionIndex, index) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].correctOptionIndex = index;
    setQuestions(updatedQuestions);
  };

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>Add Quiz</DialogTitle>
      <DialogContent>
        {questions.map((question, index) => (
          <div key={index}>
            <TextField
              label={`Question ${index + 1}`}
              value={question.question}
              onChange={(e) => handleQuestionInputChange(index, e.target.value)}
              fullWidth
              margin="normal"
            />
            {question.options.map((option, optionIndex) => (
              <TextField
                key={optionIndex}
                label={`Option ${optionIndex + 1}`}
                value={option}
                onChange={(e) => handleOptionChange(index, optionIndex, e.target.value)}
                fullWidth
                margin="normal"
              />
            ))}
            <TextField
              select
              label="Correct Option"
              value={question.correctOptionIndex}
              onChange={(e) => handleCorrectOptionChange(index, parseInt(e.target.value))}
              fullWidth
              margin="normal"
            >
              {question.options.map((option, optionIndex) => (
                <MenuItem key={optionIndex} value={optionIndex}>
                  Option {optionIndex + 1}
                </MenuItem>
              ))}
            </TextField>
            {index !== 0 && <Button onClick={() => handleRemoveQuestion(index)}>Remove Question</Button>}
          </div>
        ))}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleAddQuestion}>Add Question</Button>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleAddQuiz}>Save</Button>
      </DialogActions>
    </Dialog>
  );
};

export default QuizDialog;
