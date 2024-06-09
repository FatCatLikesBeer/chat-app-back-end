import { showNotification } from '../script.js';

export function userSearch(chatRoomId) {
  const queryModal = document.querySelector('#search_user_modal');
  if (queryModal === null) {
    const modal = document.createElement('dialog');
    modal.setAttribute('id', 'search_user_modal');

    const searchButton = document.createElement('button');
    searchButton.setAttribute('id', 'search_user_submit');
    searchButton.setAttribute('type', 'submit');
    searchButton.classList.add('btn');
    searchButton.classList.add('btn-primary');
    searchButton.innerText = 'Search';

    const cancelButton = document.createElement('button');
    cancelButton.setAttribute('id', 'search_user_close');
    cancelButton.classList.add('btn');
    cancelButton.classList.add('btn-secondary');
    cancelButton.innerText = 'Cancel';

    const searchField = document.createElement('input');
    searchField.setAttribute('id', 'search_user_field');
    searchField.setAttribute('name', 'search_user_field');
    searchField.classList.add('form-control');

    const searchResults = document.createElement('div');
    searchResults.setAttribute('id', 'search_user_results');

    const form = document.createElement('form');
    form.setAttribute('id', 'search_user_form');

    // Elements bundled together
    modal.innerHTML = '<p>Search for User</p>';
    form.appendChild(searchField);
    form.appendChild(cancelButton);
    form.appendChild(searchButton);
    form.appendChild(searchResults);
    modal.appendChild(form);

    document.body.appendChild(modal);
    modal.showModal();

    // Handle Search User click cancel
    const handleCancel = (event) => {
      event.preventDefault();
      closeModal(modal);
    }

    // Handler Search User click
    const handleSearchClick = (event) => {
      event.preventDefault();
      userSearchFunction(searchField.value, chatRoomId);
    }

    // Handle Search User pressing Enter
    const handleSearchEnter = (event) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        userSearchFunction(searchField.value, chatRoomId);
      }
    }

    search_user_close.addEventListener('click', handleCancel);
    search_user_submit.addEventListener('click', handleSearchClick);
    form.addEventListener('keydown', handleSearchEnter);
  } else {
    queryModal.showModal();
  }
}

// Search for user based on input
// and display the results
function userSearchFunction(query, chatRoomId) {
  const searchResults = document.getElementById('search_user_results');
  searchResults.innerHTML = "";
  const modal = document.getElementById('search_user_modal');
  fetch(`/apiv1/user/${query}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Error finding user, sorry 😞');
      }
      return response.json();
    })
    .then((data) => {
      showNotification(data.message);
      if (data.success) {
        data.data.forEach((elem) => {
          const container = document.createElement('div');
          container.setAttribute('id', elem._id);
          container.innerText = elem.userName.toString();
          searchResults.appendChild(container);
          container.addEventListener('click', (event) => {
            addUserToChat(elem, chatRoomId);
          });
        });
      } else {
        closeModal(modal);
      }
    })
    .catch((error) => {
      showNotification(error.toString());
      console.error('userSearchModal: Error: ', error);
    })
}

// Request to API to add user to chatRoom
// Parse out response and rerender chatRoom element
function addUserToChat(userObject, chatRoomId) {
  const modal = document.getElementById('search_user_modal');
  fetch('/apiv1/chatRoom', {
    method: "PUT",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      chatRoom: chatRoomId,
      add: [
        {
          _id: userObject._id.toString(),
          userName: userObject.userName.toString(),
        }
      ]
    })
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Error adding user to chatRoom ☹️");
      } else {
        return response.json()
      }
    })
    .then((data) => {
      // For each chatRoom recieved...
      data.data.forEach((elem) => {
        // Only work on the chatRoom that matches chatRoomId argument
        // Clear out chatRoom element's contents and replace with 
        // response data
        if (elem._id.toString() === chatRoomId.toString()) {
          document.getElementById(chatRoomId).querySelector('a').innerHTML = "";
          elem.participants.forEach((participant) => {
            if (participant._id.toString() != data.userData._id.toString()) {
              const userName = document.createElement('p');
              userName.innerText = participant.userName;
              document.getElementById(chatRoomId.toString()).querySelector('a').appendChild(userName);
            }
          });
        }
      });
      closeModal(modal);
    })
    .catch((err) => {
      showNotification(err);
      console.error('userSearchModal.js: addUserToChat: Error', err);
    })
}

function closeModal(modal) {
  const field = document.getElementById('search_user_field');
  const searchResults = document.getElementById('search_user_results');
  field.value = "";
  searchResults.innerHTML = "";
  modal.close();
}
