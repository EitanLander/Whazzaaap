import { Socket, io } from "socket.io-client";
import MessageModel from "../Models/MessageModel";

class SocketService {
  private socket: Socket;

  public connect(gotMessage: Function): void {
    this.socket = io("http://localhost:4000");

    this.socket.on("msg-from-server", (message: MessageModel) => {
      gotMessage(message);
    });

    this.socket.on("avatar-changed", (newAvatar: string) => {
      // Handle the avatar change event
      // You can update the user's displayed avatar here
    });
  }

  public send(message: MessageModel): void {
    this.socket?.emit("msg-from-client", message);
  }

  public changeAvatar(isMale: boolean): void {
    this.socket?.emit("change-avatar", isMale);
  }

  public disconnect(): void {
    this.socket.disconnect();
  }
}

const socketService = new SocketService();

export default socketService;
