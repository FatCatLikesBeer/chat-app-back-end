import { menu } from './components/burgerMenuModal.js';
import { populateChats } from './components/chatRoom.js';
const title = document.getElementById('title');
const form_container = document.getElementById('form_container');
const signup_form = document.getElementById('signup_form');
const login_form = document.getElementById('login_form');
const notification = document.getElementById('notification');
const appContainer = document.getElementById('app_container');

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
  form_container.remove();
}

// Show app function
export function showApp(name) {
  deleteForm();
  menu.showMenu();
  appContainer.removeAttribute('hidden');
  title.innerText = `${name}`;
}

// Set cookie function
export function setCookie(token) {
  document.cookie = "Barer " + token;
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
  setTimeout(() => {
    location.reload();
    setCookie('');
  }, 500);
}

// Toggle Form
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
// If invalid or existant, do nothing.
fetch('/apiv1/chatRoom', {
  headers: {
    'Content-Type': 'application/json',
  }
})
  .then(response => response.json())
  .then(data => {
    showNotification(data.message);
    if (data.success) {
      showApp(data.userData.userName);
      populateChats(data.data, data.userData._id.toString());
    } else {
      form_container.removeAttribute('hidden');
      login_form.removeAttribute('hidden');
    }
  })
  .catch(err => {
    console.error(err);
    showNotification(err);
  });

// App logic
