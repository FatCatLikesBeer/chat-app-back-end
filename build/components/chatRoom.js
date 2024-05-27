const chatRoom_container = document.getElementById('chatRooms_container');
import { showNotification } from '../script.js';
import { populateMessages } from './messages.js';

export function populateChats(chatRoomArray, userId) {
  try {
    if (chatRoomArray.length > 0) {
      chatRoomArray.forEach((element) => {
        // Create chatContainer
        const chatRoom_element = document.createElement('div');
        chatRoom_element.setAttribute('class', 'chat_container');
        chatRoom_element.setAttribute('id', `${element._id.toString()}`);
        // Populate chatContainer with userNames
        element.participants.forEach((elem) => {
          if (elem._id.toString() != element.owner.toString()) {
            const userName = document.createElement('p');
            userName.innerText = `${elem.userName}`;
            chatRoom_element.appendChild(userName);
          }
        });

        // Add chatContainer to chatRooms_container
        chatRoom_container.appendChild(chatRoom_element);

        // Click Action
        chatRoom_element.addEventListener('click', () => {

          /* Call API for messages */
          fetch(`/apiv1/message/${element._id.toString()}`, {
            headers: {
              'Content-Type': 'application/json',
            },
          })
            .then(response => response.json())
            .then(data => {
              if (data.success) {
                console.log(data);
                populateMessages(data.data, userId);
              } else {
                console.error(data.message);
                throw new Error("Error fetching messages: /components/chatRoom.js", data.message);
              }
            })
            .catch(err => {
              showNotification(err);
              console.error(err);
            });

        });
      });
    } else {
      // If argument is an not an array with content
      const chatContainer = document.createElement('div');
      chatContainer.setAttribute('class', 'chat_container');
      chatContainer.innerHTML = "<h3>You have no messages!</h3>"
      chatRoom_container.appendChild(chatContainer);
    }
  } catch (error) {
    showNotification("Error: chatRoom.js", error);
  }
};
