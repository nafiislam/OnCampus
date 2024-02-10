export default function middleware(req, res, next){
    res.header('Access-Control-Allow-Origin', `${process.env.DOMAIN}`);
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Credentials', 'true');
  
    if (req.method === 'OPTIONS') {
      // Handle preflight requests
      res.status(204).json({message: "preflight requests"});
    } else {
      next();
    }
}