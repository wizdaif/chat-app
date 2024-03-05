import { Socket } from "socket.io";
import { onlineUsers } from "~/socket/handler";


export default defineEventHandler(async (event) => {
    return { users: onlineUsers }
})