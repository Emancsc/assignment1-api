import React, { useEffect, useState } from 'react';
import { getQuestions } from '../utils/triviaQuestions.js';
import './TriviaPage.css';


export default function TriviaPage() {
    const [questions, setQuestions] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [selected, setSelected] = useState(null);
    const [showScore, setShowScore] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchQuestions() {
            setLoading(true);
            const data = await getQuestions({ category: 'Teams', amount: 10 });
            setQuestions(data);
            setLoading(false);
        }
        fetchQuestions();
    }, []);

    const handleAnswer = (index) => {
        setSelected(index);
        if (index === questions[currentIndex].answer) {
            setScore((prev) => prev + 1);
        }
    };

    const handleNext = () => {
        setSelected(null);
        if (currentIndex + 1 < questions.length) {
            setCurrentIndex((prev) => prev + 1);
        } else {
            setShowScore(true);
        }
    };

    const handleRestart = () => {
        setCurrentIndex(0);
        setScore(0);
        setSelected(null);
        setShowScore(false);
    };

    if (loading) return <p>Loading questions...</p>;

    if (showScore) {
        return (
            <div className="trivia-container">
                <h2>Your Score: {score} / {questions.length}</h2>
                <button className="try-again"  onClick={handleRestart}>Try Again</button>
            </div>
        );
    }

    const question = questions[currentIndex];

    return (
        <div className="trivia-container">
            <h2>Question {currentIndex + 1} / {questions.length}</h2>
            <p>{question.question}</p>

            <div className="choices">
                {question.choices.map((choice, idx) => (
                    <button
                        key={idx}
                        onClick={() => handleAnswer(idx)}
                        disabled={selected !== null}
                        className={
                            selected === idx
                                ? idx === question.answer
                                    ? 'correct'
                                    : 'wrong'
                                : ''
                        }
                    >
                        {choice}
                    </button>
                ))}
            </div>

            {selected !== null && (
                <button onClick={handleNext} className="next-btn">
                    {currentIndex + 1 < questions.length ? 'Next Question' : 'Finish'}
                </button>
            )}
        </div>
    );
}
