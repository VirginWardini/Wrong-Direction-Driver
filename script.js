const game = document.querySelector("#game");
const playcar = document.querySelector(".playercar");
const road = document.querySelector(".road");
const startbtn = document.querySelector("#startbtn");
const scoreDisplay = document.querySelector("#score");
const distanceDisplay = document.querySelector("#distance");
const dodgedDisplay = document.querySelector("#carsgone");
const finalscreen = document.querySelector(".gameover");
const fscoreDisplay = document.querySelector("#finalscore");
const fdistanceDisplay = document.querySelector("#finaldistance");
const fdodgedDisplay = document.querySelector("#finaldodged");
const restartbutton = document.querySelector("#gameoverbtn");
const coundown = document.querySelector("#countdown");
const difficulty = document.querySelector("#difficulty");
const firstpage = document.querySelector("#firstpage");
const previouscar = document.querySelector("#previouscar");
const currentcar = document.querySelector("#currentcar");
const nextcar = document.querySelector("#nextcar");

let carX = (road.offsetWidth - playcar.offsetWidth) / 2;
let carSpeed = 10;
let isgamerunning = true; //over
let lanes = [0, 1, 2];
let carspassed =0;
let spawnspeed = 2500;
let modespeed = 1;
let gamestart = false;
let basepoints = 5;
let points = 0;
let currentspeed = 0;
let basespeed=1;
let distance =0;
let modeselected = false;
let countdowndone = false;
let carIndex = 0;

let cars = [
    "assets/aston.png",
    "assets/mclaren.png",
    "assets/ferrai.png"
];

//rezise for each screen
function resizeGame() {
        let scaleX = window.innerWidth / 1280;
        let scaleY = window.innerHeight / 720;

        let scale = Math.min(scaleX, scaleY);

        game.style.transform =
            `translate(-50%, -50%) scale(${scale})`;
}
window.addEventListener("resize", resizeGame);
resizeGame();

// car change
previouscar.addEventListener("click", function (){
    currentcar.src = cars[carIndex];
    carIndex--
});

nextcar.addEventListener("click", function (){
    currentcar.src = cars[carIndex];
    carIndex++
});


   


startbtn.addEventListener("click", function() {
    if (countdownStarted) {
        return;
    }

    countdownStarted = true;
    firstpage.style.display = "none";
    startCountdown();
});


//Mode buttons 
difficulty .addEventListener("change", function() {
    if (difficulty.value === "easy") {

        spawnspeed = 2500;
        basespeed =1;
        modespeed = 1;
        basepoints = 5;

    }
    else if (difficulty.value === "medium") {

        modespeed = 2;
        basespeed = 2;
        spawnspeed = 2000;
        basepoints = 10;

    }
    else if (difficulty.value === "hard") {
  
        modespeed = 3;
        basespeed = 3;
        spawnspeed = 1000;
        basepoints = 15;

    }
    modeselected = true;
});

let count = 3;

let countdownStarted = false;

function startCountdown() {
    let count = 3;

    coundown.style.display = "block";
    coundown.textContent = count;

    let countdown = setInterval(function() {
        count--;

        if (count > 0) {
            coundown.textContent = count;
        } else {
            coundown.textContent = "GO!";
            clearInterval(countdown);

            setTimeout(function() {
                coundown.style.display = "none";
                gamestart = true;
                startGame();
            }, 500);
        }
    }, 1000);
}

startbtn.addEventListener("click", function() {
    if (countdownStarted) {
        return;
    }

    countdownStarted = true;
    firstpage.style.display = "none";
    startCountdown();
});


//restart
restartbutton.addEventListener("click", function() {
        window.location.reload();
});

