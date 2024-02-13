import { Socket } from "socket.io";

export default defineEventHandler(async (event) => {
    const io: Socket = (event as any)._socket;

    const { message, id } = await readBody(event);

    if (!message || !id) {
        throw createError({
            status: 200,
            message: "Umm."
        })
    }

    io.to('all').emit('message', {

    })
})