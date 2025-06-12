import express from 'express';
import { 
    getCateringOptions,
    createCateringOrder     } from '../controllers/cateringController.js';

const router = express.Router();

router.get('/hall/:hallId', getCateringOptions);
router.post('/order', createCateringOrder);

export default router;
