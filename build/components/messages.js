const messagesContainer = document.getElementById('messages_container');

export function populateMessages(messagesArray, userId) {
  messagesContainer.innerHTML = "";
  messagesArray.forEach((msg) => {
    const msgContainer = document.createElement('div');
    const msgMessage = document.createElement('p');
    const msgAuthor = document.createElement('p');
    msgContainer.setAttribute('id', `${msg._id.toString()}`);
    msgMessage.setAttribute('class', 'msg_message');
    msgAuthor.setAttribute('class', 'msg_author');
    msgMessage.innerText = msg.message;
    msgAuthor.innerText = msg.author.userName;

    msgContainer.appendChild(msgAuthor);
    msgContainer.appendChild(msgMessage);

    if (msg.author._id.toString() === userId) {
      msgContainer.setAttribute('class', 'msg_container msg_sender');
    } else {
      msgContainer.setAttribute('class', 'msg_container msg_recipiant');
    }
    messages_container.appendChild(msgContainer);
  });
}
