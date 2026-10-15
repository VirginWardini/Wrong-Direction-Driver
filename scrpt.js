const game = document.querySelector("#game");

function resizeGame() {
    let scaleX = window.innerWidth / 1280;
    let scaleY = window.innerHeight / 720;

    let scale = Math.min(scaleX, scaleY);

    game.style.transform =
        `translate(-50%, -50%) scale(${scale})`;
}

window.addEventListener("resize", resizeGame);
resizeGame();