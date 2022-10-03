import mongoose from 'mongoose'
import postMessage from '../models/postMessage.js'

export const getPosts =async(req,res)=>{
    try {
        const postMessages = await postMessage.find()
        res.status(201).json(postMessages)
    } catch (error) {
        res.status(404).json({message:error})
    }
}
// 6326fe82fcfe6993ae0558b4

export const createPost = async(req,res)=>{
    const post = req.body
    console.log(req.userId)
    const newPost = new postMessage({...post, creator:req.userId, createdAt:new Date().toISOString()})
    try {
        await newPost.save()
        res.status(201).json(newPost)
    } catch (error) {
        res.status(409).json({message:error})
    }
}

export const updatePost = async(req,res)=>{
    const {id:_id} = req.params
    const post = req.body

    if(!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send("Internal error occured")
    const updatedPost = await postMessage.findByIdAndUpdate(_id,{...post,_id},{new:true})
    res.json(updatedPost)
}

export const deletePost = async(req,res)=>{
    const {id} = req.params

    if(!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send("Internal error occured")

    await postMessage.findByIdAndRemove(id)

    res.json({message:"Post is deleted successfully"})
}

export const likePost = async(req,res) =>{
    const {id} = req.params

    if(!req.userId) return res.json({message:"Unauthenticated user"})

    if(!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send("Internal error occured")

    const post = await postMessage.findById(id)

    // If the liked id is equal to the authenticated user id then it means that the user is liking the post again
    // liked id is coming from the params
    const index = post.likes.findIndex((id)=>id === String(req.userId))

    if(index===-1){
        post.likes.push(req.userId)
    }else{
        post.likes.filter((id)=>id !== String(req.userId))
    }
    // Initially likes array will be emmpty which means that the index of likes array will be -1 
    const updatedPost = await postMessage.findByIdAndUpdate(id,post, {new:true})
    res.json(updatedPost)
}