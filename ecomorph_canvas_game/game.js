const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let currentScene = "intro";
let stats = { speed: 80, water: 10, strength: 40, camouflage: 10 };
let timePassed = 0;
let tapCount = 0;
let lastTapTime = 0;
let questActive = false;
let bckimg = new Image();
let monitor = new Image();
let huntBtn = new Image();
let fightBtn = new Image();
let drinkBtn = new Image();
let lion = new Image();
let sitting_lion = new Image();
let lion_flipped = new Image();
let mainSceneEnteredAt = null;
let water_text = new Image();
let strength_text = new Image();
let speed_text = new Image();
let camo_text = new Image();

let introIndex = 0;
const introImages = [new Image(), new Image(), new Image()];

let endingImage = new Image();
let questsCompleted = { quest1: false, quest2: false, quest3: false };
let showEnding = false;
let endingShownAt = null;

const tapProgressImages = [];
const sharedStatImages = [];
const timeImages = [];

const buttonBounds = {
  hunt: { x: 670, y: 120, width: 115, height: 150 },
  fight: { x: 290, y: 370, width: 115, height: 150 },
  drink: { x: 870, y: 540, width: 115, height: 150 },
};

const traitButtons = [
  {
    name: "Webbed feet",
    x: 360, y: 70, width: 300, height: 325,
    image: new Image(),
    effect: () => {
      stats.water = Math.min(100, stats.water + 30);
      stats.speed = Math.max(0, stats.speed - 20);
      stats.strength = Math.max(0, stats.strength - 10);
    }
  },
  {
    name: "Elongated tail",
    x: 760, y: 70, width: 300, height: 325,
    image: new Image(),
    effect: () => {
      stats.speed = Math.min(100, stats.speed + 20);
      stats.camouflage = Math.max(0, stats.camouflage - 10);
    }
  },
  {
    name: "Hydrophobic fur",
    x: 360, y: 430, width: 300, height: 325,
    image: new Image(),
    effect: () => {
      stats.water = Math.min(100, stats.water + 20);
      stats.camouflage = Math.min(100, stats.camouflage + 10);
    }
  },
  {
    name: "Bigger lung capacity",
    x: 760, y: 430, width: 300, height: 325,
    image: new Image(),
    effect: () => {
      stats.strength = Math.min(100, stats.strength + 20);
      stats.water = Math.min(100, stats.water + 10);
    }
  }
];


function preloadImages() {
  // Shared stat images (0 to 100 by 10s)
  for (let i = 0; i <= 100; i += 10) {
    const img = new Image();
    img.src = `assets/stat_${i}.png`;  // Just one set of images like stat_0.png to stat_100.png
    sharedStatImages.push(img);
  }

  // Time images (0 to 120 by 10s)
  for (let i = 0; i <= 120; i += 10) {
    const img = new Image();
    img.src = `assets/time_${i}.png`;
    timeImages.push(img);
  }
  
  for (let i = 0; i <= 10; i++) {
    const img = new Image();
    img.src = `assets/tap_${i}.png`; // tap_0.png to tap_10.png
    tapProgressImages.push(img);
  }

  introImages[0].src = "assets/intro1.png";
  introImages[1].src = "assets/intro2.png";
  introImages[2].src = "assets/intro3.png";
  endingImage.src = "assets/ending.png";

  lion.src = 'assets/walking_lion.png';
  sitting_lion.src = 'assets/sitting_lion.png';
  lion_flipped.src = 'assets/lion_flipped.png';
  bckimg.src = 'assets/bck.png';
  monitor.src = 'assets/monitor_case.png';
  huntBtn.src = 'assets/btn_hunt.png';
  fightBtn.src = 'assets/btn_fight.png';
  drinkBtn.src = 'assets/btn_drink.png';
  water_text.src = 'assets/water.png';
  strength_text.src = 'assets/strength.png';
  speed_text.src = 'assets/speed.png';
  camo_text.src = 'assets/camouflage.png';

  traitButtons[0].image.src = "assets/trait_webbed.png";
  traitButtons[1].image.src = "assets/trait_tail.png";
  traitButtons[2].image.src = "assets/trait_fur.png";
  traitButtons[3].image.src = "assets/trait_lungs.png";
}

function isInside(x, y, bounds) {
  return (
    x >= bounds.x &&
    x <= bounds.x + bounds.width &&
    y >= bounds.y &&
    y <= bounds.y + bounds.height
  );
}

function drawIntro() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(introImages[introIndex], 0, 0, canvas.width, canvas.height);
}
function drawStats() {
  const keys = Object.keys(stats);
  keys.forEach((key, index) => {
    let value = Math.max(0, Math.min(stats[key], 100));
    ctx.drawImage(sharedStatImages[value / 10], 10, 300 + index * 140, sharedStatImages[value / 10].width*0.5, sharedStatImages[value / 10].height*0.5);
    ctx.drawImage(speed_text, 12, 240, speed_text.width /2, speed_text.height /2)
    ctx.drawImage(water_text, 12, 340, water_text.width /2, water_text.height /2)
    ctx.drawImage(strength_text, 12, 520, strength_text.width /2, strength_text.height /2)
    ctx.drawImage(camo_text, 12, 660, camo_text.width /2, camo_text.height /2)
  });

}


