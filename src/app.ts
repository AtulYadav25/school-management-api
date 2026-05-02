import express from 'express';
import cors from 'cors';

//Routes Imports
import schoolRoutes from './routes/schoolRoutes';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('School Management API is running');
});

app.use('/api/v1', schoolRoutes)

export default app;