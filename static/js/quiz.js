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
    console.log("Question element:", questionElement);
    console.log("Answer input:", answerInput);
    console.log("Submit button:", submitButton);
    console.log("Score element:", scoreElement);

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

    function checkAnswer() {
        const userAnswer = answerInput.value.trim().toLowerCase();
        if (!userAnswer) return;

        const currentQuestion = questions[currentQuestionIndex];
        
        // Handle both string and array answers
        let correctAnswers = [];
        if (Array.isArray(currentQuestion.answer)) {
            correctAnswers = currentQuestion.answer.map(ans => ans.toLowerCase());
        } else {
            correctAnswers = [currentQuestion.answer.toLowerCase()];
        }

        const isCorrect = correctAnswers.some(answer => userAnswer === answer);

        if (isCorrect) {
            showFeedback("✅ Correct!", "correct");
            score++;
        } else {
            const correctAnswer = Array.isArray(currentQuestion.answer) 
                ? currentQuestion.answer[0] 
                : currentQuestion.answer;
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
        
        const feedback = document.createElement("div");
        feedback.className = "quiz-feedback";
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
        `;

        switch(type) {
            case 'correct':
                feedback.style.background = '#10b981';
                break;
            case 'incorrect':
                feedback.style.background = '#ef4444';
                break;
            case 'info':
                feedback.style.background = '#001f77';
                break;
            case 'complete':
                feedback.style.background = '#10b981';
                break;
        }

        feedback.textContent = message;
        document.body.appendChild(feedback);

        setTimeout(() => feedback.remove(), 4000);
    }

    function clearFeedback() {
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
