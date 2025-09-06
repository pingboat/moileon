/* ==================================================
QUIZ LOGIC (using external JSON file)
================================================== */

document.addEventListener(“DOMContentLoaded”, function () {
let questions = [];
let currentQuestionIndex = 0;
let score = 0;
let quizCompleted = false;

```
// Updated selectors to match your HTML structure
const questionElement = document.getElementById("question-display");
const answerInput = document.getElementById("answer-input");
const submitButton = document.querySelector(".submit-btn");
const showAnswerButton = document.querySelector(".next-btn");
const scoreElement = document.getElementById("score-display");

// Check if quiz elements exist on this page
if (!questionElement || !answerInput || !submitButton) {
    return; // Exit if not on a quiz page
}

// Load questions from JSON file
fetch("/data/questions.json")
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        questions = shuffleArray(data); // Shuffle questions for variety
        showQuestion();
    })
    .catch(error => {
        console.error("Error loading quiz questions:", error);
        questionElement.textContent = "⚠️ Failed to load quiz questions. Please check if /data/questions.json exists.";
    });

// Shuffle array function
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
    submitButton.className = "submit-btn";
    submitButton.disabled = false;
    
    showAnswerButton.textContent = "Show me the answer";
    showAnswerButton.disabled = false;

    // Remove any existing feedback
    removeFeedback();
}

function checkAnswer() {
    if (quizCompleted || !answerInput.value.trim()) {
        return;
    }

    const userAnswer = answerInput.value.trim().toLowerCase();
    const currentQuestion = questions[currentQuestionIndex];
    
    // Support multiple correct answers
    const correctAnswers = Array.isArray(currentQuestion.answer) 
        ? currentQuestion.answer.map(ans => ans.toLowerCase())
        : [currentQuestion.answer.toLowerCase()];

    const isCorrect = correctAnswers.some(answer => userAnswer === answer);

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
    
    // Change submit button to next button
    submitButton.textContent = "Next Question";
    submitButton.className = "next-btn";
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
    scoreElement.textContent = `Score: ${score}`;
}

function finishQuiz() {
    questionElement.textContent = "🎉 Quiz completed!";
    scoreElement.textContent = `Final Score: ${score}/${questions.length}`;
    
    answerInput.style.display = "none";
    submitButton.textContent = "Restart Quiz";
    submitButton.className = "submit-btn";
    submitButton.onclick = restartQuiz;
    
    showAnswerButton.style.display = "none";
    quizCompleted = true;

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
    showAnswerButton.style.display = "inline-block";
    
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

    // Set background color based on type
    switch(type) {
        case 'success':
            feedback.style.background = '#10b981';
            break;
        case 'error':
            feedback.style.background = '#ef4444';
            break;
        case 'info':
            feedback.style.background = '#001f77'; // Match your theme
            break;
    }

    feedback.textContent = message;
    document.body.appendChild(feedback);

    // Animate in
    setTimeout(() => feedback.style.transform = 'translateX(0)', 10);

    // Remove after delay
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

showAnswerButton.addEventListener("click", showAnswer);

// Allow Enter key to submit answer
answerInput.addEventListener("keypress", function(event) {
    if (event.key === "Enter" && !answerInput.disabled) {
        if (submitButton.textContent === "Submit Answer") {
            checkAnswer();
        } else if (submitButton.textContent === "Next Question") {
            nextQuestion();
        }
    }
});

// Initialize score display
updateScore();
```

});
