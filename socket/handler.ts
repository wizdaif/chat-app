import { Server } from "socket.io";
interface Chat {
    id: any;
    content: string;
    timestamp: number;
}

export let users: any[] = [];
export const messages: Chat[] = []

export const socketHandler = async (io: Server) => {
    io.on('get_messages', (socket) => {
        socket.emit({ messages })
    })

    io.on('connection', (socket) => {
        console.log('byebye', socket.id)

        socket.on('disconnect', () => console.log('Byebye', socket.id));

        socket.on('join', (user) => {
            if (users.some((u) => u.name === user.name)) return;

            socket.join('all');
            
            users.push(user);
            
            socket.data.user = user;

            socket.emit('username_accept');

            io.to('all').emit('join', {
                id: user.id,
                name: user.name,
                system: true,
                content: `${user.name} has joined`
            })
        })

        socket.on('leave', (user) => {
            socket.leave('all');

            user = users.filter((u) => u !== user)

            io.to('all').emit('leave', {
                id: user.id,
                name: user.name,
                system: true,
                content: `${user.name} left`
            })
        })

        socket.on('message', (message) => {
            const newmessage = {
                content: message, 
                timestamp: Date.now(),
                id: socket.data.user.id ?? users.find((u) => u.id === message.id),
                name: socket.data.user.name ?? users.find((u) => u.id == message.id)?.name 
            }
            messages.push(newmessage);
            console.log(newmessage)
            io.to('all').emit('message', newmessage);
        })
    })

    io.on('message', (m) => {
        console.log(m)
    })
}