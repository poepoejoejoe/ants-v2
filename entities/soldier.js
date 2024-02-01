function soldierAct() {
  if (handleDeath(this)) { return }
  
  if (handleNearbyEnemy(this)) { return }

  if (this.mode === 'seeking') {
    if (handleControllable(this)) { return }

    if (!this.searchTarget) {
      this.searchTarget = { x: rand(canvasX), y: rand(canvasY) }
    }

    moveTo(this, this.searchTarget)
  }
}

function makeSoldier(colony) {
  const soldier = {}
  soldier.mode = 'seeking'
  soldier.type = 'soldier'
  soldier.alliance = 'ant'
  soldier.amountName = 'Enemies Killed'
  soldier.amount = 0
  soldier.hp = 10
  soldier.speed = 2
  soldier.attackPower = 5
  soldier.title = soldierNames[rand(soldierNames.length)]
  soldier.x = colony.x + rand(200) - 25;
  soldier.y = colony.y + rand(200) - 25;
  soldier.colony = colony
  soldier.id = getId();
  soldier.width = function() {
    return 10 + this.amount
  }
  soldier.keyBinds = {
    ...movementKeyBinds
  }
  soldier.act = soldierAct
  soldier.render = function() {
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "rgb(220 80 20)";
    const width = this.width()
    const offset = width / 2
    ctx.fillRect(this.x - offset, this.y - offset, width, width);
  }
  game.entities.push(soldier)
}