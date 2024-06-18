const chatRoomsList = {};
const keyWords = ['/help', '/quote', '/about', '/bored'];
const quotes = [
  "You must be the change you wish to see in the world. -Mahatma Gandhi",
  "Spread love everywhere you go. Let no one ever come to you without leaving happier. -Mother Teresa",
  "The only thing we have to fear is fear itself. -Franklin D. Roosevelt",
  "Darkness cannot drive out darkness: only light can do that. Hate cannot drive out hate: only love can do that. -Martin Luther King Jr.",
  "Do one thing every day that scares you. -Eleanor Roosevelt",
  "Well done is better than well said. -Benjamin Franklin",
  "The best and most beautiful things in the world cannot be seen or even touched - they must be felt with the heart. -Helen Keller",
  "It is during our darkest moments that we must focus to see the light. -Aristotle",
  "Do not go where the path may lead, go instead where there is no path and leave a trail. -Ralph Waldo Emerson",
  "Be yourself; everyone else is already taken. -Oscar Wilde"
];

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
      message = "Play with WebSockets!\n\nOnly you can see these messages from The Socket\n\n/help to show this message again\n/quote for some words from a famous person\n/bored for something to entertain programmers\n/about for about";
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
