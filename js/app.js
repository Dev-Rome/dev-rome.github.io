"use strict";

// dom elements
const welcomeTitle = document.querySelector(".welcome__title");
const welcomeText = document.querySelector(".welcome__text");
const score = document.querySelector(".score");
const timer = document.querySelector(".time");
const question = document.querySelector(".question");
const questionNumber = document.querySelector(".question__number");
const answerText = Array.from(document.getElementsByClassName("answer__text"));
const modal = document.querySelector(".modal__window");
const overlay = document.querySelector(".overlay");
const startGameButton = document.querySelector("#start__game");
const restartGameButton = document.querySelector("#restart__game");

// initial game variables
const correctScore = 10;
const numberOfQuestions = 10;
let questions = [];
let allQuestions = [];
let currentQuestion = {};
let questionCounter = 0;
let acceptingAnswers = false;
let pauseTimer = false;
let finalScore = 100;
let playerScore, timeValue;

// api call to fetch trivia game questions and answers
const url = "https://opentdb.com/api.php?amount=50&type=multiple";
fetch(url)
  .then((res) => {
    return res.json();
  })
  .then((data) => {
    questions = data.results.map((question) => {
      const triviaQuestion = {
        question: question.question,
      };

      const answerArray = [...question.incorrect_answers];
      triviaQuestion.answer = Math.floor(Math.random() * 4) + 1;
      answerArray.splice(triviaQuestion.answer - 1, 0, question.correct_answer);

      answerArray.forEach((answer, index) => {
        triviaQuestion["answer" + (index + 1)] = answer;
      });

      return triviaQuestion;
    });
    gameStart();
  })
  .catch((err) => {
    console.log(err, "Something went wrong");
  });

// start game function
function gameStart() {
  questionCounter = 0;
  playerScore = 0;
  timeValue = 60;
  allQuestions = [...questions];
  startGameButton.addEventListener("click", () => {
    modal.classList.add("hide");
    overlay.classList.add("hide");
    gameTimer();
    getNewQuestion();
  });
}

// add score to player score
function addScore(num) {
  playerScore += num;
  score.innerHTML = playerScore;
}

// function to get new question
// if there are no more questions, end game
// if there are more questions, get new question
function getNewQuestion() {
  if (allQuestions.length === 0 || questionCounter >= numberOfQuestions) {
    endGame();
  }
  questionCounter++;
  questionNumber.innerHTML = `${questionCounter} / ${numberOfQuestions}`;

  const currentQuestionIndex = Math.floor(Math.random() * allQuestions.length);
  currentQuestion = allQuestions[currentQuestionIndex];
  question.innerHTML = currentQuestion.question;

  answerText.forEach((answer) => {
    const number = answer.dataset["number"];
    answer.innerHTML = currentQuestion["answer" + number];
  });
  // remove question from array
  allQuestions.splice(currentQuestionIndex, 1);
  acceptingAnswers = true;
}

// game timer function
// decrement timer every second
// if timer reaches 0, end game
function gameTimer() {
  const timerInterval = setInterval(() => {
    if (!pauseTimer) {
      timeValue--;
      timer.innerHTML = timeValue;
    }
    if (timeValue === 0) {
      endGame();
    }
  }, 1000);
}

function endGame() {
  acceptingAnswers = false;
  pauseTimer = true;
  modal.classList.remove("hide");
  overlay.classList.remove("hide");
  welcomeTitle.innerHTML = "Game Over";
  welcomeText.innerHTML = `You got ${playerScore} out of ${finalScore} points!`;
  startGameButton.classList.add("hide");
  restartGameButton.classList.remove("hide");
}

// restart game function
// set score back to 00
// set question counter back to 1
// set timer back to 60 seconds and pause timer
// when start game button is clicked start timer again
// get new question
// hide restart game button
// show start game button
// hide modal
// hide overlay
function gameRestart() {
    playerScore = 0;
    score.innerHTML = playerScore;
    questionCounter = 0;
    timeValue = 60;
    pauseTimer = false;
    startGameButton.classList.remove("hide");
    restartGameButton.classList.add("hide");
    modal.classList.add("hide");
    overlay.classList.add("hide");
    getNewQuestion();
}



answerText.forEach((answer) => {
  answer.addEventListener("click", (e) => {
    if (!acceptingAnswers) return;
    acceptingAnswers = false;
    const userChoice = e.target;
    const userAnswer = userChoice.dataset["number"];
    const correctOrIncorrect =
      userAnswer == currentQuestion.answer ? "right" : "wrong";
    if (correctOrIncorrect === "right") {
      addScore(correctScore);
    }
    userChoice.parentElement.classList.add(correctOrIncorrect);
    setTimeout(() => {
      userChoice.parentElement.classList.remove(correctOrIncorrect);
      getNewQuestion();
    }, 1000);
  });
});

restartGameButton.addEventListener("click", gameRestart);
