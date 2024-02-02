const board= document.getElementById('game-board');

let snake=[{ x:10, y:10 }];
let food=generatefood();
let direction='right'
let gameInterval;
let highScore =0;
let gameSpeedDelay=200;
let gameStarted=false;
const instructionText=document.getElementById('instruction-text');
const logo= document.getElementById('logo');
const score=document.getElementById('score')
const highScoreEl= document.getElementById('highScore');


function draw(){
    board.innerHTML='';
    drawSnake();
    drawFood();
}

function drawSnake(){
    snake.forEach((segment)=>{
        const snakeElement= createGameElement('div','snake');
        setPosition(snakeElement,segment);
        board.appendChild(snakeElement);
        
    })
}

function createGameElement(tag,className){
    const element=document.createElement(tag);
    element.className=className;
    return element;
}

function setPosition(element,position){
    element.style.gridColumn= position.x
    element.style.gridRow= position.y
}

function drawFood(){
    if (gameStarted) {
        const foodElement= createGameElement('div','food');
        setPosition(foodElement,food);
        board.appendChild(foodElement);
    }

}

function generatefood(){
    const x= Math.floor(Math.random()*20)+1;
    const y= Math.floor(Math.random()*20)+1;
    return{x,y}
}

function move(){
    const head={...snake[0]}
    switch (direction) {
        case 'right':
            head.x++;
            break;
        case 'up':
            head.y--;
            // for up condition it is y-- bcoz we start from y=10 and for the snake to go upwards the axis value should
            //  decrease as the top most point is 1 and we are at the middle which is 10
            break;
        case 'down':
            head.y++;
            break;
        case 'left':
            head.x--;
            break;
    }
    snake.unshift(head)
    // adds a head object to the beginning of the snake array
    // i.e adds a new object  at the beginning of the snake array
    
    // if we run into food
    if (head.x===food.x && head.y===food.y){
        food=generatefood();
        increaseSpeed();
        updateScore()
        // if we crash with the food then we have to generate food again
        clearInterval(gameInterval);
        gameInterval = setInterval(()=>{
            move();
            checkCollision()
            draw();
        },gameSpeedDelay)

    }else{
        snake.pop()
    // remove the earlier snake head once the new head gets added with the unshift method
    // i.e removes the last object from the snake array
    }
}


function increaseSpeed(){
    if (gameSpeedDelay>150){
        gameSpeedDelay-=5;
    }
    else if(gameSpeedDelay>100){
        gameSpeedDelay-=3;
    }
    else if(gameSpeedDelay>50){
        gameSpeedDelay-=2;
    }
    else if(gameSpeedDelay>25){
        gameSpeedDelay-=1;
    }
}

function checkCollision (){
    const head= snake[0];
    if (head.x<1 || head.x>20 || head.y<1 || head.y>20){
        resetGame();
    }

    for (let index = 1; index < snake.length; index++) {
        // this is to check if the snake collides with the body itself
        if (head.x===snake[index].x && head.y===snake[index].y){
            resetGame();
        }
        
    }
}

function resetGame(){
    updateHighScore();
    stopGame()
    snake=[{x:10,y:10}];
    food= generatefood();
    direction='right';
    gameSpeedDelay=200;
    updateScore();
}

function updateScore(){
    const currentScore= snake.length-1;
    score.innerText=currentScore.toString().padStart(3,'0');
//     the padStart helps in setting the score as 001,002 etc without that
//     it will set the score as 1,2etc and since the padStart is a string fucntion
// therefore we need to convert the current score to string
 }


function stopGame(){
    clearInterval(gameInterval);
    gameStarted=false;
    instructionText.style.display='block'
    logo.style.display='block'
} 


function updateHighScore(){
    const currentScore= snake.length-1;
    if(currentScore>highScore){
        highScore=currentScore;
        highScoreEl.textContent=highScore.toString().padStart(3,'0');
        highScoreEl.style.display='block'
    }
}

function startGame(){
    gameStarted= true;
    instructionText.style.display='none'
    logo.style.display='none'
    gameInterval = setInterval(()=>{
        move();
        checkCollision();
        draw();
    }, gameSpeedDelay)
}



// keypress event listener

function handleKeyPress(event){
    // two if condition bcoz one of them may not work for some browsers
    if ((!gameStarted && event.keyCode===32)|| 
    (!gameStarted && event.key===' ')){
    startGame();
    } 
    else{
        switch (event.key){
            case 'ArrowUp':
                direction='up'
                break;
            case 'w':
                direction='up'
                break;
            case 'ArrowDown':
                direction='down'
                break;
            case 's':
                direction='down'
                break;
            case 'ArrowLeft':
                direction='left'
                break;
            case 'a':
                direction='left'
                break;
            case 'ArrowRight':
                direction='right'
                break;
            case 'd':
                direction='right'
                break;
        }
    }
}

document.addEventListener('keydown',handleKeyPress);
