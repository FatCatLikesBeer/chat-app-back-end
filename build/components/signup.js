const signup_form = document.getElementById('signup_form');
import { populateChats } from './chatRoom.js';
import { showNotification, showApp, deleteForm } from '../script.js';

// Logic for signup
// If signup successful, delete form, show notification, load app
// If signup fail, retain form, show notification.
signup_form.addEventListener('submit', function(event) {
  event.preventDefault();
  const userName = document.getElementById('signup_userName').value;
  const password = document.getElementById('signup_password').value;
  const email = document.getElementById('signup_email').value;
  fetch('/apiv1/signup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      'userName': userName,
      'email': email,
      'password': password,
    })
  })
    .then((response) => {
      document.getElementById('signup_password').value = '';
      return response;
    })
    .then((response) => {
      if (response.status === 500) {
        throw new Error("Signup: Error requesting to server");
      } else {
        return response.json();
      }
    })
    .then(data => {
      showNotification(data.message);
      // Successful Signup
      if (data.success) {
        showApp(data.userData.userName, data.userData._id.toString());
        populateChats();
      } else {
        throw new Error(data.message);
      }
    })
    .catch(error => {
      // Fetch Failure
      console.log(error);
      showNotification(error);
    });
});

