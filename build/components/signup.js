const signup_form = document.getElementById('signup_form');
import { populateChats } from './chatRoom.js';
import { showNotification, showApp, setCookie, deleteForm } from '../script.js';

// Logic for signup
// If signup successful, delete form, show notification, load app
// If signup fail, retain form, show notification.
signup_form.addEventListener('submit', function(event) {
  event.preventDefault();
  const userName = document.getElementById('signup_userName').value;
  const email = document.getElementById('signup_email').value;
  const password = document.getElementById('signup_password').value;
  fetch('/apiv1/signup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ 'userName': userName, "email": email, "password": password })
  })
    .then(response => response.json())
    .then(data => {
      showNotification(data.message);
      // Successful Signup
      if (data.success) {
        showApp(data.userData.userName);
        setCookie(data.token);
        populateChats();
      }
    })
    .catch(error => {
      // Fetch Failure
      showNotification(error);
      deleteForm();
      console.log(error);
    });
});

