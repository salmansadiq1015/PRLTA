import { Server as SocketIOServer } from "socket.io";

export const initialSocketServer = (server) => {
  const io = new SocketIOServer(server);

  io.on("connection", async (socket) => {
    console.log(`User  connected!`);

    // Handle disconnect
    socket.on("disconnect", async () => {
      console.log(`User disconnected!`);
    });
  });
};
