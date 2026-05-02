import express from 'express'

const router = express.Router();

router.post('/add-school', (req, res) => {
    const { name } = req.body;
    res.send(`School ${name} added successfully`);
})

export default router;