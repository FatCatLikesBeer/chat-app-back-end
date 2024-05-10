const chatRoomRouter = require('express').Router();
const chatRoomController = require("../controllers/chatRoomController");

/* Get ChatRooms */
chatRoomRouter.get('/', chatRoomController.chatRoomList);

/* Create ChatRoom */
chatRoomRouter.post('/', chatRoomController.chatRoomCreate);

/* Edit ChatRoom */
chatRoomRouter.put('/', chatRoomController.chatRoomEdit);

/* Delete ChatRoom */
chatRoomRouter.delete('/', chatRoomController.chatRoomDelete);

/* Get ChatRoom Detail */
chatRoomRouter.get('/:id', chatRoomController.chatRoomDetail);

module.exports = chatRoomRouter;
