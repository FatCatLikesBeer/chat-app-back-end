import { populateChats } from './chatRoom.js';
import { showNotification, showApp, deleteForm } from '../script.js';

const button = document.getElementById('guest_signup');

const handleClick = (event) => {
  event.preventDefault();
  fetch('/apiv1/guest')
    .then((response) => {
      if (!response.ok) {
        throw new Error('Error registering as guest');
      }
      return response.json();
    })
    .then((data) => {
      showNotification(data.message);
      // Successful Guest Signup
      if (data.success) {
        button.removeEventListener('click', handleClick);
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

}

button.addEventListener('click', handleClick);
