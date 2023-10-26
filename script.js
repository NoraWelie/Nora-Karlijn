var bommen = [];
//lijst van de bommen
var levens = 1;
//Het aantal levens aan het begin van het spel
var bezetteKolommen = [];
var appel2;

let appelBadge = false;
//je hebt de badge nog niet
let tijdBadge = false;
//zodat je de badge nog niet krijgt
let startTime;
let gespeeldeTijd = 0;
//zorgt ervoor dat aan het begin van het spel de tijd wordt gereset



class Raster {
  constructor(r,k) {
    this.aantalRijen = r;
    this.aantalKolommen = k;
    this.celGrootte = null;
    this.orangeRegel = r;
  }

  berekenCelGrootte() {
    this.celGrootte = canvas.width / this.aantalKolommen;
  }

  teken() {
    push();
    noFill();
    stroke('grey');
    for (var rij = 0;rij < this.aantalRijen;rij++) {
      for (var kolom = 0;kolom < this.aantalKolommen;kolom++) {
        if (rij === this.orangeRegel - 1 || kolom === this.orangeRegel + 5) {
          fill('orange');
        } else{
          noFill();
        }
        rect(kolom*this.celGrootte,rij*this.celGrootte,this.celGrootte,this.celGrootte);
      }
    }
    pop();
  }
}

class Jos {
  constructor() {
    this.x = 0;
    this.y = 300;
    this.animatie = [];
    this.frameNummer =  3;
    this.stapGrootte = null;
    this.gehaald = false;
  }


  beweeg() {
    if (keyIsDown(65)) {
      this.x -= this.stapGrootte;
      this.frameNummer = 2;
    }
    if (keyIsDown(68)) {
      this.x += this.stapGrootte;
      this.frameNummer = 1;
    }
    if (keyIsDown(87)) {
      this.y -= this.stapGrootte;
      this.frameNummer = 4;
    }
    if (keyIsDown(83)) {
      this.y += this.stapGrootte;
      this.frameNummer = 5;
    }
    //zorgt voor de WASD controls

    this.x = constrain(this.x,0,canvas.width);
    this.y = constrain(this.y,0,canvas.height - raster.celGrootte);
    //zodat Jos niet buiten het speelveld kan

    if (this.x == canvas.width) {
      this.gehaald = true;
    //Als jos de rechterkant van het canvas haalt dat heeft jos het gehaald
    }
  }

  wordtGeraakt(vijand) {
    if (this.x == vijand.x && this.y == vijand.y) {
      return true;
      //als jos op dezelfde plek staat als een vijand wordt het op waar gezet
    }
    else {
      return false;
    }
  }

  eet(appel){
    return this.x === appel.x && this.y === appel.y;
    //definieerd eet(appel), dus wanneer de x en de y coordinaat hetzelfde zijn van jos en de appel
  }

  wordtGeraakt(bom) {
  const afstand = dist(this.x, this.y, bom.x, bom.y);
  return afstand < raster.celGrootte / 2; 
  //als de bom wordt geraakt
}

  toon() {
    image(this.animatie[this.frameNummer],this.x,this.y,raster.celGrootte,raster.celGrootte);
  }
}  

class Vijand {
  constructor(x,y) {
    this.x = x;
    this.y = y;
    this.sprite = null;
    this.stapGrootte = null;
  }

  beweeg() {
    this.x += floor(random(-1,2))*this.stapGrootte;
    this.y += floor(random(-1,2))*this.stapGrootte;
//dat de vijanden random bewegen met een standaard stapgrootte
    this.x = constrain(this.x,0,canvas.width - raster.celGrootte);
    this.y = constrain(this.y,0,canvas.height - raster.celGrootte);
  //dat de vijanden binnen het speelveld blijven
  }

  toon() {
    image(this.sprite,this.x,this.y,raster.celGrootte,raster.celGrootte);
    //hoe groot de vijanden moeten zijn
  }
}

class Appel{
  constructor() {
this.x = Math.floor(Math.random() * (canvas.width / raster.celGrootte)) * raster.celGrootte;
    this.y = Math.floor(Math.random() * (canvas.height / raster.celGrootte)) * raster.celGrootte; 
//zodat de appel op een random plek staat binnen een rasterhokje
    this.sprite = null;
//er is nog geen plaatje gekoppeld aan de appel
  }
  toon(){   image(this.sprite,this.x,this.y,raster.celGrootte,raster.celGrootte);
         //grootte afbeelding
  }
}

class Bom{
  constructor(x,y) {
    this.x = x;
    this.y = y;
    this.sprite = null;
    this.stapGrootte = null;
    this.speed = null;
    this.direction = 1;
  }

