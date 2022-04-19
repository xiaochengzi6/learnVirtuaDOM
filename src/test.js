var svd = require('simple-virtual-dom')

var el = svd.el
var diff = svd.diff
var patch = svd.patch

var root = el('ul', [
  el('li', {key: 'uid1'}, ['Jerry']),
  el('li', {key: 'uid2'}, ['Tomy']),
  el('li', {key: 'uid3'}, ['Lucy']),
])

var newRoot = el('ul', [
  el('li', {key: 'uid1'}, ['Jerry']),
  el('li', {key: 'uid2'}, ['Tomy']),
  el('li', {key: 'uid4'}, ['Lily']),
  el('li', {key: 'uid3'}, ['Lucy']),
])

// ensure `patches` is minimum
var patches = diff(root, newRoot)

console.log('patches', patches[0][0].moves)