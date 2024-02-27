import jwtmod from 'jsonwebtoken';
export default function middleware(req, res, next) {
    const token = req.headers['authorization']
    if (token==null) return res.status(401).json({message: "User unauthenticated"});
    const public_key = `-----BEGIN PUBLIC KEY-----\n${process.env.PUBLIC_KEY}\n-----END PUBLIC KEY-----`;

    const decodedToken = jwtmod.verify(token, public_key, {
        algorithms: ["RS256"],
    });

    const { email } = decodedToken;
    req.email = email;
    const roles = decodedToken.realm_access.roles;
    req.admin = roles.find(role => role === 'admin')?true:false;
    req.br = roles.find(role => role === 'br')?true:false;
    req.cr = roles.find(role => role === 'cr')?true:false;
    console.log('IsAdmin:', req.admin);
    console.log('email:', req.email);

    next();
}