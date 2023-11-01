import { Server as HttpServer } from "http";
import { Server as SocketIoServer, Socket } from "socket.io";
import MessageModel from "../3-models/message-model";


// Handle all socket.io operations:
function handleSocketIo(httpServer: HttpServer): void {

    // Socket.io options - any client can connect and use (cors): 
    const options = { cors: { origin: "*" } };

    // Create the socket.io server:
    const socketIoServer = new SocketIoServer(httpServer, options);

    // 1. Server listen to client connections: 
    socketIoServer.sockets.on("connection", (socket: Socket) => {

        console.log("Client has been connected.");

        // Listen to client messages: 
        socket.on("msg-from-client", (message: MessageModel) => {
            console.log("Client sent message: ", message);

            // Send given message to all clients: 
            socketIoServer.sockets.emit("msg-from-server", message);
        });

        // Server listen to client disconnect:
        socket.on("disconnect", () => {
            console.log("Client disconnected.");

            // Notify all clients about a user disconnection:
            socket.broadcast.emit("msg-from-server", {
                nickname: "System",
                color: "gray",
                text: `${socket.id} disconnected`, // You can use socket.id or the actual nickname
            });
        });
    });
}

export default {
    handleSocketIo
};