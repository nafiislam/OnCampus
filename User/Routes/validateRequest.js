export default function validateRequest(req, res, next) {
    const { email, admin } = req.headers;

    if (!email) {
        res.send({ message: "Unauthorized access" });
        return;
    }

    if (!admin) {
        res.send({ message: "Unauthorized access" });
        return;
    }

    next();
}