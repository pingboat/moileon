/* ==================================================
   QUIZ LOGIC (using embedded JSON data)
   ================================================== */

document.addEventListener("DOMContentLoaded", function () {
    let questions = [];
    let currentQuestionIndex = 0;
    let score = 0;

    // Match your current HTML structure exactly
    const questionElement = document.getElementById("question-display");
    const answerInput = document.getElementById("answer-input");
    const submitButton = document.querySelector(".submit-btn");
    const nextButton = document.querySelector(".next-btn");
    const scoreElement = document.getElementById("score-display");

    console.log("Quiz initialization started");

    // Check if we're on a quiz page
    if (!questionElement || !answerInput || !submitButton || !scoreElement) {
        console.log("Quiz elements not found - not on quiz page");
        return;
    }

    // Load quiz data from embedded script tag
    const quizDataElement = document.getElementById("quiz-data");
    if (quizDataElement) {
        try {
            questions = JSON.parse(quizDataElement.textContent);
            console.log("Loaded questions from embedded data:", questions.length);
            questions = shuffleArray(questions);
            showQuestion();
        } catch (error) {
            console.error("Error parsing quiz data:", error);
            questionElement.textContent = "⚠️ Failed to load quiz questions.";
        }
    } else {
        console.error("Quiz data element not found");
        questionElement.textContent = "⚠️ Quiz data not found.";
    }

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
        console.log("Showing question:", currentQuestion.question);
        
        questionElement.textContent = currentQuestion.question;
        answerInput.value = "";
        answerInput.disabled = false;
        answerInput.focus();

        // Reset buttons
        submitButton.textContent = "Submit Answer";
        submitButton.disabled = false;
        nextButton.textContent = "Show me the answer";
        nextButton.disabled = false;

        // Clear any existing feedback
        clearFeedback();
    }

    function getCorrectAnswers(question) {
        // Handle both string and array answers
        if (Array.isArray(question.answer)) {
            return question.answer;
        } else if (typeof question.answer === 'string') {
            return [question.answer];
        } else {
            console.error("Invalid answer format:", question.answer);
            return ["unknown"];
        }
    }

    function getDisplayAnswer(question) {
        const answers = getCorrectAnswers(question);
        return answers[0]; // Return the first (primary) answer for display
    }

    function checkAnswer() {
        const userAnswer = answerInput.value.trim().toLowerCase();
        if (!userAnswer) return;

        const currentQuestion = questions[currentQuestionIndex];
        const correctAnswers = getCorrectAnswers(currentQuestion).map(ans => ans.toLowerCase());

        console.log("User answer:", userAnswer);
        console.log("Correct answers:", correctAnswers);

        const isCorrect = correctAnswers.some(answer => userAnswer === answer);

        if (isCorrect) {
            showFeedback("✅ Correct!", "correct");
            score++;
        } else {
            const correctAnswer = getDisplayAnswer(currentQuestion);
            let message = `❌ Incorrect. The correct answer is: ${correctAnswer}`;
            if (currentQuestion.explanation) {
                message += `\n💡 ${currentQuestion.explanation}`;
            }
            showFeedback(message, "incorrect");
        }

        scoreElement.textContent = score;
        answerInput.disabled = true;
        submitButton.textContent = "Next Question";
    }

    function showAnswer() {
        const currentQuestion = questions[currentQuestionIndex];
        const correctAnswer = getDisplayAnswer(currentQuestion);
        
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

    function finishQuiz() {
        questionElement.textContent = "🎉 Quiz completed!";
        const percentage = Math.round((score / questions.length) * 100);
        let message = `Final Score: ${score}/${questions.length} (${percentage}%)`;
        
        if (percentage >= 80) message += " - Excellent!";
        else if (percentage >= 60) message += " - Good job!";
        else message += " - Keep practicing!";
        
        showFeedback(message, "complete");
        
        submitButton.textContent = "Restart Quiz";
        nextButton.style.display = "none";
        answerInput.style.display = "none";
    }

    function restartQuiz() {
        currentQuestionIndex = 0;
        score = 0;
        questions = shuffleArray(questions);
        nextButton.style.display = "inline-block";
        answerInput.style.display = "block";
        clearFeedback();
        showQuestion();
    }

    function showFeedback(message, type) {
        clearFeedback();
        
        // Use alert for mobile compatibility
        alert(message);
    }

    function clearFeedback() {
        // Clear any existing feedback elements
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

    nextButton.addEventListener("click", showAnswer);

    answerInput.addEventListener("keypress", function(event) {
        if (event.key === "Enter" && !answerInput.disabled) {
            if (submitButton.textContent === "Submit Answer") {
                checkAnswer();
            } else if (submitButton.textContent === "Next Question") {
                nextQuestion();
            }
        }
    });
});
