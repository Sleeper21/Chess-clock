// Current format
let currentFormat = {
    hours: 0,
    minutes: "00",
    seconds: "10",
    increment: true,
};

let currentIncrement = {
    hours: 0,
    minutes: 0,
    seconds: 2,
};

// Player 1 clock
let currentP1Hours = "";
let currentP1Minutes = "00";
let currentP1Seconds = "10";
let p1moveCount = 0;

let clock1 = document.getElementById("player1");

//Player 2 clock
let currentP2Hours = "";
let currentP2Minutes = "00";
let currentP2Seconds = "10";
let p2moveCount = 0;

let clock2 = document.getElementById("player2");

// Nav icon settings
let resetClock = document.getElementById("reset-icon");
let startPause = document.getElementById("start-icon");
let editTime = document.getElementById("edit-icon");
let volume = document.getElementById("volume-icon");

// Swap variables
let currentPlayer = "player1";
let playerToMove = 1;
let isPaused = false; // Paused game is only when a game is running but the clocks are paused.
let isGameRunning = false;
let timer1;
let timer2;

//Update clocks display
updateClock_1_Display();
updateClock_2_Display();

// When display is clicked or pressed, start the opponent's clock
clock1.addEventListener("click", startClock2);
clock2.addEventListener("click", startClock1);

//Event listeners nav settings
resetClock.addEventListener("click", resetClock);
startPause.addEventListener("click", toggleStartPause);
//editTime.addEventListener("click", editTimeFormat);
//volume.addEventListener.("click", muteUnmute);

function updateClock_1_Display(){
    document.getElementById("hours1").textContent = currentP1Hours ;
    document.getElementById("minutes1").textContent = currentP1Minutes;
    document.getElementById("seconds1").textContent = currentP1Seconds;    
};

function updateClock_2_Display(){    
    document.getElementById("hours2").textContent = currentP2Hours;
    document.getElementById("minutes2").textContent = currentP2Minutes;
    document.getElementById("seconds2").textContent = currentP2Seconds;    
};
   

// Player 1 Clock
function startClock1(){
    //Stop the opponent's clock
    clearInterval(timer2);

    if (!isGameRunning) toggleStartPauseIcons(); //Prevents swapping icon during the game

    if (isPaused) { //Skips adding increment after press "resume clock" on that moment
        document.getElementById("minutes2").textContent = String(parseInt(currentP2Minutes)).padStart(2, '0');
        document.getElementById("seconds2").textContent = String(parseInt(currentP2Seconds)).padStart(2, '0');
    };

    // add increment to opponent's clock if current format has increment
    if ( currentFormat.increment && !isPaused ) {
        currentP2Minutes = parseInt(document.getElementById("minutes2").textContent) + parseInt(currentIncrement.minutes)
        currentP2Seconds = parseInt(document.getElementById("seconds2").textContent) + parseInt(currentIncrement.seconds)
        
        document.getElementById("minutes2").textContent = String(parseInt(currentP2Minutes)).padStart(2, '0');
        document.getElementById("seconds2").textContent = String(parseInt(currentP2Seconds)).padStart(2, '0');
    };

    //handle swap variables
    currentPlayer = "player1";
    playerToMove = 1;
    isPaused = false;
    isGameRunning = true;

    //Disable/enable buttons
    clock2.disabled = true;
    clock1.disabled = false;

    //Start countdown
    countdown();
    timer1 = setInterval(countdown, 1000);    
}

//Player 2 Clock
function startClock2(){
    //Stop the opponent's clock
    clearInterval(timer1);

    if (!isGameRunning) toggleStartPauseIcons(); //Prevents swapping icon during the game

    if (isPaused) { //Prevents adding increment after press "resume clock"
        document.getElementById("minutes1").textContent = String(parseInt(currentP1Minutes)).padStart(2, '0');
        document.getElementById("seconds1").textContent = String(parseInt(currentP1Seconds)).padStart(2, '0');
    }

    // add increment to opponent's clock if current format has increment
    if ( currentFormat.increment && !isPaused ) {
        currentP1Minutes = parseInt(document.getElementById("minutes1").textContent) + parseInt(currentIncrement.minutes)
        currentP1Seconds = parseInt(document.getElementById("seconds1").textContent) + parseInt(currentIncrement.seconds)
        
        document.getElementById("minutes1").textContent = String(parseInt(currentP1Minutes)).padStart(2, '0');
        document.getElementById("seconds1").textContent = String(parseInt(currentP1Seconds)).padStart(2, '0');
    };

    //handle swap variables
    currentPlayer = "player2";
    playerToMove = 2;
    isPaused = false;
    isGameRunning = true;

    //Disable buttons
    clock2.disabled = false;
    clock1.disabled = true;

    //Start countdown
    countdown();
    timer2 = setInterval(countdown, 1000);    
};


