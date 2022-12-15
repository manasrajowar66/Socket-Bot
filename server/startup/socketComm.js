const {Server} = require('socket.io');
require('dotenv').config();

module.exports = async (server)=>{
    const io = new Server(server,{
        cors:'http://localhost:3000'
    });
    
    io.on("connection",(socket)=>{
        console.log(`User Connected: ${socket.id}`);
        socket.on('joined',({name})=>{
            socket.emit('message',{
                user:'admin',
                text:`${name}, welcome to the chat`,
                type:'incomming'
            })
        })
        socket.on('message',({message})=>{
            socket.emit('message',{
                user:'admin',
                text:message,
                type:'outgoing'
            })
        })
        socket.on('disconnect',()=>{
            console.log(`User Left`);
        })

    })

}