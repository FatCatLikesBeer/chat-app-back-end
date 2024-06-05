import { populateChats } from './chatRoom.js';
import { deleteChatRoomModal } from './deleteChatRoomModal.js';

// Create Add Menu Icon
const iconContainer = document.createElement('span');
const iconImage = document.createElement('a');
iconContainer.setAttribute('id', 'add_menu');
iconContainer.setAttribute('class', 'material-symbols-outlined');
iconImage.setAttribute('id', 'test');
iconImage.innerText = 'add';
iconContainer.appendChild(iconImage);

// Create modal element & it's contents
const modalContainer = document.createElement('div');
modalContainer.setAttribute('id', 'add_modal');
modalContainer.classList.add('close');
const modalElements = [];
for (let i = 0; i < 3; i++) {
  let id; let body;
  const element = document.createElement('li');
  if (i === 0) { id = 'add_chatRoom'; body = 'Create ChatRoom'; }
  if (i === 1) { id = 'add_user'; body = 'Add User'; }
  if (i === 2) { id = 'delete_chatRoom'; body = 'Delete Chatroom'; }
  element.innerHTML = `<a id=${id}>${body}</a>`;
  modalContainer.appendChild(element);
}
document.body.prepend(modalContainer);

// Object to comunicate state between here & ./chatRoom.js
export let state = {
  value: undefined,
}

// Modal Animations
function modalClose() {
  add_modal.classList.remove('open');
  add_modal.classList.add('close');
  iconImage.innerText = 'add';
}
function modalOpen() {
  add_modal.classList.remove('close');
  add_modal.classList.add('open');
  iconImage.innerText = 'close';
  // When modal opens, check if a chatRoom is selected
  // If no chatRoom is selected, then add_user & delete button button should be disabled
  if (state.value === undefined) {
    add_user.parentElement.setAttribute('disabled', '');
    add_user.parentElement.setAttribute('hidden', '');
    delete_chatRoom.parentElement.setAttribute('disabled', '');
    delete_chatRoom.parentElement.setAttribute('hidden', '');
  } else {
    add_user.parentElement.removeAttribute('disabled');
    add_user.parentElement.removeAttribute('hidden');
    delete_chatRoom.parentElement.removeAttribute('disabled');
    delete_chatRoom.parentElement.removeAttribute('hidden');
  }
}

// Add Menu Icon animation
iconContainer.addEventListener('click', (event) => {
  if (iconImage.innerText === 'add') {
    modalOpen();
  } else {
    modalClose();
  }
});

// Close Modal Listeners
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && add_modal.classList.contains('open')) {
    modalClose();
  }
});
document.addEventListener('click', (event) => {
  if (add_modal.classList.contains('open') && !modalContainer.contains(event.target) && !iconContainer.contains(event.target)) {
    modalClose();
  }
});

/* Menu Actions */
// Add User button logic
function addUser(user) {
  console.log("add_user clicked");
}

// Add chatRoom button logic
function addChatRoom() {
  console.log('add_chatRoom clicked!');
  fetch('/apiv1/chatRoom', {
    method: "POST",
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("create chatRoom Error");
      } else {
        return response.json();
      }
    })
    .then((data) => {
      console.log(data);
      populateChats(data.data, data.userData._id.toString());
      modalClose();
    })
    .catch((err) => {
      console.error("Error creating chatRoom: ", err);
    })
}

// Delete Chatroom button logic
function deleteChatroom() {
  modalClose();
  deleteChatRoomModal(state.value);
  // alert("Selected chatroom will be deleted!");
}

// add_user event listener
add_user.addEventListener('click', addUser);

// add_chatRoom event listener
add_chatRoom.addEventListener('click', addChatRoom);

// delete_chatRoom event listener
delete_chatRoom.addEventListener('click', deleteChatroom);

// Export function to the call the Add Menu icon in & out of existence
export const addMenu = {
  showMenu() {
    header.appendChild(iconContainer);
  },
  removeMenu() {
    if (document.getElementById('add_menu') != null) {
      header.removeChild(iconContainer);
    }
  },
}


