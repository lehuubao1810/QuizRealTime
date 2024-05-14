import express from 'express';

import routerQuiz from './quiz.route.js';

const router = express.Router();

router.get('/', (req, res) => {
    res.send('I\'m running!'); 
});

router.use('/quiz', routerQuiz);

export default router;