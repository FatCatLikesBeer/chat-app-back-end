const chatRoom_container = document.getElementById('chatRooms_container');
import { showNotification, setCookie } from '../script.js';
import { populateMessages } from './messages.js';
import { setMessageBar } from './messageBar.js';

export function populateChats(chatRoomArray, userId) {
  try {
    if (chatRoomArray.length > 0) {
      chatRoomArray.forEach((element) => {
        // Create chatContainer
        const chatRoom_element = document.createElement('div');
        chatRoom_element.setAttribute('class', 'chat_container');
        chatRoom_element.setAttribute('id', `${element._id.toString()}`);
        // Populate chatContainer with userNames
        // I'm creating an allUserNames anchor so it works well with vimium
        const allUserNames = document.createElement('a');
        allUserNames.setAttribute('class', 'participants');
        element.participants.forEach((elem) => {
          if (elem._id.toString() != userId.toString()) {
            const userName = document.createElement('p');
            userName.setAttribute('class', 'participant');
            userName.innerText = `${elem.userName}`;
            allUserNames.appendChild(userName);
          }
        });
        chatRoom_element.appendChild(allUserNames);

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
                populateMessages(data.data, userId);
                setMessageBar(element._id.toString());
                setCookie(data.token);
              } else {
                console.error(data.message);
                showNotification(data.message);
                throw new Error("Error fetching messages: /components/chatRoom.js", data.message);
              }
            })
            .catch(err => {
              showNotification(err);
              console.error(err);
            });

          /* Appending The message_bar element should go SOMEWHERE AROUND HERE*/
          /* It will need the information from each chatroom */
          /* The message bar send button & event listener will need the chatRoom._id */
          /* The message bar & button should have their element id be the chatRoom._id.toString() */
          /* You will need to add the send button event listener here */
          /* Don't forget to remove previous event listeners */
        });
      });
    } else {
      // If condition/argument is an not an array with content
      const chatContainer = document.createElement('div');
      chatContainer.setAttribute('class', 'chat_container');
      chatContainer.innerHTML = "<h3>You have no messages!</h3>"
      chatRoom_container.appendChild(chatContainer);
    }
  } catch (error) {
    showNotification("Error: chatRoom.js", error);
  }
};
