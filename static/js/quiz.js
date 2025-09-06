/* ==================================================
QUIZ LOGIC (using external JSON file via Hugo embed)
================================================== */

document.addEventListener("DOMContentLoaded", function () {
    let questions = [];
    let currentQuestionIndex = 0;
    let score = 0;
    let quizCompleted = false;

    // Updated selectors to match your HTML
    const questionElement = document.getElementById("question-display");
    const answerInput = document.getElementById("answer-input");
    const submitButton = document.querySelector(".submit-btn");
    const showAnswerButton = document.querySelector(".next-btn"); // ensure this exists
    const scoreElement = document.getElementById("score-display");
    const quizSection = document.querySelector(".quiz-section");

    // Exit if not on quiz page
    if (!quizSection) return;

    // Initial message
    if (questionElement) {
        questionElement.textContent = "Loading question...";
    }

    // Load quiz data from embedded script tag
    const quizDataElement = document.getElementById("quiz-data");
    if (quizDataElement) {
        try {
            questions = JSON.parse(quizDataElement.textContent);
            questions = shuffleArray(questions);
            showQuestion();
        } catch (error) {
            console.error("Error parsing quiz data:", error);
            if (questionElement) {
                questionElement.textContent = "⚠️ Failed to load quiz questions. Please check JSON format.";
            }
        }
    }

    // Shuffle array
    function shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    function showQuestion() {
        if (currentQuestionIndex >= questions.length) {
            finishQuiz();
            return;
        }

        const currentQuestion = questions[currentQuestionIndex];
        questionElement.textContent = currentQuestion.question;
        answerInput.value = "";
        answerInput.disabled = false;
        answerInput.focus();

        // Reset buttons
        submitButton.textContent = "Submit Answer";
        submitButton.disabled = false;

        if (showAnswerButton) {
            showAnswerButton.textContent = "Show me the answer";
            showAnswerButton.disabled = false;
        }

        removeFeedback();
    }

    function checkAnswer() {
        if (quizCompleted || !answerInput.value.trim()) return;

        const userAnswer = answerInput.value.trim().toLowerCase();
        const currentQuestion = questions[currentQuestionIndex];

        // Allow multiple correct answers
        const correctAnswers = Array.isArray(currentQuestion.answer)
            ? currentQuestion.answer.map(a => a.toLowerCase())
            : [currentQuestion.answer.toLowerCase()];

        const isCorrect = correctAnswers.includes(userAnswer);

        if (isCorrect) {
            showFeedback("✅ Correct!", "success");
            score++;
        } else {
            const correctAnswer = Array.isArray(currentQuestion.answer)
                ? currentQuestion.answer[0]
                : currentQuestion.answer;

            let message = `❌ Incorrect. The correct answer is: ${correctAnswer}`;
            if (currentQuestion.explanation) {
                message += `\n💡 ${currentQuestion.explanation}`;
            }
            showFeedback(message, "error");
        }

        updateScore();
        answerInput.disabled = true;

        // Switch button to next
        submitButton.textContent = "Next Question";
    }

    function showAnswer() {
        const currentQuestion = questions[currentQuestionIndex];
        const correctAnswer = Array.isArray(currentQuestion.answer)
            ? currentQuestion.answer[0]
            : currentQuestion.answer;

        let message = `💡 The answer is: ${correctAnswer}`;
        if (currentQuestion.explanation) {
            message += `\n${currentQuestion.explanation}`;
        }
        showFeedback(message, "info");
    }

    function nextQuestion() {
        currentQuestionIndex++;
        showQuestion();
    }

    function updateScore() {
        scoreElement.textContent = score;
    }

    function finishQuiz() {
        questionElement.textContent = "🎉 Quiz completed!";
        scoreElement.textContent = `${score}/${questions.length}`;

        answerInput.style.display = "none";
        submitButton.textContent = "Restart Quiz";
        quizCompleted = true;

        if (showAnswerButton) showAnswerButton.style.display = "none";

        const percentage = Math.round((score / questions.length) * 100);
        let message = `You scored ${score} out of ${questions.length} (${percentage}%)`;

        if (percentage >= 80) message += " - Excellent! 🌟";
        else if (percentage >= 60) message += " - Good job! 👍";
        else message += " - Keep practicing! 💪";

        showFeedback(message, "success");
    }

    function restartQuiz() {
        currentQuestionIndex = 0;
        score = 0;
        quizCompleted = false;

        questions = shuffleArray(questions);

        answerInput.style.display = "block";
        if (showAnswerButton) showAnswerButton.style.display = "inline-block";

        removeFeedback();
        showQuestion();
    }

    function showFeedback(message, type) {
        removeFeedback();

        const feedback = document.createElement("div");
        feedback.className = `quiz-feedback quiz-feedback-${type}`;
        feedback.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 10000;
            max-width: 350px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            white-space: pre-line;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;

        switch(type) {
            case 'success': feedback.style.background = '#10b981'; break;
            case 'error': feedback.style.background = '#ef4444'; break;
            case 'info': feedback.style.background = '#001f77'; break;
        }

        feedback.textContent = message;
        document.body.appendChild(feedback);

        setTimeout(() => feedback.style.transform = 'translateX(0)', 10);

        setTimeout(() => {
            feedback.style.transform = 'translateX(100%)';
            setTimeout(() => feedback.remove(), 300);
        }, 4000);
    }

    function removeFeedback() {
        document.querySelectorAll('.quiz-feedback').forEach(el => el.remove());
    }

    // Event listeners
    submitButton.addEventListener("click", function() {
        if (this.textContent === "Next Question") {
            nextQuestion();
        } else if (this.textContent === "Restart Quiz") {
            restartQuiz();
        } else {
            checkAnswer();
        }
    });

    if (showAnswerButton) {
        showAnswerButton.addEventListener("click", showAnswer);
    }

    answerInput.addEventListener("keypress", function(event) {
        if (event.key === "Enter" && !answerInput.disabled) {
            if (submitButton.textContent === "Submit Answer") {
                checkAnswer();
            } else if (submitButton.textContent === "Next Question") {
                nextQuestion();
            }
        }
    });

    updateScore();
});
