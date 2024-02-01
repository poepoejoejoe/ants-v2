let canvas;
const canvasX = 1024;
const canvasY = 1024;
const antCost = 5;
const soldierCost = 10;
let keyBindType;

function moveKeyUp(e, keyUp) {
  e.moveUp = !keyUp
}

function moveKeyLeft(e, keyUp) {
  e.moveLeft = !keyUp
}

function moveKeyDown(e, keyUp) {
  e.moveDown = !keyUp
}

function moveKeyRight(e, keyUp) {
  e.moveRight = !keyUp
}

const movementKeyBinds = {
  w: moveKeyUp,
  a: moveKeyLeft,
  s: moveKeyDown,
  d: moveKeyRight,
  "ArrowUp": moveKeyUp,
  "ArrowRight": moveKeyRight,
  "ArrowDown": moveKeyDown,
  "ArrowLeft": moveKeyLeft,
}

const keyBindInfo = {
  buyAnt: {
    title: 'Spawn Worker Ant',
    info: `Costs ${antCost} Food`
  },
  buySoldier: {
    title: 'Spawn Soldier',
    info: `Costs ${soldierCost} Food`
  },
  moveKeyUp: {
    title: 'Up',
  },
  moveKeyRight: {
    title: 'Right',
  },
  moveKeyDown: {
    title: 'Down',
  },
  moveKeyLeft: {
    title: 'Left',
  },
}

function initializeGameSate(colony) {
  for (let i = 0; i < 1; i++) {
    makeAnt(colony)
  }

  for (let i = 0; i < 5; i++) {
    makeFood()
  }

  for (let i = 0; i < 1; i++) {
    makeSpider()
  }
}

const colony = makeColony()
initializeGameSate(colony)

function runRandomChanceEvents() {
  const randChanceForFood = rand(80 * 1000) == 0
  const noFoodLeft = game.entities.filter((food) => food.type === 'food').length === 0
  if (randChanceForFood || noFoodLeft) { makeFood() }
  if (rand(100 * 1000) == 0) { makeSpider() }
}

function runGameLoop() {
  game.entities.forEach((entity) => {
    if (entity.act) { entity.act() }
    runRandomChanceEvents()
  })
}

function renderGame() {
  const context = canvas.getContext('2d');
  context.clearRect(0, 0, canvas.width, canvas.height);

  game.entities.forEach((entity) => {
    if (entity.render) { entity.render() }
  })

  renderControlPanel()
  renderSidePanel()
}

document.addEventListener("DOMContentLoaded", function () {
  canvas = document.getElementById('game')
  canvas.addEventListener("click", (event) => {
    const relativeTarget = { x: event.offsetX, y: event.offsetY }
    clickedEntity = game.entities.find((entity) => {
      return nearby(relativeTarget, entity, 20);
    });
    if (clickedEntity) {
      console.log(clickedEntity)
      controlledEntity = clickedEntity
    } else {
      controlledEntity = colony
    }
  })

  canvas.addEventListener('mousemove', (event) => {
    const relativeTarget = { x: event.offsetX, y: event.offsetY }
    nearbyEntity = game.entities.find((entity) => {
      return nearby(relativeTarget, entity, 20);
    });
    if (nearbyEntity) {
      canvas.classList.add('pointer')
    } else {
      canvas.classList.remove('pointer')
    }
  })

  setInterval(() => {
    renderGame()
  }, 10)

  setInterval(() => {
    runGameLoop()
  }, 80)
});

document.addEventListener("keydown", (event) => {
  if (controlledEntity) {
    if (event.key === 'Escape') {
      controlledEntity = colony
    }

    const keyBinds = controlledEntity.keyBinds
    if (keyBinds) {
      const keyBoundFunction = keyBinds[event.key]
      if (keyBoundFunction) {
        keyBoundFunction(controlledEntity)
      }
    }
  }

  const keyEl = document.getElementById(`key-${event.key}`)
  if (keyEl) {
    keyEl.classList.add('fade');
  }
});

document.addEventListener("keyup", (event) => {
  const keyEl = document.getElementById(`key-${event.key}`)
  if (keyEl) {
    keyEl.classList.remove('fade');
  }
  if (controlledEntity) {
    const keyBinds = controlledEntity.keyBinds
    if (keyBinds) {
      const keyBoundFunction = keyBinds[event.key]
      if (keyBoundFunction) {
        keyBoundFunction(controlledEntity, true)
      }
    }
  }
});