//moving the car
document.addEventListener("keydown",function(event){
        if (event.key === "ArrowLeft" && isgamerunning && gamestart){
            carX-=carSpeed;
            let maxX = road.offsetWidth - playcar.offsetWidth;
            carX = Math.max(0, Math.min(carX, maxX));
            playcar.style.left = carX + "px";
    }
        else if (event.key === "ArrowRight" && isgamerunning && gamestart){
            let maxX = road.offsetWidth - playcar.offsetWidth;
            carX += carSpeed;
            carX = Math.max(0, Math.min(carX, maxX));
            playcar.style.left = carX + "px";
        }

})
playcar.style.left = carX + "px";



//function for enemy vehicles
function createothervehicle(){
        let enemy = document.createElement("div");
        enemy.className="enemy";
        let randomLane = Math.floor(Math.random() * 3);
        let safelane = Math.floor(Math.random() * 3);

        let almostAwarded = false;
        let almostDetected = false;

        //reduce traffic
        while (randomLane === safelane) {
            randomLane = Math.floor(Math.random() * 3);
        }
        let enemyY = 0;
        let enemyX = randomLane * 300 + 95;
        enemy.style.left = enemyX + "px";
        enemy.style.top = enemyY + "px";
        road.appendChild(enemy);


        let movementTimer = setInterval (function() {
            if (!isgamerunning){
                return; 
            }
            enemyY += modespeed;
            enemy.style.top = enemyY + "px"

            let enemyleft = enemy.offsetLeft;
            let enemyright = enemyleft + enemy.offsetWidth;
            let playerleft = playcar.offsetLeft;
            let playerright = playerleft + playcar.offsetWidth;

            let enemytop = enemy.offsetTop;
            let enemybottom = enemytop + enemy.offsetHeight;
            let playertop = playcar.offsetTop;
            let playerbottom = playertop + playcar.offsetHeight;

            let gapLeft = playerleft - enemyright;
            let gapRight =  enemyleft - playerright;

            let horizontalNearMiss =
                (gapLeft > 0 && gapLeft <= 10) ||
                (gapRight > 0 && gapRight <= 10);

            let verticalOverlap =
                enemybottom > playertop &&
                enemytop < playerbottom;

            if (
                enemyright >= playerleft &&
                enemyleft <= playerright &&
                enemybottom >= playertop &&
                enemytop <= playerbottom
            ) {
                console.log("Game over")
                isgamerunning = false;

                finalscreen.style.display = "block";
                fscoreDisplay.textContent = points;
                fdodgedDisplay.textContent = carspassed;
                fdistanceDisplay.textContent = distance;
                

                clearInterval(movementTimer);
                return;
            }
            //almost feature
            if (horizontalNearMiss && verticalOverlap) {
                console.log("almost");
                almostDetected = true;
            }
                        //speed increasin
            else if (enemyY >= road.offsetHeight){
                carspassed ++;
                let pointsEarned = basepoints + ((modespeed - basespeed) * 5);
                points += pointsEarned;
                if (carspassed % 15 === 0){
                    modespeed++
                }

                let almostScore =0;
                //score display
            if (enemytop > playerbottom && almostDetected ){
                    almostAwarded = true;
                    if (almostAwarded){
                    almostScore +=25; 
                    let almostPopup = document.createElement("div");

                    almostPopup.className = "almostPopup";
                    almostPopup.textContent = "ALMOST! +25";

                    almostPopup.style.left = playcar.offsetLeft + "px";
                    almostPopup.style.top = (playcar.offsetTop - 40) + "px";

                    road.appendChild(almostPopup);

                    setTimeout(function() {
                        almostPopup.remove();
                    }, 800);

                    points = points + almostScore;
                    console.log("Almost added")
                    
                    }
                }

                console.log("Total score:", points);
                scoreDisplay.textContent = points;
                dodgedDisplay.textContent = carspassed;
                enemy.remove();
                clearInterval(movementTimer);

            }

        } ,10)
}

//intervals
function startGame(){
setInterval (function(){
        if (isgamerunning && gamestart){
        createothervehicle();
        }
},spawnspeed);

//distance
setInterval(function(){
    if (isgamerunning && gamestart){

        distance += modespeed;
        //  console.log("Distance",distance);
        distanceDisplay.textContent = distance;

    }
},100);
}

