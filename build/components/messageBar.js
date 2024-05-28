const messagesSection = document.getElementById('messages_section');

// Declare message bar, it's constiutent parts, & add to document
export const messageBarContainer = document.createElement('div');
messageBarContainer.setAttribute('id', 'message_bar_container');
const messageArea = document.createElement('textarea');
messageArea.setAttribute('id', 'message_area');
const messageSendButton = document.createElement('button');
messageSendButton.setAttribute('id', 'message_send_button');
messageSendButton.setAttribute('class', 'btn btn-primary');
messageSendButton.setAttribute('type', 'submit');
messageSendButton.innerText = 'Send';
messageBarContainer.appendChild(messageArea);
messageBarContainer.appendChild(messageSendButton);
messagesSection.appendChild(messageBarContainer);
