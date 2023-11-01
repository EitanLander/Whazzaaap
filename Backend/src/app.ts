
import express from "express";
import appConfig from "./2-utils/app-config";
import socketService from "./5-services/socket-service";

const expressServer = express();

// Get native http server for using socket.io
const httpServer = expressServer.listen(appConfig.port, () => console.log("Listening on http://localhost:" + appConfig.port));

// Send native http server to socket service:
socketService.handleSocketIo(httpServer);
