const game = document.querySelector("#game");
const playcar = document.querySelector(".playercar");
const road = document.querySelector(".road");
const easybtn = document.querySelector("#easy");
const mediumbtn = document.querySelector("#medium");
const hardbtn = document.querySelector("#hard");
const scoreDisplay = document.querySelector("#score");
const distanceDisplay = document.querySelector("#distance");
const dodgedDisplay = document.querySelector("#carsgone");

let carX = (road.offsetWidth - playcar.offsetWidth) / 2;
let carSpeed = 10;
let isgamerunning = true; //over
let lanes = [0, 1, 2];
let carspassed =0;
let spawnspeed = 0;
let modespeed = 0;
let gamestart = false;
let basepoints = 0;
let points = 0;
let currentspeed = 0;
let basespeed=0;
let distance =0;

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

//Mode buttons 
easybtn.addEventListener("click", function() {
        if (!gamestart){
        gamestart = true;
        spawnspeed = 2500;
        basespeed =1;
        modespeed = 1;
        basepoints = 15;
        startGame();
        }     
});
mediumbtn.addEventListener("click", function() {
        if (!gamestart){
        gamestart = true;
        modespeed = 2;
        basespeed = 2;
        spawnspeed = 2000;
        basepoints = 20;
        startGame();
        }
});
hardbtn.addEventListener("click", function() {
        if (!gamestart){
        gamestart = true;
        modespeed = 3;
        basespeed = 3;
        spawnspeed = 1000;
        basepoints = 25;
        startGame();
        }
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
            let gapRight = playerright - enemyleft;
            if (
                enemyright >= playerleft &&
                enemyleft <= playerright &&
                enemybottom >= playertop &&
                enemytop <= playerbottom
            ) {
                console.log("Game over")
                isgamerunning = false;
                clearInterval(movementTimer);
            }
            else if (enemyY >= road.offsetHeight){
                carspassed ++;
                let pointsEarned = basepoints + ((modespeed - basespeed) * 15);
                points += pointsEarned;
                if (carspassed % 15 === 0){
                    modespeed++
                    console.log("speed",modespeed);
                }
                console.log("Total score:", points);
                scoreDisplay.textContent = points;
                console.log("Actual:", carspassed);
console.log("Displayed:", dodgedDisplay.textContent);
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

