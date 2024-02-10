function validateRequestAdmin(req, res, next) {
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

function validateRequestUser(req, res, next) {
    const { email } = req.headers;

    if (!email) {
        res.send({ message: "Unauthorized access" });
        return;
    }

    next();
}

export { validateRequestAdmin, validateRequestUser };

