import mongoose from 'mongoose'

const postSchema = new mongoose.Schema({
    title:String,
    message:String,
    creator:String,
    name:String,
    tags:[String],
    selectedFile:String,
    likes:[String],
    createdAt:{
        type:Date,
        default:new Date()
    }
})

const postMessage = mongoose.model('PostMessage',postSchema)

export default postMessage