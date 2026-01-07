import { dropbox } from "better-auth/types"
import { prisma } from "../../lib/prisma"




const createComments= async(payload :{
    content: string,
    postId: string,
    authorId : string,
    parentId ? : string
})=>{
//    console.log('Services comments',payload);
//    data : Omit<Post,"id" |"createdAt"|"updatedAt"| "authorId">,userId :string
   return await prisma.comment.create({
     data:payload
})
 
// const result= await prisma.comment.create({
//     data:payload
// })
//    return result
}

const getCommentsById=async(commentId: string)=>{
    console.log('Comments id is : ',commentId);
    const result= await prisma.comment.findUnique({
        where:{
            id:commentId
        }
        ,
        include:{
            replies:true,
            post:true
        },
        
        
    })
    return result
    
}

const getCommentsByAuthor = async(authorId : string)=>{
    // console.log('Author id is ', authorId);
    return await prisma.comment.findMany({

        
        where :{
            authorId
        
        }
    })
    
}
export const commentsServices={
    createComments,
    getCommentsById,
    getCommentsByAuthor
}