// Countdown function
function countdown(){

    // Player 1 Clock
    if (currentPlayer === "player1") {

        currentP1Hours = document.getElementById("hours1").textContent;
        currentP1Minutes = document.getElementById("minutes1").textContent;
        currentP1Seconds = document.getElementById("seconds1").textContent;
        
        currentP1Seconds -- ;        

        if ( currentP1Seconds < 0 && currentP1Minutes > 0) {
            currentP1Seconds = 59;
            currentP1Minutes -- ;            
        }

        //add second digit '0' if < 10
        if ( currentP1Seconds < 10 || currentP1Minutes < 10 ) {
            currentP1Minutes = String(currentP1Minutes).padStart(2, '0');
            currentP1Seconds = String(currentP1Seconds).padStart(2, '0');
        };

        updateClock_1_Display();

        //If time run out
        if ( String(currentP1Seconds).padStart(2, '0') === "00" && String(currentP1Minutes).padStart(2, '0') === "00" ) {
            currentP1Minutes = String(currentP1Minutes).padStart(2, '0');
            currentP1Seconds = String(currentP1Seconds).padStart(2, '0');
            updateClock_1_Display();

            endGame();
            startPause.setAttribute("src", "/images/start.png");
            
        } 
    };
    
    //Player 2 Clock
    if (currentPlayer === "player2"){

        currentP2Seconds -- ;

        if ( currentP2Seconds < 0 && currentP2Minutes > 0) {
            currentP2Seconds = 59;
            currentP2Minutes --;
            
        }

        //add second digit '0' if < 10
        if ( currentP2Seconds < 10 || currentP2Minutes < 10 ) {
            currentP2Minutes = String(currentP2Minutes).padStart(2, '0');
            currentP2Seconds = String(currentP2Seconds).padStart(2, '0');
        };

        updateClock_2_Display();

        //If time run out
        if ( String(currentP2Seconds).padStart(2, '0') === "00" && String(currentP2Minutes).padStart(2, '0') === "00" ) {
            currentP2Minutes = String(currentP2Minutes).padStart(2, '0');
            currentP2Seconds = String(currentP2Seconds).padStart(2, '0');
            updateClock_2_Display();

            endGame();
            startPause.setAttribute("src", "/images/start.png");            
        } 
    }
}

function endGame(){
    console.log(currentPlayer)
    if ( currentPlayer === "player1" ) {
        clock1.style.backgroundColor = "red";
        
    } else if ( currentPlayer === "player2" ) {
        clock2.style.backgroundColor = "red";
    }
    clearInterval(timer1);
    clearInterval(timer2);
    clock1.disabled = true;
    clock2.disabled = true;
    isGameRunning = false;

    currentPlayer = "none";
};

//start/pause button, start the currentPlayer's clock or pause current's player clock
function toggleStartPause(){
    let iconSrc = startPause.getAttribute("src");

    if (iconSrc === "/images/start.png"){
        //Start current Player's clock and swap icon
        if (currentPlayer === "player1"){
            startClock1();

        } else if ( currentPlayer === "player2" ) {
            startClock2();

            //If no current player the game has ended
        } else {
            startPause.disabled = true;
        };
        

    } else if ( iconSrc === "/images/pause.png" ) {
        //Pause current player clock and swap icon
        if (currentPlayer === "player1") {
            clearInterval(timer1);
        }
        if (currentPlayer === "player2") {
            clearInterval(timer2);
        }
        //Disable clock area buttons
        clock1.disabled = true;
        clock2.disabled = true;
        //Handle swap variables
        isPaused = true; 
    }

    //Swap icon
    toggleStartPauseIcons();
}; 

function toggleStartPauseIcons(){
    let iconSrc = startPause.getAttribute("src");

    if (iconSrc === "/images/start.png"){
        startPause.setAttribute("src", "/images/pause.png");
    } else {
        startPause.setAttribute("src", "/images/start.png");
    };
};

// function resetClock() {

// }

















/*
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
*/