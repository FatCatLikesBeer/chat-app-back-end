import { showNotification, setCookie } from '../script.js';
import { populateMessages } from './messages.js';
const messagesSection = document.getElementById('messages_section');

export function setMessageBar(chatRoomId) {
  // Declare message bar, it's constiutent parts, & add to document
  const messageBarContainer = document.createElement('div');
  messageBarContainer.setAttribute('class', 'message_bar_container');
  const messageArea = document.createElement('textarea');
  messageArea.setAttribute('class', 'message_area');
  messageArea.setAttribute('id', `textarea_${chatRoomId}`)
  const messageSendButton = document.createElement('button');
  messageSendButton.setAttribute('id', `button_${chatRoomId}`);
  messageSendButton.setAttribute('class', 'btn btn-primary');
  messageSendButton.setAttribute('type', 'submit');
  messageSendButton.innerText = 'Send';
  messageBarContainer.appendChild(messageArea);
  messageBarContainer.appendChild(messageSendButton);
  messagesSection.appendChild(messageBarContainer);
  messageSendButton.addEventListener('click', sendMessage);

  function sendMessage() {
    fetch('/apiv1/message', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chatRoom: `${chatRoomId}`,
        message: `${messageArea.value.toString()}`,
      })
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error getting response");
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
        if (data.success) {
          populateMessages(data.data, data.userData._id.toString());
        } else {
          showNotification(data.message);
          throw new Error(data.message);
        }
        setCookie(data.token);
      })
      .catch((err) => {
        showNotification(err);
        console.error(err);
      })
  }
}
