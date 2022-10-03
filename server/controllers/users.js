import User from '../models/users.js'
import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'

export const signin = async(req,res) =>{
    const {email, password} = req.body
    try {
        const existingUser = await User.findOne({email:email})

        if(!existingUser) return res.status(404).json({message:"User does not exist"})

        const isPasswordCorrect = await bcryptjs.compare(password,existingUser.password)

        if(!isPasswordCorrect) return res.status(400).json({message:"Invalid user credentials"})

        const token = jwt.sign({email:existingUser.email,id:existingUser._id},'secret',{expiresIn:'1h'})

        res.status(200).json({result:existingUser, token:token})
    } catch (error) {
        console.log(error)
        res.status(500).json("Something went wrong",error)
    }
}

export const signup = async(req,res)=>{
    const {email,password,confirmPassword,firstName,lastName} = req.body

    try {
        const existingUser = await User.findOne({email:email})

        if(existingUser) return res.status(400).json({message:"User already exists"})

        if(password !== confirmPassword) return res.status(400).json({message:"Passwords don't match"})

        const hashPassword = await bcryptjs.hash(password,12)

        const newUser = await User.create({
            email:email,
            password:hashPassword,
            name:`${firstName} ${lastName}`
        })

        const token = jwt.sign({email:newUser.email,id:newUser._id},'secret',{expiresIn:'1h'})

        res.status(200).json({result:newUser, token:token})
    } catch (error) {
        console.log(error)
        res.status(500).json("Something went wrong",error)
    }
}
