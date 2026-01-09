
import { prisma } from "../../lib/prisma"
import { CommentStatus } from "../../../generated/prisma/enums"




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
        
        },
        orderBy:{createdAt:"desc"},
        include:{
            post:{
                select:{
                    id: true,
                    title:true

                }
            }
        }
    })
    
}

const deleteComment=async(id : string,userId: string)=>{
    // console.log('Comment deleted');
  console.log( {
    id,userId
  });

  const commentData= await prisma.comment.findFirst({
    where :{
        id,
        authorId:userId
    },
    select:{
        id : true
    }
  })
console.log({commentData});
  if(!commentData){
    throw new Error("Not found   comment")
  }

  return await prisma.comment.delete({
    where:{
        id:commentData.id
    }
  })
  

  
  
  
    //own comment
    //loggedin
    //check if comment is own
    
    // return await prisma.comment.delete({
    //     where:{
    //         id
    //     }
    // })
}


const updateComment=async(authorId : string,commentId : string,data :{content? : string,status?: CommentStatus})=>{
  // authorId,commentId,content(status)
console.log({authorId,commentId,data});

const commentData= await prisma.comment.findFirst({
    where :{
    id:commentId,
        authorId:authorId
    },
    select:{
        id : true
    }
  })
console.log({commentData});
  if(!commentData){
    throw new Error("comment Not found   ")
  }
 return await prisma.comment.update({
    where:{
        id: commentId
    },
    data
 })
}


const commentControl = async(commentId: string,data: {status : CommentStatus})=>{

    console.log('Moderate comment', {
        commentId,data
    });
    
    const commentData= await prisma.comment.findUniqueOrThrow({
        where:{
            id:commentId
        }, 
        select:{
            id: true,
            status:true
        }
    })
// console.log(commentData);


if(commentData.status=== data.status){

    throw new Error('Your provided status is already exists')
} 
return await prisma.comment.update({
    
    where:{
        id:commentId
    },
    data,
    
}

)

}



 
export const commentsServices={
    createComments,
    getCommentsById,
    getCommentsByAuthor,
    deleteComment,
    updateComment,
    commentControl,
    
}