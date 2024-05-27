import { logout } from '../script.js';
const header = document.getElementById('header');
const appContainer = document.getElementById('app_container');

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
modalContainer.setAttribute('hidden', '');
modalContainer.innerHTML = "<menu><li><a id='logout'>Logout</a></li></menu>"
document.body.prepend(modalContainer);
//I would like to do the code below but it doesn't want to work
//appContainer.prepend(modalContainer);

// Menu Click Interaction
let modalOpen = false;
menuIcon.addEventListener('click', () => {
  modalOpen = !modalOpen;
  if (modalOpen) {
    modalContainer.removeAttribute('hidden');
    menuIcon.innerText = 'close';
  } else {
    modalContainer.setAttribute('hidden', '');
    menuIcon.innerText = 'menu';
  }
  console.log('Menu Clicked');
});

document.getElementById('logout').addEventListener('click', () => {
  logout();
});

// Export function to the call the menu in and out of existence
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

