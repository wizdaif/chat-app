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
    io.on('connection', (socket) => {
        let user = null;

        socket.on('get_messages', () => {
            socket.emit('get_messages', { messages })
        })

        socket.on('get_users', () => socket.emit('get_users', users))

        socket.on('check_whats_up', (id) => {
            console.log(id);
            if (!users.some(u => u.id === id)) return;

            const user2 = users.find(u => u.id === id);

            users = users.map((us) => {
                if (us.id === id && us.funniId !== socket.id) {
                    us.funniId = socket.id;
                }

                return us
            })

            socket.join('all');
            socket.emit('username_accept', user2.name)
        })

        socket.on('disconnect', () => {
            let leftUser = users.find((u) => u.funniId === socket.id);

            if (!leftUser) return;

            console.log('left', leftUser)

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

            socket.emit('username_accept', _user.anme);

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
            const local = users.find((u) => u.id === message.id);

            console.log('newmessage',local)

            const newmessage = {
                content: message.content, 
                timestamp: Date.now(),
                id: local.id,
                name: local.name
            }
            messages.push(newmessage);
            io.to('all').emit('message', newmessage);
        })
    })
}