import { Socket } from "socket.io";

export default defineEventHandler(async (event) => {
    const io: Socket = (event as any)._socket;

    const { message, from } = await readBody(event);

    if (!message || !from) {
        throw createError({
            status: 200,
            message: "Umm."
        })
    }

    io.emit('message', {
        timestamp: Date.now(),
        content: message,
        id: from,
        // name: user.name,
        system: true,
    })
})