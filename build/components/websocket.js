import { appendMessage } from './messages.js';
import { ws } from '../script.js';

export function webSocketHandshake(chatRoomId, userData) {
  // Leave previous chatRoom
  if (ws.previousConnection) {
    ws.send(JSON.stringify({
      type: "leave",
      chatRoomId: chatRoomId,
      userName: userData.userName,
    }));
  }

  ws.previousConnection = chatRoomId;

  // Join specified chatRoom
  ws.send(JSON.stringify({
    type: "join",
    chatRoomId: chatRoomId,
    userName: userData.userName,
    _id: userData._id,
    message: '-_-',
  }));
}
