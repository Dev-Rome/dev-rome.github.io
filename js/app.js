"use strict";

// initailize variables
const score = document.querySelector(".game__score-number");
const modal = document.querySelector(".modal__container");
const modalBackground = document.querySelector(".modal__content")
const modalTitle = document.querySelector(".modal__title");
const modalText = document.querySelector(".modal__text");
const startButton = document.querySelector(".start__btn");
const resetButton = document.querySelector(".reset__btn");
const questionNumber = document.querySelector(".question__number-number");
const questionText = document.querySelector(".question");
const questionTimer = document.querySelector(".question__timer-number");
const lives = document.querySelector(".lives__container");

const answerText = Array.from(document.getElementsByClassName("answer__text"));

let numberOfQuestions = 10;
let questions = [];
let allQuestions = [];
let currentQuestion = {};
let scoreGoal = 100;
let questionCounter = 0;
let acceptingAnswers = false;
let pauseTimer = false;
let playerScore, timeValue;

const url = "https://opentdb.com/api.php?amount=50&category=15&type=multiple";
fetch(url)
  .then((response) => response.json())
  .then((data) => {
    questions = data.results.map((questions) => {
      const triviaQuestion = {
        question: questions.question,
      };
      const answerArray = [...questions.incorrect_answers];
      triviaQuestion.answer = Math.floor(Math.random() * 4) + 1;
      answerArray.splice(
        triviaQuestion.answer - 1,
        0,
        questions.correct_answer
      );
      answerArray.forEach((answer, index) => {
        triviaQuestion["answer" + (index + 1)] = answer;
      });
      return triviaQuestion;
    });
    startGame();
  })
  .catch((error) => console.log(error));

function startGame() {
  if (modal.classList.contains("hide")) {
    pauseTimer = false;
  } else {
    pauseTimer = true;
  }
  allQuestions = [...questions];
  playerScore = 0;
  questionCounter = 1;
  timeValue = 90;
  getNewQuestion();
  checkAnswer();
  gameTimer();
}

function getNewQuestion() {
  if (allQuestions.length === 0 || questionCounter >= numberOfQuestions) {
    endGame();
  }
  
  questionNumber.innerHTML = questionCounter;
  const currentQuestionIndex = Math.floor(Math.random() * allQuestions.length);
  currentQuestion = allQuestions[currentQuestionIndex];
  questionText.innerHTML = currentQuestion.question;
  answerText.forEach((answer, index) => {
    answer.innerHTML = currentQuestion["answer" + (index + 1)];
  });
  allQuestions.splice(currentQuestionIndex, 1);
  acceptingAnswers = true;
  questionCounter++;
}

function checkAnswer() {
  answerText.forEach((answer) => {
    answer.addEventListener("click", (e) => {
      if (!acceptingAnswers) {
        return;
      }
      acceptingAnswers = false;
      const selectedAnswer = e.target;
      const selectedAnswerIndex = selectedAnswer.dataset["number"];
      const classToApply =
        selectedAnswerIndex == currentQuestion.answer ? "correct" : "incorrect";
      if (classToApply === "correct") {
        playerScore += 10;
        score.innerHTML = playerScore;
        answer.style.backgroundColor = "correct";
        answer.innerHTML = "Correct!";
      } else {
        answer.innerHTML = "Incorrect!";
        displayBrokenHeart();
      }
      selectedAnswer.parentElement.classList.add(classToApply);
      setTimeout(() => {
        selectedAnswer.parentElement.classList.remove(classToApply);
        getNewQuestion();
      }, 1000);
    });
  });
  checkWinner();
}

function checkWinner() {
  if (playerScore === scoreGoal) {
    modal.classList.remove("hide");
    modalBackground.style.backgroundColor = "#40c057";
    modalTitle.innerHTML = "You Win!";
    modalText.innerHTML = `Your final score is ${playerScore} out of ${scoreGoal}`;
    modalTitle.style.color = "#f8f9fa";
    modalText.style.color = "#f8f9fa";
    startButton.classList.add("hide");
    resetButton.classList.remove("hide");
  }
}

function displayBrokenHeart() {
    const heart = document.createElement("i");
    heart.classList.add("fa", "fa-heart-broken", "broken");
    lives.appendChild(heart);
    if (lives.children.length === 3) {
        setTimeout(endGame, 700);
    }
}

function gameTimer() {
  if (pauseTimer) return;
  if (timeValue <= 0) {
    endGame();
  } else if (timeValue > 0) {
    timeValue--;
    questionTimer.innerHTML = timeValue;
    setTimeout(gameTimer, 1000);
  }
}

function endGame() {
    pauseTimer = true;
    modal.classList.remove("hide");
    modalTitle.innerHTML = "Game Over";
    modalText.innerHTML = `Your final score is ${playerScore} out of ${scoreGoal}`;
    startButton.classList.add("hide");
    resetButton.classList.remove("hide");
}

startButton.addEventListener("click", () => {
  modal.classList.add("hide");
  startGame();
});

resetButton.addEventListener("click", () => {
    modal.classList.add("hide");
    lives.innerHTML = "";
    startGame();
});
