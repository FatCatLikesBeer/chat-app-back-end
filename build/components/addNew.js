// Create Add Menu Icon
const iconContainer = document.createElement('span');
const iconImage = document.createElement('a');
iconContainer.setAttribute('id', 'add_menu');
iconContainer.setAttribute('class', 'material-symbols-outlined');
iconImage.setAttribute('id', 'test');
iconImage.innerText = 'add';
iconContainer.appendChild(iconImage);

// Create Modal Element
const modalContainer = document.createElement('div');
modalContainer.setAttribute('id', 'add_modal');
modalContainer.classList.add('close');
modalContainer.innerHTML = "<menu><li><a id='add_chatRoom'>Create Chatroom</a></li><li><a id='add_user'>Add User</a></li></menu>"
document.body.prepend(modalContainer);

// Modal Animations
function modalClose() {
  add_modal.classList.remove('open');
  add_modal.classList.add('close');
  iconImage.innerText = 'add';
}
function modalOpen() {
  add_modal.classList.remove('close');
  add_modal.classList.add('open');
  iconImage.innerText = 'close';
}

// Add Menu Icon animation
iconContainer.addEventListener('click', (event) => {
  if (iconImage.innerText === 'add') {
    modalOpen();
  } else {
    modalClose();
  }
});

// Close Modal Listeners
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && add_modal.classList.contains('open')) {
    modalClose();
  }
});
document.addEventListener('click', (event) => {
  if (add_modal.classList.contains('open') && !modalContainer.contains(event.target) && !iconContainer.contains(event.target)) {
    modalClose();
  }
});

// Export function to the call the Add Menu icon in & out of existence
export const addMenu = {
  showMenu() {
    header.appendChild(iconContainer);
  },
  removeMenu() {
    if (document.getElementById('add_menu') != null) {
      header.removeChild(iconContainer);
    }
  },
}


