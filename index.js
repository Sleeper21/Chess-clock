// Current format
let currentFormat = {
    hours: 0,
    minutes: 0,
    seconds: 5,
    increment: true,
};

let currentIncrement = {
    hours: 0,
    minutes: 0,
    seconds: 2,
};

// Player 1 clock
let currentP1Hours = currentFormat.hours;
let currentP1Minutes = currentFormat.minutes;
let currentP1Seconds = currentFormat.seconds;
let p1moveCount = 0;

let clock1 = document.getElementById("player1");

//Player 2 clock
let currentP2Hours = currentFormat.hours;
let currentP2Minutes = currentFormat.minutes;
let currentP2Seconds = currentFormat.seconds;
let p2moveCount = 0;

let clock2 = document.getElementById("player2");

// Nav icon settings
let reset = document.getElementById("reset-icon");
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
let firstCall = true; // will use this to wait 1sec in order to start decrementing the clock seconds

//Update clocks display
updateClock_1_Display();
updateClock_2_Display();

// When display is clicked or pressed, start the opponent's clock
clock1.addEventListener("click", startClock2);
clock2.addEventListener("click", startClock1);

//Event listeners nav settings
reset.addEventListener("click", resetClock);
startPause.addEventListener("click", toggleStartPause);
//editTime.addEventListener("click", editTimeFormat);
//volume.addEventListener.("click", muteUnmute);

function updateClock_1_Display(){
    //Hide hours display if hour < 1
    if ( String(currentP1Hours).padStart(2, '0') < 1 ) {
        document.getElementById("hours1").classList.add("hidden");
        document.getElementById("hours1-separator").classList.add("hidden");
    }
    if ( String(currentP1Hours).padStart(2, '0') >= 1 ) {
        document.getElementById("hours1").classList.remove("hidden");
        document.getElementById("hours1-separator").classList.remove("hidden");
    }
    //Display Values
    document.getElementById("hours1").textContent = String(currentP1Hours).padStart(2, '0');
    document.getElementById("minutes1").textContent = String(currentP1Minutes).padStart(2, '0');
    document.getElementById("seconds1").textContent = String(currentP1Seconds).padStart(2, '0');    
};
function updateClock_2_Display(){
    //Hide hours display if hour < 1
    if ( String(currentP2Hours).padStart(2, '0') < 1 ) {
        document.getElementById("hours2").classList.add("hidden");
        document.getElementById("hours2-separator").classList.add("hidden");
    }
    if ( String(currentP2Hours).padStart(2, '0') >= 1 ) {
        document.getElementById("hours2").classList.remove("hidden");
        document.getElementById("hours2-separator").classList.remove("hidden");
    }
    //Display Values   
    document.getElementById("hours2").textContent = String(currentP2Hours).padStart(2, '0');
    document.getElementById("minutes2").textContent = String(currentP2Minutes).padStart(2, '0');
    document.getElementById("seconds2").textContent = String(currentP2Seconds).padStart(2, '0');    
};   

