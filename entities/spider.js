function spiderAct() {
  if (handleDeath(this)) { return }

  if (handleNearbyEnemy(this)) { return }

  if (this.mode === 'seeking') {
    if (!this.searchTarget) {
      this.searchTarget = { x: rand(canvasX), y: rand(canvasY) }
    }

    moveTo(this, this.searchTarget)
  }
}

function makeSpider() {
  const spider = {}
  spider.mode = 'seeking'
  spider.type = 'spider'
  spider.alliance = 'spider'
  spider.amountName = 'Ants Killed'
  spider.hp = 20
  spider.amount = 0
  spider.attackPower = 5
  spider.title = soldierNames[rand(soldierNames.length)]
  spider.x = rand(canvasX)
  spider.y = rand(canvasY)
  spider.id = getId();
  spider.speed = 2
  spider.act = spiderAct
  spider.width = function() {
    return (7 + this.amount) * 3
  }
  spider.render = function() {
    const ctx = canvas.getContext("2d");
    const squareWidth = 7 + this.amount
    const offSet = squareWidth / 2
    const baseX = this.x - offSet
    const baseY = this.y - offSet
    ctx.fillStyle = "rgb(120 40 120)";

    ctx.fillRect(baseX, baseY, squareWidth, squareWidth);
    ctx.fillRect(baseX - squareWidth, baseY - squareWidth, squareWidth, squareWidth);
    ctx.fillRect(baseX + squareWidth, baseY - squareWidth, squareWidth, squareWidth);
    ctx.fillRect(baseX - squareWidth, baseY + squareWidth, squareWidth, squareWidth);
    ctx.fillRect(baseX + squareWidth, baseY + squareWidth, squareWidth, squareWidth);
  }
  game.entities.push(spider)
}