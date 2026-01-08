import { Request, Response } from "express"
import { commentsServices } from "./comments.service"



const createComments= async(req:Request,res:Response)=>{
    try {
      const user= req.user
      req.body.authorId = user?.id
        const result= await commentsServices.createComments(req.body)
        res.status(200).json(result)
        
    } catch (error : any) {
        res.status(400).json({
            error:error.message,
            message:'comment creation failed'
        })
    }
}

const getCommentsById= async(req:Request,res:Response)=>{
    try {
        const {commentId}=req.params
        
        const result = await commentsServices.getCommentsById(commentId as string)
        res.status(200).json(result)
    } catch (error:any) {
        res.status(400).json({
            error:error.message,
            message:' failed to get comment'
        })
    }
}

const getCommentsByAuthor = async(req:Request,res: Response)=>{
    try {
        console.log('HIT getCommentsByAuthor');

        const {authorId}= req.params
        console.log(authorId);
        
        const result= await commentsServices.getCommentsByAuthor(authorId as string)
        res.status(200).json(result)
    } catch (error : any) {
          res.status(400).json({
            error:error.message,
            message:' failed to get comments by author'
        })
    }
    //   const {authorId}= req.params
//     console.log(req.params);
    
//       await commentsServices.getCommentsByAuthor(req.params.authorId as string)
}

const deleteComment = async(req:Request,res:Response)=>{
    try {
   const {id}= req.params
//    console.log(id);
const user=req.user
    const result= await commentsServices.deleteComment(id as string,user?.id as string)
        res.status(200).json({
            message:' comment deleted successfully'
        })
    } catch (error : any) {
        res.status(400).json({
            error:error.message,
            message:' failed to delete comment'
        })
    }
}


const updateComment =async(req:Request,res:Response)=>{
    try {

        const authorId = req.user?.id
        const {commentId}= req.params
        const data= req.body
          

        console.log({authorId,commentId,data});
        
        const result = await commentsServices.updateComment(authorId as string,commentId as string,data )
        res.status(200).json(result)
    } catch (error : any) {
         res.status(400).json({
            error:error.message,
            message:' failed to Update comment'
        })
    }
}
export const commnetsController={
    createComments,
    getCommentsById,
    getCommentsByAuthor,
    deleteComment,
    updateComment

}