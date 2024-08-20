import session from 'express-session';

export const sessionMiddleware = session({
    saveUninitialized: false,
    secret: process.env.SESSION_SECRET || '$eCuRiTy',
    resave: false
});

export default sessionMiddleware;
