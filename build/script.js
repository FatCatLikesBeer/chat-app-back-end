import { addMenu } from './components/addNew.js';
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
  form_container.setAttribute('disabled', '');
  form_container.setAttribute('hidden', '');
  form_container.remove();
}

// Show app function
export function showApp(name) {
  deleteForm();
  menu.showMenu();
  addMenu.showMenu();
  appContainer.removeAttribute('hidden');
  appContainer.removeAttribute('disabled');
  title.innerText = `${name}`;
}

// Set cookie function
export function setCookie(token) {
  // document.cookie = "Barer " + token;
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
