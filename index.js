const app = require('express')()
const http = require('http').createServer(app)
const io = require('socket.io')(http)
const users = {}
app.get('/',(req,res)=>{
  // res.send('hello,world!')
  res.sendFile(__dirname+'/index.html')
})
io.on('connection',socket=>{
  console.log('user connect!')
  
  socket.on('create_username',username=>{
    //store the username
    users[socket.id] = username
    console.log(username)
    socket.broadcast.emit('create_username',username)
  })
  socket.on('disconnect',() => {
    const currentUsrname = users[socket.id]
    if(currentUsrname){
      socket.broadcast.emit('user_leave',currentUsrname)
    }
  })
  socket.on('send_message',message => {
    const username = users[socket.id]
    socket.broadcast.emit('send_message',{
      username:username,
      message:message
    })
  })
})
http.listen(4000,()=>{
  console.log(`server is running in port ${4000}`)
})