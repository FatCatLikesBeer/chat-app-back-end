const form = document.getElementById('signup_form');
const notification = document.getElementById('notification');
const app = document.getElementById('app');

// Show Notifications
function showNotification(msg) {
  const message = document.createElement('p');
  message.innerText = msg;
  notification.replaceChildren(message);
  notification.removeAttribute('hidden');
}

// Delete From Function
function deleteForm() {
  form.remove();
}

// Show app function
function showApp() {
  deleteForm();
  app.removeAttribute('hidden');
}

// Set cookie function
function setCookie(token) {
  document.cookie = "Barer " + token;
}

// On Load:
// Send Token if it exists
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
    }
  })
  .catch(err => {
    console.error(err);
    showNotification(err);
  });

// Logic for signup
// If signup successful, delete form, show notification, load app
// If signup fail, retain form, show notification.
form.addEventListener('submit', function(event) {
  event.preventDefault();
  const userName = document.getElementById('userName').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
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
      console.log(data.message);
    })
    .catch(error => {
      showNotification(error);
      deleteForm();
      console.log(error);
    });
});