// Player 1 Clock
function startClock1(){
    //Stop the opponent's clock
    clearInterval(timer2);

    if (!isGameRunning) toggleStartPauseIcons("/images/pause.png"); //Prevents swapping icon during the game

    if (isPaused) { //Skips adding increment after press "resume clock" on that moment
        document.getElementById("minutes2").textContent = String(parseInt(currentP2Minutes)).padStart(2, '0');
        document.getElementById("seconds2").textContent = String(parseInt(currentP2Seconds)).padStart(2, '0');
    };

    // add increment to opponent's clock if current format has increment
    if ( currentFormat.increment && !isPaused ) {
        currentP2Minutes = parseInt(document.getElementById("minutes2").textContent) + parseInt(currentIncrement.minutes)
        currentP2Seconds = parseInt(document.getElementById("seconds2").textContent) + parseInt(currentIncrement.seconds)
        //Handle if seconds or minutes > 60
        if (currentP2Seconds >= 60) {
            currentP2Seconds = currentP2Seconds - 60;
            currentP2Minutes ++ ;
        }
        if ( currentP2Minutes >= 60 ) {
            currentP2Minutes = currentP2Minutes - 60;
            currentP2Hours ++ ;
        }
     updateClock_2_Display();

    };

    //Increment move count
    if (isGameRunning && !isPaused) { // Only increments after the first move (game is running) prevents incrementing is game was paused
        p2moveCount++;
        document.getElementById("p2-moveCount").textContent = p2moveCount;
    }  

    //handle swap variables
    currentPlayer = "player1";
    playerToMove = 1;
    isPaused = false;
    isGameRunning = true;
    firstCall = true;    

    //Change Background colors
    handleActiveClockColor();

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

    if (!isGameRunning) toggleStartPauseIcons("/images/pause.png"); //Prevents swapping icon during the game

    if (isPaused) { //Prevents adding increment after press "resume clock"
        document.getElementById("minutes1").textContent = String(parseInt(currentP1Minutes)).padStart(2, '0');
        document.getElementById("seconds1").textContent = String(parseInt(currentP1Seconds)).padStart(2, '0');
    }

    // add increment to opponent's clock if current format has increment
    if ( currentFormat.increment && !isPaused ) {
        currentP1Minutes = parseInt(document.getElementById("minutes1").textContent) + parseInt(currentIncrement.minutes)
        currentP1Seconds = parseInt(document.getElementById("seconds1").textContent) + parseInt(currentIncrement.seconds)
        //Handle if seconds or minutes is > 60
        if (currentP1Seconds >= 60) {
            currentP1Seconds = currentP1Seconds - 60;
            currentP1Minutes ++ ;
        }
        if ( currentP1Minutes >= 60 ) {
            currentP1Minutes = currentP1Minutes - 60;
            currentP1Hours ++ ;
        };
        
        updateClock_1_Display();
        
    };

    //Increment move count
    console.log(isPaused)
    if (isGameRunning && !isPaused) { // Only increments after the first move (game is running) prevents incrementing is game was paused
        p1moveCount++;
        document.getElementById("p1-moveCount").textContent = p1moveCount;
    }

    //handle swap variables
    currentPlayer = "player2";
    playerToMove = 2;
    isPaused = false;
    isGameRunning = true;
    firstCall = true;

    //Change Background colors
    handleActiveClockColor();

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
        // check if this is the first call so the first second does not get decremented immediately
        if (firstCall){
            firstCall = false;
            return
        };

        currentP1Hours = document.getElementById("hours1").textContent;
        currentP1Minutes = document.getElementById("minutes1").textContent;
        currentP1Seconds = document.getElementById("seconds1").textContent;

        //Decrease Seconds
        currentP1Seconds -- ;

        //Decrease minutes
        if ( currentP1Seconds < 0 && currentP1Minutes > 0 ) {
            currentP1Seconds = 59;
            currentP1Minutes --;
        }
        //Decrease hour
        if ( currentP1Seconds < 0 && currentP1Minutes == 0 && currentP1Hours > 0) {
            currentP1Seconds = 59;
            currentP1Minutes = 59;
            currentP1Hours -- ;
        }

        //If time run out
        if ( currentP1Seconds == 0 && currentP1Minutes == 0 && currentP1Hours == 0) {
            currentP1Hours = String(currentP1Hours).padStart(2, '0');
            currentP1Minutes = String(currentP1Minutes).padStart(2, '0');
            currentP1Seconds = String(currentP1Seconds).padStart(2, '0');

            endGame();
            startPause.setAttribute("src", "/images/start.png");            
        }

        updateClock_1_Display();
    };
    
    //Player 2 Clock
    if (currentPlayer === "player2"){
        // check if this is the first call so the first second does not get decremented immediately
        if (firstCall){
            firstCall = false;
            return
        };

        //Decrease Seconds
        currentP2Seconds -- ;

        //Decrease minutes
        if ( currentP2Seconds < 0 && currentP2Minutes > 0 ) {
            currentP2Seconds = 59;
            currentP2Minutes --;
        }
        //Decrease hour
        if ( currentP2Seconds < 0 && currentP2Minutes == 0 && currentP2Hours > 0) {
            currentP2Seconds = 59;
            currentP2Minutes = 59;
            currentP2Hours -- ;
        }

        //If time run out
        if ( currentP2Seconds == 0 && currentP2Minutes == 0 && currentP2Hours == 0 ) {
            currentP2Hours = String(currentP2Hours).padStart(2, '0');
            currentP2Minutes = String(currentP2Minutes).padStart(2, '0');
            currentP2Seconds = String(currentP2Seconds).padStart(2, '0');
            endGame();
            startPause.setAttribute("src", "/images/start.png");            
        }

        updateClock_2_Display();
    }
}

