var textures = "http://commondatastorage.googleapis.com/voxeltextures/"
var instructions = document.querySelector('#blocker')
var images = document.querySelector('#images')
var exportButton = document.querySelector('#export')
var resetButton = document.querySelector('#reset')
var message = document.querySelector('#middleMessage')
var createSelect = require('voxel-select')
var highlight = require('voxel-highlight')
var transforms = require('voxel-transforms')
var fly = require('voxel-fly')
var toolbar = require('toolbar')

var game = require('voxel-hello-world')({
  materials: [
    ['grass', 'dirt', 'grass_dirt'],
    'obsidian',
    'brick',
    'grass',
    'plank',
    'whitewool'
  ],
  texturePath: textures,
  playerSkin: textures + 'player.png',
  interactElement: instructions,
  container: document.querySelector('#left'),
  statsDisabled: true
}, setup)

function setup(game, avatar) {
  
  var makeFly = fly(game)
  makeFly(game.controls.target())

  var currentMaterial = 1

  toolbar('.bar-tab').on('select', function(item) {
    currentMaterial = item
  })
  
  avatar.position.copy({x: 2, y: 6, z: 4})
  
  var select = createSelect(game)
  window.sel = select
  
  var blockPosPlace, blockPosErase
  var hl = game.highlighter = highlight(game, { color: 0x000000, distance: 100 })
  hl.on('highlight', function (voxelPos) { blockPosErase = voxelPos })
  hl.on('remove', function (voxelPos) { blockPosErase = null })
  hl.on('highlight-adjacent', function (voxelPos) { blockPosPlace = voxelPos })
  hl.on('remove-adjacent', function (voxelPos) { blockPosPlace = null })
  hl.on('highlight-deselect', function(pos) {
    select.reset()
    select.set(pos.start, pos.end, true)
    var bounds = select.bounds()
    switch (dropdown.value) {
      case 'overlay': return select.transform(transforms.overlay(currentMaterial))
      case 'walls': return transforms.walls(game, bounds[0], bounds[1], currentMaterial)
      case 'erase': return select.transform(transforms.erase)
      case 'move': return transforms.move(game, bounds[0], bounds[1], [0, 5, 0])
      case 'replace': return select.transform(transforms.replace(currentMaterial, 1))
      case 'fill': return select.transform(transforms.replace(currentMaterial, 0))
      case 'deselect': return select.reset()
      case 'nothing': return
    }
  })

  var shiftDown = false

  window.addEventListener('keydown', function (ev) {
    if (ev.keyCode === 16) shiftDown = true
    if (ev.keyCode === 'R'.charCodeAt(0)) avatar.toggle()
    if (ev.keyCode === 13) shutter()
    if (ev.keyCode === 88) setCamera()
  })

  window.addEventListener('keyup', function (ev) {
    if (ev.keyCode === 16) shiftDown = false
  })
  
  var dropdown = document.querySelector('select')
  
  game.on('fire', function (target, state) {
    var select = game.controls.state.select
    if (shiftDown && select) return game.controls.state.select = false
    if (shiftDown && !select) return game.controls.state.select = true
    
    var position = blockPosPlace
    if (position) {
      game.createBlock(position, currentMaterial)
    } else {
      position = blockPosErase
      if (position) game.setBlock(position, 0)
    }
  })
}

message.innerHTML = "Click to play!"
if (game.notCapable()) instructions.style.visibility = 'hidden'

game.interact.on('attain', function() { instructions.style.visibility = 'hidden' })
game.interact.on('release', function() { instructions.style.visibility = 'visible' })

exportButton.addEventListener('click', function(e) {
  if (images.innerHTML === "") return
  window.open(stopMotion.export())
})

resetButton.addEventListener('click', function(e) {
  images.innerHTML = ""
  stopMotion.createEncoder()
})

function setCamera() {
  var els = game.camera.matrixWorld.elements
  var pos = {x: els[12], y: els[13], z: els[14]}
  stop.cam.position.copy(pos)
  stop.cam.lookAt(new game.THREE.Vector3(0,0,-1).applyMatrix4(game.camera.matrixWorld))
}

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

