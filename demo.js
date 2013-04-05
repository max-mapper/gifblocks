var textures = "http://commondatastorage.googleapis.com/voxeltextures/"
var instructions = document.querySelector('#blocker')
var images = document.querySelector('#images')
var exportButton = document.querySelector('#export')
var resetButton = document.querySelector('#reset')
var message = document.querySelector('#middleMessage')

var game = require('voxel-hello-world')({
  texturePath: textures,
  playerSkin: textures + 'player.png',
  interactElement: instructions,
  container: document.querySelector('#left'),
  statsDisabled: true
})

message.innerHTML = "Click to play!"
if (game.notCapable()) instructions.style.visibility = 'hidden'

game.interact.on('attain', function() { instructions.style.visibility = 'hidden' })
game.interact.on('release', function() { instructions.style.visibility = 'visible' })

document.addEventListener('keydown', function(e) {
  if (e.keyCode === 13) shutter()
})

exportButton.addEventListener('click', function(e) {
  if (images.innerHTML === "") return
  window.open(stopMotion.export())
})

resetButton.addEventListener('click', function(e) {
  images.innerHTML = ""
  stopMotion.createEncoder()
})

function shutter() {
  var imageURI = stopMotion.shutter()
  var img = new Image()
  img.src = imageURI
  images.appendChild(img)
}

var stopMotion = require('voxel-stop-motion')(game)
window.stop = stopMotion
window.game = game

stopMotion.cam.position.y = 7
stopMotion.cam.position.z = 10
stop.cam.rotation.x = -0.125

