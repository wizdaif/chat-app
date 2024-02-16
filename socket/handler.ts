import { Server } from "socket.io";
interface Chat {
    id: any;
    message: string;
    timestamp: number;
}

export let users: any[] = [];
export const messages: Chat[] = []

export const socketHandler = async (io: Server) => {
    io.on('get_messages', (socket) => {
        socket.emit({ messages })
    })

    io.on('connection', (socket) => {
        socket.on('disconnect', () => console.log('Byebye', socket.id));

        socket.on('join', (user) => {
            socket.join('all');

            console.log(users)
            
            users.push(user);

            io.to('all').emit('join', {
                id: user.id,
                name: user.name,
                system: true,
                content: `${user.name} joined`
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
            messages.push(message);
            console.log(message)
            io.to('all').emit('message', {...message, name: users.find((u) => u.id == message.id)?.name });
        })
    })

    io.on('message', (m) => {
        console.log(m)
    })
}