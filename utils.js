function rand(max) {
  return Math.floor(Math.random() * max);
}

function nearby(a, b, val) {
  return Math.abs(a.x - b.x) <= val && Math.abs(a.y - b.y) <= val
}

function collides(a, b) {
  const buffer = 2
  const val = (a.width(a) / 2) + (b.width(b) / 2) + buffer
  return Math.abs(a.x - b.x) <= val && Math.abs(a.y - b.y) <= val
}
