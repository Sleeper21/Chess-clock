const player1Btn = document.getElementById("player1");
const player2Btn = document.getElementById("player2");

// Moves counter elements
const moveCounter1 = document.getElementById("player1-moves");
const moveCounter2 = document.getElementById("player2-moves");

// Settings icons
const resetIcon = document.getElementById("reset-icon");
const startPauseIcon = document.getElementById("start-icon");

//Select display elements
const hours1 = document.getElementById("hours1");
const minutes1 = document.getElementById("minutes1");
const seconds1 = document.getElementById("seconds1");

let isGameRunning = false;
let isPaused = true;

let isClock1Running = false;
let isClock2Running = false;

let currentFormat 
let currentIncrement
let timer
let currentPlayer
let startTime 
let countdown     
let timeRemaining
let passedTime = 0;
let hours = 0;
let minutes = 0;
let seconds = 0;

startPauseIcon.addEventListener("click", () => {
    if ( !isGameRunning ){
        startGame();
        toggleStartPauseIcon("/images/pause.png")
    } else if ( isGameRunning ){
        pauseClock();
        toggleStartPauseIcon("/images/start.png");
        
    };
});


player2Btn.addEventListener("click", startGame);


// Functions
function setTimeFormat(){
    //Set time format
    currentFormat = new Date().setMinutes(new Date().getMinutes() + 3);
    currentIncrement = new Date().setSeconds(new Date().getSeconds() + 2);
};

function startGame(){
    // Start new game
    if ( !isGameRunning && isPaused) {

        isClock1Running = true;
        player2Btn.disabled = true;
        player1Btn.disabled = false;

        setTimeFormat();
        toggleStartPauseIcon("/images/pause.png");

        startClock1();
        //Run the startClock function every second
        timer = setInterval(startClock1, 1000);

        console.log(timer)

        //If the game was paused
    } else if ( isGameRunning && isPaused ) {

        resumeGame();
        
    }
}

function startClock1(){
    // Start new game clock
    if ( !isGameRunning ) {

        isGameRunning = true;
        isPaused = false;

        startTime = new Date(currentFormat).getTime();
        countdown = new Date().getTime();

        timeRemaining = (startTime - countdown) / 1000; // default is shown in miliseconds, so divide by 1000 to show the seconds.
        
        //Calculate numbers to display
        hours = Math.floor(timeRemaining / (60 * 60));
        minutes = Math.floor((timeRemaining % (60 * 60)) / 60);
        seconds = Math.floor(timeRemaining % 60);

        //Display the numbers -- set number as string and then add a second digit "0" at start.
        hours > 0 ? hours1.textContent = String(hours).padStart(2, "0") + ":" : "";
        minutes1.textContent = String(minutes).padStart(2, "0") + ":"; 
        seconds1.textContent = String(seconds).padStart(2, "0");

        //If game was paused - resume previous clock
    } else if ( isGameRunning && isPaused ) {
        
        isPaused = false;

        startTime = startTime - countdown;
        

        countdown = new Date().getTime();
        timeRemaining = (startTime - countdown) / 1000;
    }

    

};

function pauseClock(){

    clearInterval(timer);
    
    isPaused = true;
    toggleStartPauseIcon("/images/start.png");
    player1Btn.disabled = true;
    player2Btn.disabled = true;

    startPauseIcon.addEventListener("click", startGame);
};

function resumeGame(){
    
    isClock1Running = true;
    player2Btn.disabled = true;
    player1Btn.disabled = false;
    toggleStartPauseIcon("/images/pause.png");
    startClock1();
};

function toggleStartPauseIcon(iconPath){
     
    startPauseIcon.setAttribute("src", iconPath);   
}
