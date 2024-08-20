import cors from 'cors';

const adminCors = cors({
    origin: [
        'http://localhost:4200',
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
});

export default adminCors;
