import { addMenu } from './components/addNew.js';
import { menu } from './components/burgerMenuModal.js';
import { populateChats } from './components/chatRoom.js';
import { appendMessage } from './components/messages.js';
const title = document.getElementById('title');
const form_container = document.getElementById('form_container');
const signup_form = document.getElementById('signup_form');
const login_form = document.getElementById('login_form');
const notification = document.getElementById('notification');
const appContainer = document.getElementById('app_container');

// userData
export let userData;

// Login, signup, & page refresh logic
import './components/login.js';
import './components/signup.js';

// Show Notifications
export function showNotification(msg) {
  const message = document.createElement('p');
  message.innerText = msg;
  notification.replaceChildren(message);
  notification.removeAttribute('hidden');
  setTimeout(() => {
    notification.setAttribute('hidden', '');
  }, 6000);
}

// Delete From Function
export function deleteForm() {
  form_container.setAttribute('disabled', '');
  form_container.setAttribute('hidden', '');
  form_container.remove();
}

// WebSocket Object
// chatRoom.js handles handshake
// messageBar.js handles sending & reception of messages
export let ws;

// Show app function
export function showApp(name, userId) {
  document.querySelector('#show_chats').removeAttribute('hidden');
  deleteForm();
  menu.showMenu();
  addMenu.showMenu();
  appContainer.removeAttribute('hidden');
  appContainer.removeAttribute('disabled');
  title.innerText = `${name}`;

  // WebSocket Stuff
  ws = new WebSocket('ws://10.0.0.8:3000/');
  ws.addEventListener('message', (event) => {
    const message = JSON.parse(event.data);
    appendMessage(message, userId);
  });

  // Show/hide chatrooms for mobile screen sizes
  const hideChatRooms = () => {
    show_chats.querySelector('a').innerText = 'arrow_forward_ios';
    chatRooms_container.style.display = "none";
  }
  const showChatRooms = () => {
    show_chats.querySelector('a').innerText = 'close';
    chatRooms_container.style.display = "block";
  }

  const handleTouch = () => {
    if (show_chats.querySelector('a').innerText === 'arrow_forward_ios') {
      showChatRooms();
    } else {
      hideChatRooms();
    }

    document.addEventListener('click', (event) => {
      if (!show_chats.contains(event.target) && !chatRooms_container.contains(event.target) && window.innerWidth <= 650) {
        hideChatRooms();
      }
    })

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && window.innerWidth <= 650) {
        hideChatRooms();
      }
    })
  }
  // Run this once just to get things to work on login
  handleTouch();

  show_chats.addEventListener('click', handleTouch);
  window.addEventListener('resize', (event) => {
    // If window small hide chatRooms, else show them
    if (window.innerWidth <= 650) {
      hideChatRooms();
    } else {
      showChatRooms();
    }
  });
}

// Logout
export function logout() {
  const logoutMessages = [
    "Reloading: Hold Tight ⏲",
    "Leaving so soon?! 😫",
    "thankyoucomeagain ⏲",
    "[placeholder_exit_message_index_3] 🤖",
  ]
  document.body.innerHTML = `<h3>${logoutMessages[Math.floor(Math.random() * logoutMessages.length)]}</h3>`;
  // Fetch /apiv1/logout to let server clear cookie
  fetch('/apiv1/logout')
    .then((response) => {
      console.log(response);
      if (!response.ok) {
        throw new Error("Unable to logout");
      } else {
        return response.json();
      }
    })
    .then((data) => {
      if (data.success) {
        setTimeout(() => {
          location.reload();
        }, 500);
      } else {
        document.body.innerHTML = '<h1>SOMETHING WENT TERRIBLY WRONG OOPS</h1>';
      }
    })
    .catch((err) => {
      showNotification(err);
      console.error(err);
    })
}

// Toggle Form between login & signup
const toggle = document.getElementById('toggle_form');
toggle.addEventListener('click', () => {
  if (toggle.innerText === "Signup") {
    toggle.innerText = "Login"
  } else {
    toggle.innerText = "Signup"
  }
  if (toggle.innerText === "Signup") {
    signup_form.setAttribute('hidden', '');
    login_form.removeAttribute('hidden', '');
    signup_form.removeChild(toggle);
    login_form.appendChild(toggle);
  } else {
    login_form.setAttribute('hidden', '');
    signup_form.removeAttribute('hidden', '');
    login_form.removeChild(toggle);
    signup_form.appendChild(toggle);
  }
});

// On Load:
// Send Cookie/Token if it exists
// If token valid, remove form, load app
// If invalid or non-existant show login/signup forms
fetch('/apiv1/chatRoom')
  .then(response => response.json())
  .then(data => {
    showNotification("Welcome!");
    if (data.success) {
      userData = data.userData;
      showApp(data.userData.userName, data.userData._id.toString());
      populateChats(data.data, data.userData);
    } else {
      form_container.removeAttribute('hidden');
      login_form.removeAttribute('hidden');
    }
  })
  .catch(err => {
    console.error(err);
    showNotification(err);
  });
