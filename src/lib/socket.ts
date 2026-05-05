import { io } from "socket.io-client";

const socket = io("http://localhost:3000"); 
// 👆 change to your backend URL if different

export default socket;