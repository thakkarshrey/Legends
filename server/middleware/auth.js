import jwt from 'jsonwebtoken'

const auth = async(req,res,next)=>{
    try {
        const token = req.headers.authorization.split(" ")[1];

        const isCustomAuth = token.length < 500

        let decodedData;
        if(token && isCustomAuth){
            decodedData = jwt.verify(token, 'secret')
            decodedData.id ? req.userId = decodedData.id : req.userId = null 
        }
        else{
            decodedData = jwt.decode(token)
            decodedData.sub ? req.userId = decodedData.sub : req.userId = null;
        }
        next()
    } catch (error) {
        console.log(error) 
    }
}

export default auth