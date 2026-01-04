import { Request, Response } from "express"
import { PostService } from "./post.service"



const createPost = async (req:Request,res:Response)=>{

    try {
        console.log(req.user);
         const user = req.user
        if(!user){
           return  res.status(400).json({
           
            message:'Creation failed'
         })
        }
        
        const result= await PostService.createPost(req.body,user.id as string)

 res.status(201).json(result)
    } catch (error:any) {
         res.status(400).json({
            details:error.message,
            message:'Creation failed'
         })
    }
 
}

const getAllPosts= async(req:Request,res:Response)=>{
    try {
        const {search}= req.query
        console.log('search value is',search);
        const searchString=typeof search ==='string'? search: undefined

        const tagsSearch  = req.query.tags? (req.query.tags as string).split(',') : []

        const result= await PostService.getAllPostService({search:searchString,tags:tagsSearch})
        // const result= await PostService.getAllPostService({search})
        res.status(200).json({
            result
        })
    }catch (error:any) {
         res.status(400).json({
            details:error.message,
            message:' Failed to get all posts' 
         })
    }
}



export const postController={
    createPost,
    getAllPosts
}