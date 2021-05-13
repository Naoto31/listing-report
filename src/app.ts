import express, { Application, Request, Response, NextFunction }from 'express';

const app: Application = express();
const path = require('path');

app.get('/', (req: Request, res: Response, next: NextFunction) => {
    res.sendFile(path.join(__dirname, '/index.html'));
})

app.listen(4200, () => console.log('Server running'))

