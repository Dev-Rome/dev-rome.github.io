"use strict"

// initial variables
const heart = document.querySelector('.heart');
const heartBreak = document.querySelector('.heart__broken');
const question = document.querySelector(".question");
const form = document.querySelector('form');
const submitName = document.querySelector('.submit__name');
const userName = document.getElementById("name");

function message(message) {
  question.textContent = message;
}

function startGame() {
    message("Welcome to Trivia please tell me your name?");
    submitName.addEventListener('click', submitUserName);
}

function submitUserName(e) {
    if (userName.value === "") {
        e.preventDefault();
        message("Please enter your name!");
    } else {
        e.preventDefault()
        message(`Welcome ${userName.value}! Please select a category!`);
        form.style.display = "none";
        submitName.style.display = "none";
    }
}

startGame()