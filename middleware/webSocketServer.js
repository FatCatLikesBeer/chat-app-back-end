const chatRoomsList = {};
const keyWords = ['/help', '/quote', '/about', '/bored', '/fact', '/joke', '/webapp'];
const { quotes, facts, jokes, webapp } = require('./webSocketServerExtras');

exports.wsConnection = (ws) => {
  ws.on('message', (event) => {
    const parsedMessage = JSON.parse(event);
    const { type, chatRoomId, message, userName, _id } = parsedMessage;

    if (keyWords.some((word) => { return word === message })) {
      narrowCastMessage(chatRoomId, parsedMessage);
    } else {
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
    }
  });

  ws.on('close', () => {
    leaveChatRoom(ws);
  });
}

const narrowCastMessage = async (chatRoomId, parsedMessage) => {
  let message;
  switch (parsedMessage.message) {
    case '/help':
      message = "Play with WebSockets!\n\nOnly you can see these messages from The Socket.\n\nMessages from The Socket will dissapear when you join a new chatroom, when you refresh the page, or when you log back in.\n\n/help to show this message again\n/quote for some words from a famous person\n/bored for something to entertain programmers\n/joke for some dad jokes\n/fact for interesting facts\n/webapp To learn how to add this app to your home screen\n/about for about";
      break;
    case '/quote':
      message = quotes[Math.floor(Math.random() * quotes.length)];
      break;
    case '/about':
      message = "This app was made by me, Billy :)\nCheck the 'About' section (upper right hand menu) for more info on me and this app";
      break;
    case '/bored':
      message = await fetch('https://bored-programmer-api.fly.dev/api/')
        .then((response) => { return response.json() })
        .then((data) => {
          let result;
          result = data.name;
          result += '\n\n';
          result += data.description;
          return result;
        });
      break;
    case '/joke':
      message = jokes[Math.floor(Math.random() * jokes.length)];
      break;
    case '/fact':
      message = facts[Math.floor(Math.random() * facts.length)];
      break;
    case '/webapp':
      message = webapp;
      break;
    default:
      message = "Sorry, helper is broken...";
      break;
  }

  chatRoomsList[chatRoomId].forEach((client) => {
    if (client.userName === parsedMessage.userName) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({
          message: parsedMessage.message,
          userName: parsedMessage.userName,
          _id: parsedMessage._id,
          type: "message",
          chatRoomId: chatRoomId,
        }));
        client.send(JSON.stringify({
          message: message,
          userName: "The Socket",
          _id: "server_123",
          chatRoomId: chatRoomId,
          type: "message",
        }));
      }
    }
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
