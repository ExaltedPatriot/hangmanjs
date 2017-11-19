// File: Hangman.js
// This file contains the main game for hangman game
//
//TODO: split to other files for neater code, JS/nodeJS implementation
//TODO: figure out import/export??? Chrome support?
//TODO: node.js move variables to another file? related to import
//TODO: change implementation from Array to more flexibile data type (DB? dictionary.com/oxford is better query?)
//TODO: Move <script> call to <head> (best practice), currently at end for html elements to be created
//TODO: Add settings, # of guesses, sort guessed letters etc.... languages?
//TODO: Add comments through out
//TODO: Add stats for previous games, would need cookies to deal with page refresh (i.e. external file), could also change the way resets are handled currently
//TODO: Make prettier with Angular/NodeJS/manually? multiple types = more experience

// Lexicon of words that can be selected to play hangman with
let listOfWords = ['BOUY',
'COMPUTER',
'CONNOISSUER',
'DEHYDRATE',
'FUZZY',
'HUBUB',
'KEYHOLE',
'QUAGMIRE',
'SLITHER',
'ZIRCON']

// Word vairable for hangman, what the player is guessing
const word = pickWord(listOfWords);
//const word = "ASDF";
// Variable to display what correct guesses have been made
let wordState = [];
// Variable to track what letters have been guessed so far (correct and incorrect)
let lettersGuessed = [];
// Number of guesses remaining (cant change without impacting drawing of hangman, rest of game will work)
let guessesRemaining = 6;

// Tells user how long their word is
let wordLengthText = document.getElementById("wordLengthParagraph");
wordLengthText.innerHTML = 'Your word is ' + word.length + ' characters long';
updateWordStatus();
updateGameDisplay();

// Function process the player input (called by enter key or clicking submit button)
function processGuess() {
  let userGuess = document.getElementById("userGuessBox").value;  // Get value from text box
  document.getElementById("userGuessBox").value = null;           // Clear text box
  try {                                                           // Try to process user input and update game state and display,
    userGuess = cleanGuess(userGuess);                            // functions that do not throw exceptions are here to
    updateLettersGuessed(userGuess);                              // not be triggered if user input is incorrect
    updateWordStatus(userGuess);
    updateGameDisplay();
  } catch (e) {                                                   // Catch execptions, display error
    userGuess = 'error';
    console.log(e.message, e.name);
  }
}

// Function called upon keypressed while focus is on text box.
// Main purpose is to catch enter key and call processGuess(), ignoring other keypresses
function keyPressed(event) {
  let key = event.keyCode;
  if(key === 13) {
   processGuess();
  }
}

// Function update game state and display, checks for win/loss condition
function updateGameDisplay() {
  let wordCompletionState = document.getElementById("wordCompletionStateParagraph");
  let gameStateText = document.getElementById("gameStateParagraph");
  let lettersGuessedText = document.getElementById("lettersGuessedParagraph");
  let hangmanImg = document.getElementById("hangmanPicture");
  hangmanImg.src = 'imgs/hms' + guessesRemaining + '.png'                       // Draw hangman using guessesRemaining
  lettersGuessedText.innerHTML = 'So far you have used: ' + lettersGuessed.join(' ');
  if(wordState.join('') === word.toString()) {                                  //Check for win
    wordCompletionState.innerHTML = 'Your word is now ' + wordState.join(' ');
    gameStateText.innerHTML = 'You are the big winner have a sandwich';
    restartGame();
  } else if(guessesRemaining <= 0) {                                            //Check for loss
    gameStateText.innerHTML = 'You LOSE!';
    restartGame();
  } else {                                                                      //Otherwise continue
    wordCompletionState.innerHTML = 'Your word is now ' + wordState.join(' ');
    gameStateText.innerHTML = 'You have ' + guessesRemaining + ' guesses remaining';
  }
}
//Function to select word at random from list of words passed to function (as array at this point)
function pickWord(wordList) {
   return wordList[Math.floor(Math.random() * wordList.length)]
}

//Function to check player guess against word
function updateWordStatus(playerGuess) {
  for(let i = 0; i < word.length; i++){               //Loop to set word state to proper character (a-z or _)
    if(word[i] === playerGuess) {                     //Check guess for match in word
      wordState[i] = word[i];                         //If match then set wordstate to letter from word
    } else if (/[A-Z]/.test(wordState[i])) {          //Dont wipe out letters already guessed
    } else {                                          //Set unguessed places to underscore
      wordState[i] = '_';
    }
  }
  if(word.search(playerGuess) === -1) {               //Search for guess
    guessesRemaining--;                               //Decrement remaining guesses
  }
}

// Cleans player input, throws exceptions for invalid entries
function cleanGuess(guess) {
  guess = guess.toUpperCase();                         //Converts guess to uppercase (assumes word is also uppercase)
  if(guess.length != 1) {                              //Checks for more than one character
    throw new LengthException('Invalid Length');
  }
  if(!/[A-Z]/.test(guess[0])) {                        //Checks for non alpha character
    throw new TypeException('Invalid Character');
  }
  if (lettersGuessed.toString().search(guess) !== -1) {   //Checks that the letter has not already been guessed
    throw new DuplicateGuessException('Duplicate Guess', guess);
  }
  return guess;                                         //Returns guess, now in uppercase
}

//Function to add player guesses to list of already guessed letters
function updateLettersGuessed(guess) {
  lettersGuessed.push(guess);                                 //Adds letter to array
  lettersGuessed = Array.from(new Set(lettersGuessed));       //Creates a Set object to remove duplicates (same letter should not be allowed more than once)
//  lettersGuessed.sort();                                    //Can uncomment to turn on sorting of letters already guessed (could have setting)
}

//Function to reset game, creates HTML objects and sets, properties
function restartGame() {
  const restartButton = document.createElement("BUTTON");
  const restartText = document.createTextNode("Play Again?");
  restartButton.appendChild(restartText);
  restartButton.setAttribute("onclick", "location.reload()");       // location.reload() reloads the page, effectively reseting game (simpler than full game loop as it is not necessary in this implementation)
  document.getElementById("restartDiv").appendChild(restartButton);
}

//Exception for more than one character in text box
function LengthException(message) {
  this.message = message;
  this.name = 'LengthException';
  alert("Please enter one letter from A to Z");
}

//Exception for non alpha character
function TypeException(message) {
  this.message = message;
  this.name = 'TypeException';
  alert("Please enter alpha character from A to Z");
}

//Exception for entering a letter already guessed
function DuplicateGuessException(message, guess) {
  this.message = message;
  this.name = 'DuplicateGuessException';
  alert('You already guessed ' + guess + ' try a new letter');
}
