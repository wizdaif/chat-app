import { Socket } from "socket.io";
import { messages } from "~/socket/handler";


export default defineEventHandler(async (event) => {
    return { messages }
})