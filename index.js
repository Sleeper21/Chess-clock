// Current format
let currentFormat
let currentIncrement
let displayFormat1 = document.getElementById("current-format1");
let displayFormat2 = document.getElementById("current-format2"); 

// Player 1 clock
let currentP1Hours 
let currentP1Minutes 
let currentP1Seconds 
let p1moveCount 
let clock1
//Player 2 clock
let currentP2Hours  
let currentP2Minutes 
let currentP2Seconds 
let p2moveCount 
let clock2 

// Nav icon settings
let reset = document.getElementById("reset-icon");
let startPause = document.getElementById("start-icon");
let editTime = document.getElementById("edit-icon");
let volume = document.getElementById("volume-icon");

//Edit time formats settings buttons
const bullet1 = document.getElementById("bullet1");
const bullet2 = document.getElementById("bullet2");
const bullet3 = document.getElementById("bullet3");
const blitz1 = document.getElementById("blitz1");
const blitz2 = document.getElementById("blitz2");
const blitz3 = document.getElementById("blitz3");
const rapid1 = document.getElementById("rapid1");
const rapid2 = document.getElementById("rapid2");
const rapid3 = document.getElementById("rapid3");

// Swap variables
let currentPlayer = "player1";
let isPaused = false; // Paused game is only when a game is running but the clocks are paused.
let isGameRunning = false;
let timer1;
let timer2;
let firstCall = true; // will use this to wait 1sec in order to start decrementing the clock seconds

//Audio files
let isMuted = false;
const endMoveAudio = new Audio("/sounds/clock-sound.mp3");
const timeoutAudio = new Audio("/sounds/timeout.mp3");

//Set current Format variables
setCurrentFormatStats();

// When display is clicked or pressed, start the opponent's clock
clock1.addEventListener("click", startClock2);
clock2.addEventListener("click", startClock1);

//Event listeners nav settings
reset.addEventListener("click", resetClock);
startPause.addEventListener("click", toggleStartPause);
editTime.addEventListener("click", editTimeFormat);
volume.addEventListener("click", muteUnmute);

