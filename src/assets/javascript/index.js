const socket = io()

function sendSkill (str) {
  socket.emit('useSkill', str)
}

socket.on('skill', skill => {
  console.log(skill)
})
