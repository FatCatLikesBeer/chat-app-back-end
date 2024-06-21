import { webSocketHandshake } from './websocket.js';
import { showNotification } from '../script.js';
import { populateMessages } from './messages.js';
import { setMessageBar } from './messageBar.js';
import { state } from './addNew.js';
import { highlightChat } from './chatRoom.js';

export function focustChatRoom(chatRoomId) {
  fetch(`/apiv1/message/${chatRoomId}`, {
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Error retrieving messages from api");
      } else {
        return response.json();
      }
    })
    .then(data => {
      if (data.success) {
        const userId = data.userData._id.toString();
        populateMessages(data.data, userId);
        setMessageBar(chatRoomId, userId);
        state.value = chatRoomId;
        highlightChat(state.value);

        // WebSocket Handshake
        webSocketHandshake(chatRoomId, data.userData);

      } else {
        showNotification(data.message);
        throw new Error("Error fetching messages: /components/chatRoom.js", data.message);
      }
    })
    .catch(err => {
      showNotification(err);
      console.error("Error: chatroom.js **:", err);
    });
}
