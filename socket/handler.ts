import { Server } from "socket.io";
interface Chat {
    id: any;
    message: string;
    timestamp: number;
}
export const socketHandler = async (io: Server) => {
    const users = [];
    const messages: Chat[] = []

    io.on('get_messages', (socket) => {
        socket.emit({ messages })
    })

    io.on('connection', (socket) => {
        socket.on('disconnect', () => console.log('Byebye', socket.id));

        socket.on('join', (user) => {
            socket.join('all');
            io.to('all').emit('join', {
                id: user.id,
                name: user.name,
                system: true,
                content: `${user.name} joined the chat`
            })
        })

        socket.on('leave', (user) => {
            socket.leave('all');
            io.to('all').emit('leave', {
                id: user.id,
                name: user.name,
                system: true,
                content: `${user.name} left the chat`
            })
        })

        socket.on('message', (message) => {
            io.to('all').emit('message', message);
        })
    })
}