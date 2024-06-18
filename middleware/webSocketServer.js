const chatRoomsList = {};

exports.wsConnection = (ws) => {
  ws.on('message', (event) => {
    const parsedMessage = JSON.parse(event);
    const { type, chatRoomId, message, userName, _id } = parsedMessage;

    switch (type) {
      case 'join':
        if (!chatRoomsList[chatRoomId]) {
          chatRoomsList[chatRoomId] = [];
        }
        chatRoomsList[chatRoomId].push(ws);
        ws.chatRoomId = chatRoomId;
        ws.userName = userName;
        const joinMessage = {
          _id: _id,
          chatRoomId: chatRoomId,
          userName: userName,
          message: `${userName} has joined the chat!`,
        }
        broadcastNotification(chatRoomId, joinMessage);
        break;

      case 'message':
        const relayMessage = {
          _id: _id,
          chatRoomId: chatRoomId,
          userName: userName,
          message: message,
        }
        broadcastMessage(chatRoomId, relayMessage);
        break;

      case 'leave':
        leaveChatRoom(ws);
        break;
    }
  });

  ws.on('close', () => {
    leaveChatRoom(ws);
  });
}

const broadcastMessage = (chatRoomId, parsedMessage) => {
  if (chatRoomsList[chatRoomId]) {
    chatRoomsList[chatRoomId].forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({
          _id: parsedMessage._id,
          userName: parsedMessage.userName,
          chatRoomId: parsedMessage.chatRoomId,
          message: parsedMessage.message,
          type: "message",
        }));
      }
    });
  }
}

const broadcastNotification = (chatRoomId, parsedMessage) => {
  if (chatRoomsList[chatRoomId]) {
    chatRoomsList[chatRoomId].forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({
          _id: parsedMessage._id,
          userName: parsedMessage.userName,
          chatRoomId: parsedMessage.chatRoomId,
          message: parsedMessage.message,
          type: "notification",
        }));
      }
    });
  }
}

let leaveId = 100000001;

function leaveChatRoom(ws) {
  const { chatRoomId, userName } = ws;
  if (chatRoomId && chatRoomsList[chatRoomId]) {
    chatRoomsList[chatRoomId] = chatRoomsList[chatRoomId].filter((client) => { return client !== ws });
    if (chatRoomsList[chatRoomId].length === 0) {
      delete chatRoomsList[chatRoomId];
      console.log('Chatroom has been deleted');
    } else {
      broadcastNotification(chatRoomId, {
        message: `${userName} has left the chat`,
        _id: `message_id_${leaveId}`,
        userName: userName,
        chatRoomId: chatRoomId,
      });
      leaveId += 1;
    }
  }
}
