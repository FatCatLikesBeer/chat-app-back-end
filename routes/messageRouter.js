const messageRouter = require('express').Router();
const messageController = require("../controllers/messageController");

/* Get Messages */
messageRouter.get('/', messageController.messageList);

/* Create Message */
messageRouter.post('/', messageController.messageCreate);

/* Edit Message */
messageRouter.put('/', messageController.messageEdit);

/* Delete Message */
messageRouter.delete('/', messageController.messageDelete);

/* Get Message Detail */
messageRouter.get('/:id', messageController.messageDetail);

module.exports = messageRouter;
