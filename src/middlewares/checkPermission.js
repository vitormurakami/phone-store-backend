const jwt = require('jsonwebtoken');

function checkPermission(userType) {
    return (request, response, next) => {
        if(request.userType !== userType){
        return response.status(403).json({ mensagem: 'Acesso não autorizado' });
        }
        next(); 
        
      };
}

module.exports = { checkPermission };