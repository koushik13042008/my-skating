var PLAY = 1;
var END = 0;
var gameState = PLAY;

var runner,bg;
var runnerImg, bgImg;
var score = 0;
var obstaclesGroup,obstacle1,obstacle2,obstacle3;
var cloudsGroup,cloudsImage;

var gameOver, restart;

function preload(){
  runnerImg = loadImage("kick-loader.gif");
  bgImg = loadImage("bg.jpg");
  obstacle1 = loadImage("obs1.png");
  obstacle2= loadImage("obs2.png");
  obstacle3 = loadImage("obs3.png");
  
  cloudImage = loadImage("cloud.png");
  
   gameOverImg = loadImage("gameover.jfif");
  restartImg = loadImage("restart.jpg");
 

}

function setup() {
  createCanvas(600,400);
  
   bg = createSprite(300,200);
  bg.addImage(bgImg); 
  bg.velocityX = -4;
  
  gameOver = createSprite(300,150);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(300,250);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.5;
  restart.scale = 0.3;

  gameOver.visible = false;
  restart.visible = false;
  
  runner = createSprite(100,300);
  runner.addImage(runnerImg);
  runner.scale = 0.5;
  runner.debug =  false;
  runner.setCollider("circle",0,0,100);
  
cloudsGroup = new Group();  
obstaclesGroup = new Group();
  
 score = 0; 

}

function draw() {
  background(0);
  text("Score: "+ score, 500,50);
 edges = createEdgeSprites();
  if (gameState===PLAY){
    score = score + Math.round(getFrameRate()/60);
    bg.velocityX = -(6 + 3*score/100);
    
    
    if(keyDown("space") && runner.y >= 159) {
      runner.velocityY = -12;
    }
  
   runner.velocityY = runner.velocityY + 0.8
  
    if (bg.x < 200){
      bg.x = bg.width/2;
    }
  
    spawnClouds();
    spawnObstacles();
  
    if(obstaclesGroup.isTouching(runner)){
        gameState = END;
    }
  }
  else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    
    //set velcity of each game object to 0
    bg.velocityX = 0;
    runner.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    
    
    
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    
    if(mousePressedOver(restart)) {
      reset();
    }
  }
  
  drawSprites();
 runner.collide(edges[3]);
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 100 === 0) {
    var cloud = createSprite(600,120,40,10);
    
    cloud.y = Math.round(random(80,120));
    cloud.addImage(cloudImage);
    cloud.scale = 0.08;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 200;
    
    //adjust the depth
    cloud.depth = runner.depth;
    runner.depth = runner.depth + 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
  
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  score = 0;
}

function spawnObstacles() {
  if(frameCount % 80 === 0) {
    var obstacle = createSprite(600,370,10,40);
    //obstacle.debug = true;
    obstacle.velocityX = -(6 + 3*score/100);
    
    //generate random obstacles
    var rand = Math.round(random(1,3));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      default: break;
    }
    
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.2;
    obstacle.lifetime = 300;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
     obstacle.debug = false;
    obstacle.setCollider("rectangle",0,0,250,250);
  }
}

