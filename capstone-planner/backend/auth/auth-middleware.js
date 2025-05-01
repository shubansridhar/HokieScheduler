import jwt from 'jsonwebtoken';

export const checkAuth = (req, res, next) => {
    const token = req.cookies["vt_planner_jwt"];

    if (!token) {
        return res.status(401).send("Unauthorized: missing token");
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
          return res.status(401).send('Unauthorized: invalid token');
        }
        req.user = decoded;
        next();
    });
}