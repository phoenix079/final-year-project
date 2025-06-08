import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.get('/api', (req, res) => {
  res.send({ message: 'Hello from server!' });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});