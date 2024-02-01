function removeEntity(entity) {
  const index = game.entities.findIndex((e) => {
    return e.id === entity.id
  })
  if (index > -1) {
    game.entities.splice(index, 1)
  }
}

function handleControllable(e) {
  if (controlledEntity?.id === e.id) {
    if (e.moveUp) { moveUp(e) }
    if (e.moveDown) { moveDown(e) }
    if (e.moveRight) { moveRight(e) }
    if (e.moveLeft) { moveLeft(e) }

    return true
  }

  return false
}


function isEnemy(a, b) {
  return a.alliance && b.alliance && a.alliance !== b.alliance
}

function handleNearbyEnemy(e) {
  const nearbyEnemy = game.entities.find((enemy) => isEnemy(e, enemy) && nearby(e, enemy, 100))
  if (nearbyEnemy) {
    e.searchTarget = nearbyEnemy

    if (collides(e, nearbyEnemy)) {
      e.mode = 'attacking'
      nearbyEnemy.hp -= e.attackPower
      nearbyEnemy.lastAttacker = e
      return true
    }
  } else {
    if (e.mode === 'attacking') {
      e.mode = 'seeking'
    }
  }

  return false
}

function handleDeath(e) {
  if (e.hp <= 0) {
    if (e.lastAttacker) {
      // this means when a work kills something they get a lil food?
      e.lastAttacker.amount += 1
    }
    removeEntity(e)
    return true
  }

  return false
}


