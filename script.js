/* --- PETALS --- */
function createPetals() {
    const container = document.getElementById('petal-container');
    if (!container) return;
    for (let i = 0; i < 20; i++) {
        const petal = document.createElement('div');
        petal.style.position = 'fixed'; petal.style.background = '#ffb6c1';
        petal.style.width = '10px'; petal.style.height = '10px';
        petal.style.borderRadius = '50% 0 50% 0';
        petal.style.top = Math.random() * -100 + 'px'; petal.style.left = Math.random() * 100 + '%';
        container.appendChild(petal);
        animatePetal(petal);
    }
}
function animatePetal(p) {
    let top = parseFloat(p.style.top);
    let speed = Math.random() * 2 + 1;
    function move() { top += speed; p.style.top = top + 'px'; if (top > window.innerHeight) top = -20; requestAnimationFrame(move); }
    move();
}
createPetals();

/* --- SLIDERS --- */
function changeSlide(dir, cls) {
    let slides = document.getElementsByClassName(cls);
    if(slides.length === 0) return;
    let activeIdx = Array.from(slides).findIndex(s => s.classList.contains('active'));
    slides[activeIdx].classList.remove('active');
    let next = (activeIdx + dir + slides.length) % slides.length;
    slides[next].classList.add('active');
}

/* --- RANDOM FEATURED IMAGE --- */
const randomImg = document.getElementById('randomImage');
if (randomImg) {
    let images = [];
    for(let i=1; i<=10; i++) {
        images.push('photography' + i + '.png');
        images.push('design' + i + '.png');
    }
    randomImg.src = images[Math.floor(Math.random() * images.length)];
}

/* --- FIXED GAME LOGIC --- */
const canvas = document.getElementById('gameCanvas');
if (canvas) {
    const ctx = canvas.getContext('2d');
    const scoreText = document.getElementById('scoreVal');
    let birdY = 250, velocity = 0, gravity = 0.5, jump = -8, score = 0, pipes = [], gameState = 'START', passedPipes = [];

    function reset() { birdY = 250; velocity = 0; score = 0; pipes = []; passedPipes = []; gameState = 'PLAYING'; scoreText.innerHTML = "Score: 0"; }

    function draw() {
        ctx.clearRect(0, 0, 400, 500);
        ctx.fillStyle = "#ff69b4"; ctx.fillRect(50, birdY, 35, 35);
        if (gameState === 'PLAYING') {
            velocity += gravity; birdY += velocity;
            if (pipes.length === 0 || pipes[pipes.length - 1].x < 200) pipes.push({ x: 400, top: Math.random() * 200 + 50, id: Date.now() });
            pipes.forEach((p, i) => {
                p.x -= 3;
                ctx.fillStyle = "#ffb6c1"; ctx.fillRect(p.x, 0, 50, p.top); ctx.fillRect(p.x, p.top + 150, 50, 500);
                if (50 + 35 > p.x && 50 < p.x + 50 && (birdY < p.top || birdY + 35 > p.top + 150)) gameState = 'GAMEOVER';
                if (p.x + 50 < 50 && !passedPipes.includes(p.id)) { score++; passedPipes.push(p.id); scoreText.innerHTML = "Score: " + score; }
                if (p.x < -60) pipes.splice(i, 1);
            });
            if (birdY > 500 || birdY < 0) gameState = 'GAMEOVER';
        }
        ctx.fillStyle = "#5d4037"; ctx.font = "20px Arial";
        if (gameState === 'START') ctx.fillText("Click to Start!", 140, 250);
        if (gameState === 'GAMEOVER') ctx.fillText("Game Over! Click to Restart", 90, 250);
        requestAnimationFrame(draw);
    }
    canvas.addEventListener('mousedown', () => { if (gameState !== 'PLAYING') reset(); else velocity = jump; });
    draw();
}