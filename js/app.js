"use strict";

// dom elements
const categoryTitle = document.querySelector(".category__title");
const categoryList = document.querySelector(".category__list");
const score = document.querySelector(".score");
const timer = document.querySelector(".time");
const question = document.querySelector(".question");
const questionNumber = document.querySelector(".question__number");
const modal = document.querySelector(".modal__window");
const overlay = document.querySelector(".overlay");
const startGameButton = document.querySelector("#start__game");

// using Array.from to convert nodelist to array
const answerText = Array.from(document.getElementsByClassName("answer__text"));

// dom elements for categorie buttons
const genralKnowledge = document.getElementById("general__button");
const sports = document.getElementById("sports__button");
const entertainment = document.getElementById("entertainment__button");
const science = document.getElementById("science__button");
const history = document.getElementById("history__button");
const reset = document.getElementById("reset__button");

// game variables
let numberOfQuestions = 10;
let questions = [];
let allQuestions = [];
let currentQuestion = {};
let questionCounter = 0;
let acceptingAnswers = false;
let pauseTimer = false;
let playerScore, timeValue;

// function to call data from API
function triviaAPI(id) {
  const url = `https://opentdb.com/api.php?amount=50&category=${id}&type=multiple`;
  fetch(url)
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      questions = data.results.map((question) => {
        const triviaQuestion = {
          question: question.question,
        };
        //   using spread operator to create array of incorrect answers
        const answerArray = [question.correct_answer, ...question.incorrect_answers];
        // using mathfloor with mathrandom to get random number between 0 and 3
        triviaQuestion.answer = Math.floor(Math.random() * 4) + 1;
        // answerArray.forEach is used to loop through the array and set the answer text to the answer array
        answerArray.forEach((answer, index) => {
          triviaQuestion["answer" + (index + 1)] = answer;
        });
        return triviaQuestion;
      });
      startGame();
    })
    .catch((err) => {
      console.log(err, "Something went wrong");
    });
}

// foreach to loop throught answer and add correct class
answerText.forEach((answer) => {
  // add event listener to each answer
  answer.addEventListener("click", (e) => {
    // if accepting answers is true
    // and if the answer clicked is the correct answer
    // add right class to answer
    // add to player score
    // if wrong answer, add wrong class to answer
    if (!acceptingAnswers) return;
    acceptingAnswers = false;
    const userChoice = e.target;
    const userAnswer = userChoice.dataset["number"];
    const correctOrIncorrect =
      userAnswer == currentQuestion.answer ? "right" : "wrong";
    if (correctOrIncorrect === "right") {
      playerScore += 10;
      score.innerHTML = playerScore;
    }
    userChoice.parentElement.classList.add(correctOrIncorrect);
    setTimeout(() => {
      userChoice.parentElement.classList.remove(correctOrIncorrect);
      getNewQuestion();
    }, 1000);
  });
});

// general knowledge api
function genralKnowledgeAPI() {
  triviaAPI(9);
}

// sports api
function sportsApi() {
  triviaAPI(21);
}

// entertainment api
function entertainmentAPI() {
  triviaAPI(11);
}

// science api
function scienceAPI() {
  triviaAPI(17);
}

// history api
function historyAPI() {
  triviaAPI(23);
}

// function to start game
function startGame() {
  questionCounter = 0;
  playerScore = 0;
  timeValue = 45;
  allQuestions = [...questions];
  modal.classList.add("hide");
  overlay.classList.add("hide");
  pauseTimer = false;
  gameTimer();
  getNewQuestion();
}

// function to get new question
function getNewQuestion() {
  // if there are no more questions, end game
  // if questionCounter is greater than equal to number of questions, end game
  if (allQuestions.length === 0 || questionCounter >= numberOfQuestions) {
    endGame();
  }
  questionCounter++;
  questionNumber.innerHTML = `${questionCounter} / ${numberOfQuestions}`;
  // get random question from all questions array and set current question to that question
  const currentQuestionIndex = Math.floor(Math.random() * allQuestions.length);
  currentQuestion = allQuestions[currentQuestionIndex];
  question.innerHTML = currentQuestion.question;
  // loop through answer letters and set text to answer text
  answerText.forEach((answer) => {
    const number = answer.dataset["number"];
    answer.innerHTML = currentQuestion["answer" + number];
  });
  // remove question from array
  allQuestions.splice(currentQuestionIndex, 1);
  acceptingAnswers = true;
}

// function game timer
function gameTimer() {
  if (pauseTimer) return;
  if (timeValue <= 0) {
    endGame();
  } else if (timeValue > 0) {
    timeValue--;
    timer.innerHTML = timeValue;
    setTimeout(gameTimer, 1000);
  }
}

// function to end game
// or if user wants to pick a new category
function endGame() {
  acceptingAnswers = false;
  pauseTimer = true;
  modal.classList.remove("hide");
  overlay.classList.remove("hide");
  categoryTitle.innerHTML = `Game Over - Your Score is ${playerScore} out of 100 points`;
  categoryList.classList.add("hide");
  reset.classList.remove("hide");
}

function resetGame() {
  playerScore = 0;
  score.innerHTML = playerScore;
  questionCounter = 0;
  timeValue = 45;
  timer.innerHTML = timeValue;
  reset.classList.add("hide");
  categoryList.classList.remove("hide");
  categoryTitle.innerHTML = "Select a Category";
  allQuestions = [...questions];
  pauseTimer = true;
  getNewQuestion();
}

// button event listeners to select category
genralKnowledge.addEventListener("click", genralKnowledgeAPI);
sports.addEventListener("click", sportsApi);
entertainment.addEventListener("click", entertainmentAPI);
science.addEventListener("click", scienceAPI);
history.addEventListener("click", historyAPI);
reset.addEventListener("click", resetGame);
