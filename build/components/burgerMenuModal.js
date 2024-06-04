import { logout } from '../script.js';
// const header = document.getElementById('header');

// Create Menu Icon & Attributes
const menuIcon = document.createElement('a');
menuIcon.innerText = 'menu';

// Create Menu Icon Container & Attributes
const menuContainer = document.createElement('span');
menuContainer.setAttribute('id', 'menu');
menuContainer.setAttribute('class', 'material-symbols-outlined');
menuContainer.appendChild(menuIcon);

// Create Modal & Attributes
const modalContainer = document.createElement('div');
modalContainer.setAttribute('id', 'modal');
modalContainer.classList.add('close');
modalContainer.innerHTML = "<menu><li><a id='logout'>Logout</a></li></menu>"
document.body.prepend(modalContainer);
//I would like to do the code below but it doesn't want to work
//appContainer.prepend(modalContainer);

// Menu Click Interaction
// Toggle modalOpen
let isModalOpen = false;
menuIcon.addEventListener('click', () => {
  isModalOpen = !isModalOpen;
  if (isModalOpen) {
    modalOpen();
  } else {
    modalClose();
  }
});

function modalClose() {
  modal.classList.remove('open');
  modal.classList.add('close');
  menuIcon.innerText = 'menu';
}

function modalOpen() {
  modal.classList.remove('close');
  modal.classList.add('open');
  menuIcon.innerText = 'close';
}

// Close modal if click outside of modal
document.addEventListener('click', (event) => {
  if (isModalOpen === true && !modalContainer.contains(event.target) && !menuContainer.contains(event.target)) {
    modalClose();
    isModalOpen = !isModalOpen;
  }
});

// Close modal if press escape
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && modal.classList.contains('open')) {
    modalClose();
    isModalOpen = !isModalOpen;
  }
});

document.getElementById('logout').addEventListener('click', () => {
  logout();
});

// Export function to the call the menu icon in & out of existence
export const menu = {
  showMenu() {
    header.appendChild(menuContainer);
  },
  removeMenu() {
    if (document.getElementById('menu') != null) {
      header.removeChild(menuContainer);
    }
  },
}

