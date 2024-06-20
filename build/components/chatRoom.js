const chatRoom_container = document.getElementById('chatRooms_container');
import { webSocketHandshake } from './websocket.js';
import { showNotification } from '../script.js';
import { populateMessages } from './messages.js';
import { setMessageBar } from './messageBar.js';
import { state } from './addNew.js';

const renderedChats = [];

let currentlyHighlightedChat;
function highlightChat(chatRoomId) {
  const targetChat = document.getElementById(chatRoomId.toString());
  if (currentlyHighlightedChat === undefined) {
    targetChat.classList.add('selected_chat');
    currentlyHighlightedChat = chatRoomId;
    return;
  }
  const currentChat = document.getElementById(currentlyHighlightedChat);
  if (chatRoomId != currentlyHighlightedChat) {
    currentChat.classList.remove('selected_chat');
    targetChat.classList.add('selected_chat');
    currentlyHighlightedChat = chatRoomId;
  }
}

export function populateChats(chatRoomArray, userData) {
  const userId = userData._id.toString();
  try {
    if (chatRoomArray?.length > 0) {
      chatRoomArray.forEach((element) => {
        // If particular chatRoom doesn't exist in renderedChats,
        // add chatRoom to page and to list of chats
        if (!renderedChats.includes(element._id.toString())) {
          // Create chatContainer
          const chatRoom_element = document.createElement('div');
          chatRoom_element.setAttribute('class', 'chat_container');
          chatRoom_element.setAttribute('id', `${element._id.toString()}`);
          // Populate chatContainer with userNames
          // I'm creating an allUserNames anchor so it works well with vimium
          const allUserNames = document.createElement('a');
          allUserNames.setAttribute('class', 'participants');
          let listOfNames = state.participants[element._id.toString()] = [];
          element.participants.forEach((elem) => {
            listOfNames.push(elem.userName);
            if (elem._id.toString() != userId.toString()) {
              const userName = document.createElement('p');
              userName.setAttribute('class', 'participant');
              userName.innerText = `${elem.userName}`;
              allUserNames.appendChild(userName);
            }
          });

          if (allUserNames.innerHTML === "") {
            allUserNames.innerHTML = "<p class='participants'>🛑 Empty Chat</p>";
          }

          if (allUserNames.childElementCount > 1) {
            const firstChild = allUserNames.firstElementChild;
            const numberApendage = document.createElement('p');
            numberApendage.innerText = `+ ${allUserNames.childElementCount - 1}`;
            allUserNames.innerHTML = "";
            allUserNames.appendChild(firstChild);
            allUserNames.appendChild(numberApendage);
          }

          chatRoom_element.appendChild(allUserNames);

          // Add chatContainer to chatRooms_container and renderedChats state object
          renderedChats.push(element._id.toString());
          chatRoom_container.prepend(chatRoom_element);

          // Click Action
          chatRoom_element.addEventListener('click', () => {

            if (true) {
              /* Call API for messages */
              fetch(`/apiv1/message/${element._id.toString()}`, {
                headers: {
                  'Content-Type': 'application/json',
                },
              })
                .then((response) => {
                  if (!response.ok) {
                    throw new Error("Error retrieving messages from api");
                  } else {
                    return response.json();
                  }
                })
                .then(data => {
                  if (data.success) {
                    populateMessages(data.data, userId);
                    setMessageBar(element._id.toString(), userId);
                    state.value = element._id.toString();
                    highlightChat(state.value);

                    // WebSocket Handshake
                    webSocketHandshake(element._id.toString(), userData);

                  } else {
                    showNotification(data.message);
                    throw new Error("Error fetching messages: /components/chatRoom.js", data.message);
                  }
                })
                .catch(err => {
                  showNotification(err);
                  console.error("Error: chatroom.js **:", err);
                });
            } else {
              console.log(`${state.value} is already selected!`);
            }
          });
        }
      });
    } else {
      // If condition/argument is an not an array with content
      const chatContainer = document.createElement('div');
      chatContainer.setAttribute('class', 'chat_container');
      chatContainer.innerHTML = "<h3>You have no messages!</h3>"
      chatRoom_container.appendChild(chatContainer);
    }
  } catch (error) {
    showNotification("Error: chatRoom.js *", error);
  }
};
