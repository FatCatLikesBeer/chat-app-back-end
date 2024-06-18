const messagesContainer = document.getElementById('messages_container');

export function populateMessages(messagesArray, userId) {
  // Clear out messages_container
  messagesContainer.innerHTML = "";
  messagesArray.forEach((msg) => {
    // Create Elements
    const msgTier = document.createElement('div');
    const msgContainer = document.createElement('div');
    const msgMessage = document.createElement('p');
    const msgAuthor = document.createElement('p');

    // Set Attributes for Containers
    msgContainer.setAttribute('id', `${msg._id.toString()}`);
    msgMessage.setAttribute('class', 'msg_message');
    msgAuthor.setAttribute('class', 'msg_author');

    // Content for containers
    msgMessage.innerText = msg.message;
    msgAuthor.innerText = msg.author.userName;

    // Nest Containers
    msgContainer.appendChild(msgAuthor);
    msgContainer.appendChild(msgMessage);
    msgTier.appendChild(msgContainer);

    // Sender Recipiant Styling
    if (msg.author._id.toString() === userId) {
      msgTier.setAttribute('class', 'msg_tier_sender');
      msgContainer.setAttribute('class', 'msg_container msg_sender');
    } else {
      msgTier.setAttribute('class', 'msg_tier_recipiant');
      msgContainer.setAttribute('class', 'msg_container msg_recipiant');
    }

    // Put containers into document
    messages_container.prepend(msgTier);
    messages_container.scrollTop = messages_container.scrollHeight;
  });
}

export function appendMessage(message, userId) {
  // Create Elements
  const msgTier = document.createElement('div');
  const msgContainer = document.createElement('div');
  const msgMessage = document.createElement('p');
  const msgAuthor = document.createElement('p');

  // Set Attributes for Containers
  // msgContainer.setAttribute('id', `${message._id.toString()}`);
  msgMessage.setAttribute('class', 'msg_message');
  msgAuthor.setAttribute('class', 'msg_author');

  // Content for containers
  msgMessage.innerText = message.message;
  msgAuthor.innerText = message.userName;

  // Nest Containers
  msgContainer.appendChild(msgAuthor);
  msgContainer.appendChild(msgMessage);
  msgTier.appendChild(msgContainer);

  // Sender Recipiant Styling
  if (message._id.toString() === userId.toString()) {
    msgTier.setAttribute('class', 'msg_tier_sender');
    msgContainer.setAttribute('class', 'msg_container msg_sender');
  } else {
    msgTier.setAttribute('class', 'msg_tier_recipiant');
    msgContainer.setAttribute('class', 'msg_container msg_recipiant');
  }
  // Notification Styling
  if (message.type === "notification") {
    msgTier.setAttribute('class', 'msg_tier_notification');
    msgContainer.setAttribute('class', 'msg_container msg_notification');
    msgContainer.removeChild(msgAuthor);
  }

  // Put containers into document
  messages_container.append(msgTier);
  messages_container.scrollTop = messages_container.scrollHeight;
}
