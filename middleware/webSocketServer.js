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
        broadcastMessage(chatRoomId, joinMessage);
        console.log(chatRoomsList);
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
  console.log('broadcastMessage, message recieved: ', parsedMessage);
  if (chatRoomsList[chatRoomId]) {
    chatRoomsList[chatRoomId].forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({
          _id: parsedMessage._id,
          userName: parsedMessage.userName,
          chatRoomId: parsedMessage.chatRoomId,
          message: parsedMessage.message,
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
      broadcastMessage(chatRoomId, {
        message: `${userName} has left the chat`,
        _id: `message_id_${leaveId}`,
        userName: 'Server',
        chatRoomId: chatRoomId,
      });
      leaveId += 1;
    }
  }
}
