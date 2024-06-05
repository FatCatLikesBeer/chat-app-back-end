import { showNotification } from '../script.js';

export function deleteChatRoomModal(chatRoomId) {
  const modal = document.createElement('div');
  modal.setAttribute('id', 'delete_chatRoom_modal');
  const cancelButton = document.createElement('button');
  cancelButton.classList.add('btn');
  cancelButton.classList.add('btn-primary');
  cancelButton.setAttribute('id', 'delete_modal_cancel');
  cancelButton.innerText = "Cancel";
  const deleteButton = document.createElement('button');
  deleteButton.classList.add('btn');
  deleteButton.classList.add('btn-danger');
  deleteButton.setAttribute('id', 'delete_modal_delete');
  deleteButton.innerText = "Delete";

  modal.innerHTML = '<h1>DELETING CHATROOM!</h1>';
  modal.innerHTML += '<p>You are about to delete a chatroom!</p>';
  modal.innerHTML += '<p>Confirm Below</p>';
  modal.appendChild(cancelButton);
  modal.appendChild(deleteButton);

  // When function runs, show modal/append modal to body
  document.body.appendChild(modal);

  // Logic for clicking 'Cancel'
  delete_modal_cancel.addEventListener('click', (event) => {
    document.body.removeChild(modal);
  });

  // Logic for clicking 'Delete'
  delete_modal_delete.addEventListener('click', (event) => {
    fetch('/apiv1/chatRoom', {
      headers: {
        "Content-Type": "application/json",
      },
      method: "DELETE",
      body: JSON.stringify({
        chatRoom: chatRoomId,
      })
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error with delete chatRoom response");
        } else {
          return response.json();
        }
      })
      .then((data) => {
        if (data.success) {
          location.reload();
        } else {
          throw new Error(data.message);
        }
      })
      .catch((error) => {
        console.error('Error deleting chatRoom', error);
        showNotification(error);
      })
    document.body.removeChild(modal);
  });

  // Escape closes modal
  function handleKeydown(event) {
    if (event.key === 'Escape') {
      document.body.removeChild(modal);
      document.removeEventListener('keydown', handleKeydown);
      document.removeEventListener('click', handleOffClick);
    }
  }
  document.addEventListener('keydown', handleKeydown);

  // Clicking outside of modal closes modal
  function handleOffClick(event) {
    const addModal = document.getElementById('add_modal');
    if (!modal.contains(event.target) && !addModal.contains(event.target)) {
      document.body.removeChild(modal);
      document.removeEventListener('click', handleOffClick);
      document.removeEventListener('keydown', handleKeydown);
    }
  }
  document.addEventListener('click', handleOffClick);
}
