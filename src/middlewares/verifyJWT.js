const jwt = require('jsonwebtoken');

function verifyJWT(request, response, next){
    const authHeader = request.headers.authorization;
    if (!authHeader) {
        return response.status(401).send({error: "Sem Header Token"});
    }
    const [scheme, token] = authHeader.split(" ");
    if (scheme !== "Bearer") {
        return response.status(401).send({error: "Sem Bearer"});
    }

    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
        if(err) return response.status(401).send({error: "Token Inválido"})
        request.userId = decoded.userId;
        request.userType = decoded.userType;
        next();
    })
}

module.exports = { verifyJWT };