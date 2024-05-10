const messageRouter = require('express').Router();
const messageController = require("../controllers/messageController");

/* Get ChatRooms */
messageRouter.get('/', messageController.messageList);

/* Create ChatRoom */
messageRouter.post('/', messageController.messageCreate);

/* Edit ChatRoom */
messageRouter.put('/', messageController.messageEdit);

/* Delete ChatRoom */
messageRouter.delete('/', messageController.messageDelete);

/* Get ChatRoom Detail */
messageRouter.get('/:id', messageController.messageDetail);

module.exports = messageRouter;
