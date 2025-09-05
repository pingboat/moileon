/* ==================================================
   QUIZ LOGIC (using external JSON file)
   ================================================== */

document.addEventListener("DOMContentLoaded", function () {
    let questions = [];
    let currentQuestionIndex = 0;
    let score = 0;

    const questionElement = document.getElementById("question");
    const answerInput = document.getElementById("answer");
    const submitButton = document.getElementById("submit");
    const feedbackElement = document.getElementById("feedback");
    const nextButton = document.getElementById("next");
    const scoreElement = document.getElementById("score");

    // Load questions from JSON file
    fetch("/data/questions.json")
        .then(response => response.json())
        .then(data => {
            questions = data;
            showQuestion();
        })
        .catch(error => {
            console.error("Error loading quiz questions:", error);
            questionElement.textContent = "⚠️ Failed to load quiz questions.";
        });

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
});
