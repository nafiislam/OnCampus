export default function middleware(req, res, next){
    res.header('Access-Control-Allow-Origin', ['http://127.0.0.1:5000/','http://127.0.0.1:5001/','http://127.0.0.1:5002/']);
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