  beweeg() {
    const maxY = canvas.height - raster.celGrootte;
      if (this.y < 0) {
      this.direction = 1;
      this.y = 0;
    } else if (this.y > maxY) {
      this.direction = -1;
      this.y = maxY; 
    }

    //zodat de bommen/vogeltjes op en neer bewegen en niet helemaal het speelveld uitbewegen

    this.y += this.direction * this.speed;
  }


  toon() {
    image(this.sprite,this.x,this.y,raster.celGrootte,raster.celGrootte);
    //de grootte van de vogels is gelijk aan een rasterhokje
  }
}

class Badges{
  constructor (x,y){
    this.x = x;
    this.y = y;
    this.sprite = null;
    this.size = 20;
  }

}

function preload() {
  brug = loadImage("images/backgrounds/city_skyline.png");
  //laadt de achtergrond
}


function setup() {
  canvas = createCanvas(900,600);
  canvas.parent();
  frameRate(10);
  textFont("Verdana");
  textSize(90);
  startTime = millis();

  raster = new Raster(12,18);

  raster.berekenCelGrootte();

  eve = new Jos();
  eve.stapGrootte = 1*raster.celGrootte;
  for (var b = 0;b < 6;b++) {
    frameEve = loadImage("images/sprites/Eve100px/Eve_" + b + ".png");
    eve.animatie.push(frameEve);
  }

  alice = new Vijand(700,200);
  alice.stapGrootte = 1*eve.stapGrootte;
  alice.sprite = loadImage("images/sprites/bij.png");

  bob = new Vijand(600,400);
  bob.stapGrootte = 1*eve.stapGrootte;
  bob.sprite = loadImage("images/sprites/bee.png");  

  appel = new Appel;
  appel.sprite = loadImage("images/sprites/appel_2.png");

    for (var i = 0; i < 5; i++) {
        var x, y;
    do {
      x = (Math.floor(Math.random() * (canvas.width / raster.celGrootte / 2)) + Math.floor(canvas.width / raster.celGrootte / 2)) * raster.celGrootte;
  } while (bezetteKolommen.includes(x));

    y = Math.floor(random(canvas.height - raster.celGrootte));
    var bom = new Bom(x,y);
    bom.stapGrootte = 1 * eve.stapGrootte;
    bom.sprite = loadImage("images/sprites/bluebird_L.png");
    bommen.push(bom);
    bezetteKolommen.push(x);
    bom.speed = random(5,20);
  }
  appel2 = new Badges(20, 70);
  appel2.sprite = loadImage("images/sprites/appel_2.png");
}

function draw() {
  background(brug);
  raster.teken();
  eve.beweeg();
  alice.beweeg();
  bob.beweeg();

  eve.toon();
  alice.toon();
  bob.toon();
  appel.toon();

  gespeeldeTijd = millis() - startTime;

  for (var i = 0; i < bommen.length; i++) {
  var bom = bommen[i];
  bom.beweeg();

  if (bom.y < 0 || bom.y > canvas.height - raster.celGrootte) {
    bom.direction *= -1;
  }

  bom.toon();

  if (eve.wordtGeraakt(bom)) {
    levens -= 1;
  }
}

  if (eve.wordtGeraakt(alice) || eve.wordtGeraakt(bob)) {
    levens -= 1;
  }

  if (eve.eet(appel)){
    levens += 1;
    appel = new Appel();
    appel.sprite = loadImage("images/sprites/appel_2.png");
  }

  textSize(20); 
  fill('black'); 
  text("Aantal levens: " + levens, 10, 30);
  text("Gespeelde tijd: " + Math.floor(gespeeldeTijd / 1000) + " seconden", 10, 50);

  if (levens === 0){
    tijdBadge = false;
    appelBadge = false;
    background('maroon');
    textSize(60);
    fill('white');
    text("Helaas Pindakaas!",190,300);
    noLoop();
    textSize(20);
    text("Klik op Enter om opnieuw te spelen", 260, 350);
    document.addEventListener('keydown', function(event) {
      if (event.key === "Enter") {
          location.reload();
  }
});
  } 

  if (levens === 15){
    appelBadge = true;
  }

  if (appelBadge === true){
    textSize(17); 
    fill('black'); 
    text("Appelverzamelaar: 15x", 10, 70);
    image(appel2.sprite, 210, 53, appel2.size, appel2.size);
  }

  if (Math.floor(gespeeldeTijd / 1000) === 30){
    tijdBadge = true;
  }
  
  if (tijdBadge === true){
    textSize(17); 
    fill('black'); 
    text("Tijd Badge : 30 seconden", 10, 90);
  }

  if (eve.gehaald) {
    tijdBadge = false;
    appelBadge = false;
    textSize(60);
    background
    fill('white');
    text("Je hebt gewonnen!",180,300);
    noLoop();
    textSize(20);
      text("Klik op Enter om opnieuw te spelen", 260, 350);
      document.addEventListener('keydown', function(event) {
        if (event.key === "Enter") {
            location.reload();
      }
    });
  }
}

