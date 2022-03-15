"use strict"

// initial variables
const heart = document.querySelector('.heart');
const heartBreak = document.querySelector('.heart__broken');
const score = document.querySelector('.score');
const timer = document.querySelector('.time');
const question = document.querySelector(".question");
const answerText = Array.from(document.getElementsByClassName("answer__text"));

// initial variables for game start
let questionCounter = 1;
let scoreValue = 0;
let timeValue = 35;
let interval;

function triviaApi() {
    const url = "https://opentdb.com/api.php?amount=10&type=multiple";
    fetch(url)
        .then(response => response.json())
        .then(data => {
            data.results.map(questions => {
                question.innerHTML = questions.question;
                // variable to store the correct answer
                // incorrect answers
                // and store them in an array using the spread operator
                const incorrectAnswers = questions.incorrect_answers;
                const correctAnswer = questions.correct_answer;
                const answerArray = [ ...incorrectAnswers];

                // set answer to random position using Math.floor and Math.random
                questions.answer = Math.floor(Math.random() * 3) + 1;
                // answerArray.splice to insert correct answer into random position   
              answerArray.splice(questions.answer - 1, 0, correctAnswer);
                // answerArray.forEach to loop through answerArray and add to DOM
              answerArray.forEach((answer, index) => {
                questions['answer' + (index + 1)] = answer;
                answerText[index].innerHTML = answer;
              });
              console.log(answerArray)  
            })
        })
        .catch(error => console.log(error));
}
triviaApi()