function endGame(){
    console.log(currentPlayer)
    if ( currentPlayer === "player1" ) {
        clock1.classList.add("red");
        
    } else if ( currentPlayer === "player2" ) {
        clock2.classList.add("red");
    }
    clearInterval(timer1);
    clearInterval(timer2);
    clock1.disabled = true;
    clock2.disabled = true;
    isGameRunning = false;
    currentPlayer = "none";
};

//Start/pause button - Start the current Player's clock or pause current player's clock
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
       
        //Swap icon
        toggleStartPauseIcons("/images/pause.png");

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
        //Swap icon
        toggleStartPauseIcons("/images/start.png");
    }
}; 

function toggleStartPauseIcons(srcPath){
    
    document.getElementById("start-icon").setAttribute("src", srcPath);
};

function resetClock() {
    //Stop clocks
    clearInterval(timer1);
    clearInterval(timer2);
    isPaused = true;

    //Disable clock area buttons
    clock1.disabled = true;
    clock2.disabled = true;

    //Always change icon to "start". The toggle function don't work here
    startPause.setAttribute("src", "/images/start.png");

    // Show confirmation pop up
    let resetPopup = document.getElementById("reset-alert");
    resetPopup.classList.remove("hidden");

    //Add eventlistener to each button:
    //No
    document.getElementById("reset-no").addEventListener("click", () => {
        resetPopup.classList.add("hidden");
        if (!isGameRunning && currentPlayer != "none"){
            isPaused = false;
            clock1.disabled = false;
            clock2.disabled = false;
        }
    });

    //Yes
    document.getElementById("reset-yes").addEventListener("click", () => {
        resetPopup.classList.add("hidden");

        clock2.classList.remove("red");
        clock1.classList.remove("red");
        clock2.classList.remove("green");
        clock1.classList.remove("green");

        //reset values to current format values
        currentP1Hours = currentFormat.hours;
        currentP1Minutes = currentFormat.minutes;
        currentP1Seconds = currentFormat.seconds;

        currentP2Hours = currentFormat.hours;
        currentP2Minutes = currentFormat.minutes;
        currentP2Seconds = currentFormat.seconds;

        //Reset game status
        isPaused = false;
        isGameRunning = false;
        currentPlayer = "player1";
        p1moveCount = 0;
        p2moveCount = 0;
        document.getElementById("p1-moveCount").textContent = p1moveCount;
        document.getElementById("p2-moveCount").textContent = p2moveCount;

        //Disable clock area buttons
        clock1.disabled = false;
        clock2.disabled = false;

        //Update displays
        updateClock_1_Display();
        updateClock_2_Display();
    })    
}

function handleActiveClockColor(){
    if (currentPlayer === "player1") {
        clock1.classList.add("green");
        clock2.classList.remove("green");

    } else if (currentPlayer === "player2") {
        clock1.classList.remove("green");
        clock2.classList.add("green");
    }
};