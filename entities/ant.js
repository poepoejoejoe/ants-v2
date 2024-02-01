function visitPheromone(e, p) {
  e.visitedPheromoneIds.push(p.id)
  if (e.visitedPheromoneIds.length > 10) {
    e.visitedPheromoneIds.shift()
  }
}

function handleHoldingFood(e, nearbyPheromone) {
  const closeP = nearbyPheromone.find((p) => collides(p, e))
  if (closeP) {
    closeP.amount += e.foodLeft / 5
  } else {
    const newP = makePheromone(e, e.foodLeft / 2)
    visitPheromone(e, newP)
  }
}

function handleDumping(e) {
  e.mode = 'dumping'
  e.amount -= 1
  e.colony.amount += 1
}

function handleEating(e, foodToEat) {
  e.mode = 'eating'
  e.amount += 1
  foodToEat.amount -= 1
  e.foodLeft = foodToEat.amount
}

function antAct() {
  if (handleDeath(this)) { return }
  if (handleNearbyEnemy(this)) { return }

  const closePheromones = game.entities.filter((p) => p.type === 'pheromone' && nearby(p, this, 15) && p.amount >= 1);
  const nearbyPheromone = closePheromones.filter((p) => !this.visitedPheromoneIds.includes(p.id))

  const visitedPheromone = nearbyPheromone.find((p) => collides(p, this))
  if (visitedPheromone) {
    visitPheromone(this, visitedPheromone)
  }

  if (this.amount > 0) {
    handleHoldingFood(this, nearbyPheromone)
  }

  if (nearby(this, this.colony, 4) && this.amount > 0) {
    handleDumping(this)
    return
  }

  // handle all done dumping
  if (this.mode === 'dumping' && this.amount <= 0) {
    this.mode = 'seeking'
  }

  const foodToEat = game.entities.find((food) => food.type === 'food' && collides(food, this) && food.amount >= 1);
  if (foodToEat && this.amount < this.capicity) {
    handleEating(this, foodToEat)
    return
  }

  // handle all done eating
  if (this.mode === 'eating') {
    if (this.amount >= this.capicity || !foodToEat) {
      this.mode = 'seeking'
      this.searchTarget = colony
    }
  }

  if (this.mode === 'seeking') {
    if (handleControllable(this)) { return }

    if (!this.searchTarget) {
      this.searchTarget = { x: rand(canvasX), y: rand(canvasY) }
    }

    const foodToSmell = game.entities.find((food) => food.type === 'food' && nearby(food, this, 100) && food.amount >= 1);
    if (foodToSmell && this.amount === 0) {
      moveTo(this, foodToSmell)
      return
    }

    if (nearbyPheromone.length > 0 && this.amount === 0) {
      const maxPheromone = nearbyPheromone.reduce((maxP, p) => {
        if (p.amount > maxP.amount) {
          return p
        } else {
          return maxP
        }
      })

      if (this.searchTarget != colony) {
        moveTo(this, maxPheromone)
        return
      }
    }

    moveTo(this, this.searchTarget)
  }
}

function makeAnt(colony) {
  const ant = {}
  ant.mode = 'seeking'
  ant.type = 'ant'
  ant.alliance = 'ant'
  ant.amountName = 'Food Held'
  ant.capicity = 5
  ant.amount = 0
  ant.hp = 5
  ant.attackPower = 2
  ant.title = antNames[rand(antNames.length)]
  ant.x = colony.x + rand(50) - 25;
  ant.y = colony.y + rand(50) - 25;
  ant.colony = colony
  ant.id = getId();
  ant.visitedPheromoneIds = []
  ant.keyBinds = {
    ...movementKeyBinds
  }
  ant.width = function() {
    return 10 + this.amount
  }
  ant.act = antAct
  ant.render = function() {
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "rgb(0 0 0)";
    const width = this.width()
    const offset = width / 2
    ctx.fillRect(this.x - offset, this.y - offset, width, width);
  }
  game.entities.push(ant)
}