function drawTime() {
  const timeIdx = Math.min(timePassed / 10, 12);
  ctx.drawImage(timeImages[timeIdx], 250, 5, timeImages[timeIdx].width * 0.5, timeImages[timeIdx].height*0.5 );
}

function drawMain() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(bckimg, 110, -5, bckimg.width*1.05, bckimg.height*1.05);
  drawTime();
  ctx.drawImage(monitor, 0, 0, canvas.width, canvas.height);
  drawStats();

  ctx.drawImage(huntBtn, buttonBounds.hunt.x, buttonBounds.hunt.y, buttonBounds.hunt.width, buttonBounds.hunt.height);
  ctx.drawImage(fightBtn, buttonBounds.fight.x, buttonBounds.fight.y, buttonBounds.fight.width, buttonBounds.fight.height);
  ctx.drawImage(drinkBtn, buttonBounds.drink.x, buttonBounds.drink.y, buttonBounds.drink.width, buttonBounds.drink.height);
  if (!currentScene.startsWith("quest")) {
  ctx.drawImage(sitting_lion, 510, 260, sitting_lion.width * 1/2, sitting_lion.height * 1/2);
}
}

function drawTraits() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(monitor, 0, 0, canvas.width, canvas.height);
  drawStats();

  traitButtons.forEach((trait, i) => {
    ctx.drawImage(trait.image, trait.x, trait.y, trait.width, trait.height);
    ctx.fillStyle = "#000";
    ctx.font = "16px monospace";
  });
}


function drawQuestOverlay() {
   const scale = 0.5;
  if (currentScene === "quest2") {
    ctx.drawImage(lion_flipped, 310, 390, lion_flipped.width * scale, lion_flipped.height * scale);
  } else if (currentScene === "quest1") {
    ctx.drawImage(lion, 460, 150, lion.width * scale, lion.height * scale);
  } else if (currentScene === "quest3") {
    ctx.drawImage(lion, 650, 580, lion.width * scale, lion.height * scale);
  }

  const img = tapProgressImages[Math.min(tapCount, 10)];
  ctx.drawImage(img, canvas.width / 3, canvas.height / 2 - 100, img.width / 2, img.height / 2);

 
}

function drawEnding() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(endingImage, 0, 0, canvas.width, canvas.height);
}

function switchScene(name) {
  currentScene = name;
}

canvas.addEventListener("click", function (e) {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  if (showEnding) {
    // Restart the game
    currentScene = "intro";
    introIndex = 0;
    questsCompleted = { quest1: false, quest2: false, quest3: false };
    timePassed = 0;
    tapCount = 0;
    showEnding = false;
    endingShownAt = null;
    return;
  }

  if (currentScene === "intro") {
    if (introIndex < introImages.length - 1) {
      introIndex++;
    } else {
      switchScene("main");
      mainSceneEnteredAt = Date.now();
    }
    return;
  }

  if (currentScene === "main") {
    if (isInside(x, y, buttonBounds.hunt)) {
      currentScene = "quest1";
      questActive = false;
    } else if (isInside(x, y, buttonBounds.fight)) {
      currentScene = "quest2";
      questActive = false;
    } else if (isInside(x, y, buttonBounds.drink)) {
      currentScene = "quest3";
      questActive = false;
    }
  }

  if (currentScene === "traits") {
    traitButtons.forEach((trait) => {
      if (
        x >= trait.x &&
        x <= trait.x + trait.width &&
        y >= trait.y &&
        y <= trait.y + trait.height
      ) {
        trait.effect();
        switchScene("main");
      }
    });
  } else if (currentScene.startsWith("quest")) {
    const now = Date.now();
    if (!questActive) {
      questActive = true;
      tapCount = 0;
    } else if (now - lastTapTime < 200) {
      tapCount++;
      if (tapCount >= 10) {
        timePassed = Math.min(120, timePassed + 10);
        questsCompleted[currentScene] = true;
        switchScene("main");
        questActive = false;

        // Check if all quests done
        if (
          questsCompleted.quest1 &&
          questsCompleted.quest2 &&
          questsCompleted.quest3
        ) {
          endingShownAt = Date.now();
        }
      }
    } else {
      tapCount = Math.max(0, tapCount - 1);
    }
    lastTapTime = now;
  }
});

function gameLoop() {
  // Handle timed scene switch
  if (currentScene === "main" && mainSceneEnteredAt) {
    const elapsed = Date.now() - mainSceneEnteredAt;
    if (elapsed > 1000) { // 1 second delay
      switchScene("traits");
      mainSceneEnteredAt = null; // prevent repeat
    }
  }

  if (endingShownAt && Date.now() - endingShownAt > 1000 && !showEnding) {
  showEnding = true;
  }
  // Scene rendering logic
  switch (currentScene) {
    case "intro":
      drawIntro();
      break;
    case "main":
      drawMain();
      break;
    case "traits":
      drawTraits();
      break;
    case "quest1":
    case "quest2":
    case "quest3":
      drawMain();
      drawQuestOverlay();
      break;
  }
  if (showEnding) {
    drawEnding();
  }
  requestAnimationFrame(gameLoop);
}
preloadImages();
gameLoop();

document.getElementById('backBtn').onclick = function() {
  window.history.back();
};
