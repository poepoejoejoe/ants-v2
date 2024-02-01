function buyAnt(colony, keyUp) {
  if (keyUp) { return } // means spammable

  if (colony.amount >= antCost) {
    colony.amount -= antCost
    makeAnt(colony)
  }
}

function buySoldier(colony, keyUp) {
  if (keyUp) { return } // means spammable

  if (colony.amount >= soldierCost) {
    colony.amount -= soldierCost
    makeSoldier(colony)
  }
}

const colonyKeybinds = {
  "1": buyAnt,
  "2": buySoldier,
}

function makeColony() {
  const colony = {}
  colony.type = 'colony'
  colony.amount = 20
  colony.amountName = 'Food Stored'
  colony.title = 'The Great Colony'
  colony.x = rand(canvasX);
  colony.y = rand(canvasY);
  colony.id = getId();
  colony.keyBinds = colonyKeybinds
  colony.width = () => {
    return 25
  }
  colony.render = function() {
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "rgb(139,69,19)";
    const width = this.width()
    const offset = width / 2
    ctx.fillRect(this.x - offset, this.y - offset, width, width);
  }

  game.entities.push(colony)

  return colony
}
