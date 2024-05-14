import express from 'express';

import { createMessage, createMessageVision, createConversation, getConversation } from '../controllers/conversation.controller.js';

const routerChat = express.Router();

routerChat.post('/sendMessage/:id', createMessage);

export default routerChat;