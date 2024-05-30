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

    // Net Containers
    msgContainer.appendChild(msgAuthor);
    msgContainer.appendChild(msgMessage);
    msgTier.appendChild(msgContainer);

    if (msg.author._id.toString() === userId) {
      msgTier.setAttribute('class', 'msg_tier_sender');
      msgContainer.setAttribute('class', 'msg_container msg_sender');
    } else {
      msgTier.setAttribute('class', 'msg_tier_recipiant');
      msgContainer.setAttribute('class', 'msg_container msg_recipiant');
    }

    // Put containers into document
    messages_container.prepend(msgTier);
  });
}
