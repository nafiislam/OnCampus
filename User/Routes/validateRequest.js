export default function validateRequest(req, res, next) {
    const { email, admin } = req.headers;

    if (!email) {
        return { message: "Unauthorized access" };
    }

    if (admin != "admin") {
        return { message: "Unauthorized access" };
    }
}