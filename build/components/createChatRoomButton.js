import { addChatRoom } from './addNew.js';

export function renderCreateChatRoomButton() {
  // Place & Create Create chatRoom Button
  const header = document.getElementById('header');
  const container = document.createElement('div');
  container.setAttribute('id', 'create_chatRoom');
  container.innerHTML = `<a>Create Chat Room</a>`;
  header.appendChild(container);

  // button logic & assignment
  const button = document.getElementById('create_chatRoom');

  const handleClick = () => {
    addChatRoom();
  }

  button.addEventListener('click', handleClick);
}