function setCurrentFormatStats(hour, min, sec, increment, showOnDisplay){
    // Current format
    currentFormat = {
        hours: hour ? hour : 0,
        minutes: min ? min : 0,
        seconds: sec ? sec : 0,
        increment: increment ? true : false,
    };

    //Current game increment
    currentIncrement = currentFormat.increment ? increment : 0;

    //Display format on clock screens
    displayFormat1.textContent = showOnDisplay ? showOnDisplay : "";
    displayFormat2.textContent = showOnDisplay ? showOnDisplay : "";

    // Player 1 clock
    currentP1Hours = currentFormat.hours;
    currentP1Minutes = currentFormat.minutes;
    currentP1Seconds = currentFormat.seconds;
    p1moveCount = 0;
    clock1 = document.getElementById("player1");

    //Player 2 clock
    currentP2Hours = currentFormat.hours;
    currentP2Minutes = currentFormat.minutes;
    currentP2Seconds = currentFormat.seconds;
    p2moveCount = 0;
    clock2 = document.getElementById("player2");

    //Set game Status
    isPaused = false;
    isGameRunning = false;
    currentPlayer = "player1";
    p1moveCount = 0;
    p2moveCount = 0;
    document.getElementById("p1-moveCount").textContent = p1moveCount;
    document.getElementById("p2-moveCount").textContent = p2moveCount;
    clock2.classList.remove("red");
    clock1.classList.remove("red");
    clock2.classList.remove("green");
    clock1.classList.remove("green");

    //Disable clock area buttons
    clock1.disabled = false;
    clock2.disabled = false;

    updateClock_1_Display();
    updateClock_2_Display();
};

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

    //Handle if both clock are set up to 00:00
    if ( currentP1Seconds == 0 && currentP1Minutes == 0 && currentP1Hours == 0){
        editTimeFormat();
        return;
    } 

    // If game resumes from pause. prevent adding increment and place start icon. Also prevents swapping icons during game between turns
    if (isPaused || !isGameRunning) { 
        document.getElementById("minutes2").textContent = String(parseInt(currentP2Minutes)).padStart(2, '0');
        document.getElementById("seconds2").textContent = String(parseInt(currentP2Seconds)).padStart(2, '0');
        toggleStartPauseIcons("/images/pause.png");
    };

    // add increment to opponent's clock if current format has increment
    if ( currentFormat.increment && !isPaused ) {
        currentP2Seconds = parseInt(document.getElementById("seconds2").textContent) + parseInt(currentIncrement)
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
    if (isGameRunning  && !isPaused ) { // Only increments after the first move (game is running) prevents incrementing if game was paused
        p2moveCount++;        
    }

    //Update Move count display
    document.getElementById("p2-moveCount").textContent = p2moveCount;

    //handle swap variables
    currentPlayer = "player1";
    isPaused = false;
    isGameRunning = true;
    firstCall = true;    

    //Change Background colors
    handleActiveClockColor();

    //Disable/enable buttons
    clock2.disabled = true;
    clock1.disabled = false;

    //Play Sound
    if ( !isMuted ) endMoveAudio.play();

    //Start countdown
    countdown();
    timer1 = setInterval(countdown, 1000);    
}
//Player 2 Clock
function startClock2(){
    //Stop the opponent's clock
    clearInterval(timer1);

    //prevent start game if both clock are set up to 00:00
    if ( currentP2Seconds == 0 && currentP2Minutes == 0 && currentP2Hours == 0){
        editTimeFormat();
        return;
    }

    // If game resumes from pause. prevent adding increment and place start icon. Also prevents swapping icons during game between turns
    if (isPaused || !isGameRunning) { //Prevents adding increment after press "resume clock"
        document.getElementById("minutes1").textContent = String(parseInt(currentP1Minutes)).padStart(2, '0');
        document.getElementById("seconds1").textContent = String(parseInt(currentP1Seconds)).padStart(2, '0');
        toggleStartPauseIcons("/images/pause.png");
    }

    // add increment to opponent's clock if current format has increment
    if ( currentFormat.increment && !isPaused ) {
        currentP1Seconds = parseInt(document.getElementById("seconds1").textContent) + parseInt(currentIncrement)
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
    if (isGameRunning && !isPaused) { // Only increments after the first move (game is running) prevents incrementing is game was paused
        p1moveCount++;
    }

    //Update Move count display
    document.getElementById("p1-moveCount").textContent = p1moveCount;

    //handle swap variables
    currentPlayer = "player2";
    isPaused = false;
    isGameRunning = true;
    firstCall = true;

    //Change Background colors
    handleActiveClockColor();

    //Disable buttons
    clock2.disabled = false;
    clock1.disabled = true;

    //Play Sound
    if ( !isMuted ) endMoveAudio.play();

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
            toggleStartPauseIcons("/images/start.png");            
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
    //Play Sound
    if ( !isMuted ) timeoutAudio.play();
};

//Start/pause button - Start the current Player's clock or pause current player's clock
function toggleStartPause(){

    //prevent start game if both clock are set up to 00:00
    if ( currentP2Seconds == 0 && currentP2Minutes == 0 && currentP2Hours == 0 && currentP1Seconds == 0 && currentP1Minutes == 0 && currentP1Hours == 0){
        editTimeFormat();
        return;
    }

    if ((isPaused && isGameRunning) || (!isGameRunning && !isPaused)){
        //Start current Player's clock and swap icon
        if (currentPlayer === "player1"){
            startClock1();

        } else if ( currentPlayer === "player2" ) {
            startClock2();

            //If no current player the game has ended
        } else {
            startPause.disabled = true;
        };
        
        isPaused = false;
        //Swap icon
        toggleStartPauseIcons("/images/pause.png");
    } else if ( isGameRunning && !isPaused ) {
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
    //Stop clocks -- NOT PAUSE
    clearInterval(timer1);
    clearInterval(timer2);

    //Disable clock area buttons
    clock1.disabled = true;
    clock2.disabled = true;

    //Toggle start pause icon
    toggleStartPauseIcons("/images/start.png");

    // Show confirmation pop up
    let resetPopup = document.getElementById("reset-alert");
    resetPopup.classList.remove("hidden");

    //Add eventlistener to each button:
    //No - go back
    document.getElementById("reset-no").addEventListener("click", () => {

        resetPopup.classList.add("hidden");
        resumeCurrentGame();
    });

    //Yes
    document.getElementById("reset-yes").addEventListener("click", () => {
        resetPopup.classList.add("hidden");
        clock2.classList.remove("red");
        clock1.classList.remove("red");
        clock2.classList.remove("green");
        clock1.classList.remove("green");

        //Get values to reset game with same format
        let formatHours = currentFormat.hours;
        let formatMinutes = currentFormat.minutes;
        let formatSeconds = currentFormat.seconds;
        let formatIncrement = currentIncrement;
        let showOnDisplay = displayFormat1.textContent;

        //reset game values
        setCurrentFormatStats(formatHours, formatMinutes, formatSeconds, formatIncrement, showOnDisplay);
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

function muteUnmute(){
   isMuted = isMuted === false ? true : false ;
   //Swap icon
   if ( isMuted ) {
    document.getElementById("volume-icon").setAttribute("src", "/images/soundOff.png")
   } else document.getElementById("volume-icon").setAttribute("src", "/images/soundOn.png")
}

function editTimeFormat(){
    //Stop clocks -- NOT PAUSE
    clearInterval(timer1);
    clearInterval(timer2);
    
    //Disable clock area buttons
    clock1.disabled = true;
    clock2.disabled = true;

    //Set icon to "start".
    toggleStartPauseIcons("/images/start.png");

    //Show options panel
    document.getElementById("edit-format-panel").classList.remove("hidden");
    
    //go back and resume game
    const close = document.getElementById("close");
    close.addEventListener("click", () => {
        document.getElementById("edit-format-panel").classList.add("hidden");
        resumeCurrentGame();
    });

    //Manual input form
    let show
    const customTimeForm = document.getElementById("custom-time-form");
    
    customTimeForm.addEventListener("submit", (event) => { 
        const minInput = document.querySelector('input[name="minutes"]');

        //Check if valid inputs were made
        if (!minInput.checkValidity()) {
            alert("Need to insert at least a '0' in the minutes field.");
            minInput.focus();
            EventTarget.preventDefault();
        } else {
            event.preventDefault();
        let hoursInput = 0;
        let minutesInput = customTimeForm.minutes.value;
        if (minutesInput >= 60 ) {
            minutesInput = minutesInput - 60;
            hoursInput ++ ;
        }
        let secondsInput = customTimeForm.seconds.value;
        let incrementInput = customTimeForm.inc.value;

        //Format inputs to show on display
        show = formatInputs(hoursInput, minutesInput, secondsInput, incrementInput);

        //Set game stats
        setCurrentFormatStats(hoursInput, minutesInput, secondsInput, incrementInput, show);

        //Close panel
        document.getElementById("edit-format-panel").classList.add("hidden");
        }
               
    })

    //Eventlistener for all the option buttons
    const editCard = document.getElementById("time-options");

    //Select all buttons except the submit form button
    const timeOptions = editCard.querySelectorAll("button:not(#custom-time-form button)");

    timeOptions.forEach(option => {
        
        option.addEventListener("click", () => {
            
           switch (option.id) {
               case "bullet1":
                    //set game stats
                    show = "1 min";
                    setCurrentFormatStats(0, 1, 0, 0, show);        
                    break;
                case "bullet2":
                    show = "1 | 1";
                    setCurrentFormatStats(0, 1, 0, 1, show);
                    break;
                case "bullet3":
                    show = "2 | 1";
                    setCurrentFormatStats(0, 2, 0, 1, show);
                    break;
                case "blitz1":
                    show = "3 min";
                    setCurrentFormatStats(0, 3, 0, 0, show);
                    break;
                case "blitz2":
                    show = "3 | 2";
                    setCurrentFormatStats(0, 3, 0, 2, show);
                    break;
                case "blitz3":
                    show = "5 min";
                    setCurrentFormatStats(0, 5, 0, 0, show);
                    break;                
                case "rapid1":
                    show = "10 min";
                    setCurrentFormatStats(0, 10, 0, 0, show);
                    break;                
                case "rapid2":
                    show = "15 | 10";
                    setCurrentFormatStats(0, 15, 0, 10, show);
                    break;                
                case "rapid3":
                    show = "30 min";
                    setCurrentFormatStats(0, 30, 0, 0, show);
                    break;
                
               default:
                    setCurrentFormatStats(0, 0, 0, 0);
                    break;
           }
           //Close panel
           document.getElementById("edit-format-panel").classList.add("hidden");
        })
    });    
}

function resumeCurrentGame(){
    if (isGameRunning && currentPlayer != "none"){
        isPaused = true;
        if(currentPlayer === "player1") clock2.disabled = false;
        if(currentPlayer === "player2") clock1.disabled = false;
    }
    if ( !isGameRunning && currentPlayer != "none") {
        isPaused = false;
        clock2.disabled = false;
        clock1.disabled = false;
    }
}

function formatInputs(h, min, sec, increm){

    if (increm > 0){
        if (h > 0){
            show = h + "h | " + increm;
        } else if (min > 0){
            show = min + " | " + increm;
        } else show = sec + "sec | " + increm;

     //In case of no increment
    } else {
        if (h > 0) show = h + "h";
        else if (min > 0) show = min + "min";
        else show = sec + "sec";
    }    
    return show;
}