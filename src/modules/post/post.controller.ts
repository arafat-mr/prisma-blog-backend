import { Request, Response } from "express"
import { PostService } from "./post.service"
import { PostStatus } from "../../../generated/prisma/enums";
import { paginationSorting } from "../../utils/pagination_sorting";
import { prisma } from "../../lib/prisma";
import { UserRole } from "../../middleware/auth";



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
        console.log(error);
        
         res.status(400).json({
            details:error.message,
            message:'Creation failed'
            
         })
    }
 
}

const getAllPosts= async(req:Request,res:Response)=>{
    try {
        const {search}= req.query
        console.log(req.user)
        console.log('search value is',search);
        const searchString=typeof search ==='string'? search: undefined

        const tagsSearch  = req.query.tags? (req.query.tags as string).split(',') : []

        // const featured = req.query.isFeatured? (req.query.isFeatured as string| boolean ):undefined
        
                // const featured= req.query.isFeatured ==='true' || req.query.isFeatured ==='false' ? req.query.isFeatured ==='true': undefined
                const featured =
  req.query.isFeatured === 'true'
    ? true
    : req.query.isFeatured === 'false'
    ? false
    : undefined;


    const searchByStatus= req.query.status as PostStatus | undefined
    const searchByAuthorId= req.query.authorId as string | undefined
    // const page =Number(req.query.page ?? 1)
    // const limit= Number(req.query.limit ?? 5)
    // const sortBy=req.query.sortBy as string
    // const sortOrder= req.query.sortOrder as string

    // const skip= (page-1)* limit

    const  options= paginationSorting(req.query) 
    const {page,limit,skip,sortBy,sortOrder}=options

      console.log('PS Options : ',options);
      
        const result= await PostService.getAllPostService({search:searchString,tags:tagsSearch,isFeatured:featured,status:searchByStatus,authorId: searchByAuthorId,page,limit,skip,sortBy,sortOrder})
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


const getPostById= async(req:Request,res:Response)=>{

    
    try {

        const {postId }= req.params
        console.log(postId);
        console.log(req.user);
        
        // if(!id){
        //     throw new Error('post id required')
        // }
         
        const result= await PostService.getPostByIdService(postId as string)
        res.status(200).json(result)
        
    } catch (error:any) {
        res.status(400).json({
            details:error.message,
            message:' failed to get post by id'
         })
    }
}

const getMyPosts= async(req:Request,res:Response)=>{
    try {
        const user =req.user
        console.log(user);
        const result=await PostService.getMyPosts(user?.id as string)
        res.status(200).json(result)
    } catch (error : any) {
          res.status(400).json({
            details:error.message,
            message:' failed to get post by id'
         })
    }
}

// user - update own posts but cant update is featured field
// admi - everything
const updateMyPost = async(req:Request,res:Response)=>{
    try {
        const {postId}= req.params
        const authorId  = req.user?.id
        const isAdmin = req.user?.role === UserRole.ADMIN
        console.log(isAdmin);
        
        const result = await PostService.updateMyPost(postId as string, req.body,authorId as string,isAdmin as boolean)

        res.status(200).json(result)
    } catch (error : any) {
        res.status(400).json({
            details:error.message,
            message:' failed to update post'
         })
    }
}

const deletePost =async(req:Request,res:Response)=>{
try {
    const {postId}= req.params
const authorId= req.user?.id
const isAdmin= req.user?.role === UserRole.ADMIN

const result = await PostService.deletePost(postId as string,authorId as string,isAdmin as boolean)
res.status(200).json({
    message :'Deleted successfully'
})
} catch (error : any) {
res.status(400).json({
            details:error.message,
            message:' failed to delete post'
         })
}


}

const getStates= async (req:Request,res:Response)=>{
   try {
  

const result = await PostService.getstats()
res.status(200).json(result)
} catch (error : any) {
res.status(400).json({
            details:error.message,
            message:' failed to get states'
         })
}
}
export const postController={
    createPost,
    getAllPosts,
    getPostById,
   getMyPosts,
   updateMyPost,
   deletePost,
   getStates
}