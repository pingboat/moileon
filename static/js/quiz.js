/* ==================================================
   QUIZ LOGIC
   ================================================== */

document.addEventListener("DOMContentLoaded", function () {
    const questions = [
        {
            question: "Who was the first Prime Minister of India?",
            answer: "Jawaharlal Nehru",
            explanation: "Jawaharlal Nehru was the first Prime Minister of independent India (1947–1964)."
        },
        {
            question: "What is the capital of France?",
            answer: "Paris",
            explanation: "Paris has been the capital of France since the 10th century."
        },
        {
            question: "Which planet is known as the Red Planet?",
            answer: "Mars",
            explanation: "Mars is called the Red Planet due to its reddish appearance caused by iron oxide."
        }
    ];

    let currentQuestionIndex = 0;
    let score = 0;

    const questionElement = document.getElementById("question");
    const answerInput = document.getElementById("answer");
    const submitButton = document.getElementById("submit");
    const feedbackElement = document.getElementById("feedback");
    const nextButton = document.getElementById("next");
    const scoreElement = document.getElementById("score");

    function showQuestion() {
        feedbackElement.innerHTML = "";
        questionElement.textContent = questions[currentQuestionIndex].question;
        answerInput.value = "";
    }

    function checkAnswer() {
        const userAnswer = answerInput.value.trim().toLowerCase();
        const correctAnswer = questions[currentQuestionIndex].answer.toLowerCase();

        if (userAnswer === correctAnswer) {
            feedbackElement.innerHTML = `<div class="feedback-correct">✅ Correct!</div>`;
            score++;
        } else {
            feedbackElement.innerHTML = `
                <div class="feedback-incorrect">❌ Incorrect. The correct answer is: ${questions[currentQuestionIndex].answer}</div>
                <div class="feedback-explanation">💡 ${questions[currentQuestionIndex].explanation}</div>
            `;
        }

        scoreElement.textContent = `Score: ${score}/${questions.length}`;
    }

    submitButton.addEventListener("click", checkAnswer);

    nextButton.addEventListener("click", () => {
        currentQuestionIndex++;
        if (currentQuestionIndex < questions.length) {
            showQuestion();
        } else {
            feedbackElement.innerHTML = `<div class="feedback-correct">🎉 Quiz completed! Final Score: ${score}/${questions.length}</div>`;
            submitButton.disabled = true;
            nextButton.disabled = true;
        }
    });

    // Start quiz
    showQuestion();
});
