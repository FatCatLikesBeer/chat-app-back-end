const login_form = document.getElementById('login_form');
import { populateChats } from './chatRoom.js';
import { showNotification, showApp, deleteForm } from '../script.js';

// Logic for login
// If login successful, delete form, show notification, load app
// If login fail, retain form, show notification.
login_form.addEventListener('submit', function(event) {
  event.preventDefault();
  const userName = document.getElementById('login_userName').value;
  const password = document.getElementById('login_password').value;
  fetch('/apiv1/login', {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ 'userName': userName, "password": password })
  })
    .then((response) => {
      if (!response.ok) {
        if (response.status != 400) {
          throw new Error("Error requesting to server");
        }
      }
      return response.json();
    })
    .then((data) => {
      // Unsuccessful response message
      showNotification(data.message);
      // Successful login
      if (data.success) {
        showApp(data.userData.userName);
        console.log(data)
        populateChats(data.chatRooms, data.userData._id.toString());
      }
    })
    .catch(error => {
      showNotification(error);
      console.log(error);
    });
});

