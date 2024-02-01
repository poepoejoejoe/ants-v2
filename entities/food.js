function makeFood() {
  const food = {}
  food.type = 'food'
  food.title = 'Food'
  food.amountName = 'Food Stored'
  food.x = colony.x + ((rand(200) - 100) * 2);
  food.y = colony.y + ((rand(200) - 100) * 2);
  // food.x = rand(canvasX)
  // food.y = rand(canvasY)
  food.amount = 5 || rand(50);
  food.id = getId();
  food.width = function() {
    return this.amount
  }
  food.act = function() {
    if (this.amount <= 0) { removeEntity(this) }
  }
  food.render = function() {
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "rgb(144,238,144)";
    const width = this.width()
    const offset = width / 2
    ctx.fillRect(this.x - offset, this.y - offset, width, width);
  }

  game.entities.push(food)

  return food
}
