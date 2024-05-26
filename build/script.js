import { menu } from './components/burgerMenuModal.js';
const form_container = document.getElementById('form_container');
const signup_form = document.getElementById('signup_form');
const login_form = document.getElementById('login_form');
const notification = document.getElementById('notification');
const appContainer = document.getElementById('appContainer');
const navbar = document.getElementById('navbar');

// Show Notifications
function showNotification(msg) {
  const message = document.createElement('p');
  message.innerText = msg;
  notification.replaceChildren(message);
  notification.removeAttribute('hidden');
}

// Delete From Function
function deleteForm() {
  form_container.remove();
}

// Show app function
function showApp() {
  deleteForm();
  navbar.remove();
  menu.showMenu();
  appContainer.removeAttribute('hidden');
}

// Set cookie function
function setCookie(token) {
  document.cookie = "Barer " + token;
}

// Logout
export function logout() {
  console.log("Logging out");
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
  } else {
    login_form.setAttribute('hidden', '');
    signup_form.removeAttribute('hidden', '');
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
      showApp();
    } else {
      form_container.removeAttribute('hidden');
      login_form.removeAttribute('hidden');
    }
  })
  .catch(err => {
    console.error(err);
    showNotification(err);
  });

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
        showApp();
        setCookie(data.token);
      }
    })
    .catch(error => {
      // Fetch Failure
      showNotification(error);
      deleteForm();
      console.log(error);
    });
});

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
        showApp();
        setCookie(data.token);
      }
    })
    .catch(error => {
      showNotification(error);
      deleteForm();
      console.log(error);
    });
});

