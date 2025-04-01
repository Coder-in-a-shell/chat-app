import jwt from 'jsonwebtoken';

export const generateToken = (userId , res) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: '7d',
    });
    res.cookie('jwt', token, {
        httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
        secure: process.env.NODE_ENV === 'production', 
        sameSite: 'strict', // Helps prevent CSRF attacks
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });
 
    return token;
}