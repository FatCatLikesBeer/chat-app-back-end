const login_form = document.getElementById('login_form');
import { populateChats } from './chatRoom.js';
import { showNotification, showApp, setCookie, deleteForm } from '../script.js';

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
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ 'userName': userName, "password": password })
  })
    .then(response => response.json())
    .then(data => {
      showNotification(data.message);
      // Successful login
      if (data.success) {
        showApp(data.userData.userName);
        setCookie(data.token);
        console.log(data)
        populateChats(data.chatRooms, data.userData._id.toString());
      }
    })
    .catch(error => {
      showNotification(error);
      deleteForm();
      console.log(error);
    });
});

