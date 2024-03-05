import { Server } from "socket.io";
interface Chat {
    id: any;
    content: string;
    timestamp: number;
}

export let users: any[] = [];
export let onlineUsers: any[] = [];
export const messages: Chat[] = []

export const socketHandler = async (io: Server) => {
    io.on('get_messages', (socket) => {
        socket.emit({ messages })
    })

    io.on('connection', (socket) => {
        let user = null;

        socket.on('disconnect', () => {
            let leftUser = users.find((u) => u.funniId === socket.id);

            if (!leftUser) return;

            console.log(leftUser)

            io.to('all').emit('leave', {
                id: leftUser.id,
                name: leftUser.name,
                system: true,
                content: `${leftUser.name} left`
            })
        });

        socket.on('join', (_user) => {
            if (users.some((u) => u.name === _user.name)) return;

            socket.join('all');
            
            users.push({ ..._user, funniId: socket.id });
            io.to('all').emit('new_user', _user.name)
            onlineUsers.push(_user.name)
            
            user = _user;

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
                id: user!.id ?? users.find((u) => u.id === message.id),
                name: user!.name ?? users.find((u) => u.id == message.id)?.name 
            }
            messages.push(newmessage);
            // console.log(newmessage)
            io.to('all').emit('message', newmessage);
        })
    })
    // io.on('message', (m) => {
    //     console.log(m)
    // })
}