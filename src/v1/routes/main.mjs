import { Router } from 'express';

const router = Router();
router.get('/', (req, res) => {
  res.render('index', { title: 'Express' });
});

router.post('/', (req, res) => {
  res.status(200).send('POST request received');
});

export default router;
