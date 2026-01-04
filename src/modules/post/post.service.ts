import { Post } from "../../../generated/prisma/client";
import { PostWhereInput } from "../../../generated/prisma/models";
import { prisma } from "../../lib/prisma";


const createPost = async(data : Omit<Post,"id" |"createdAt"|"updatedAt"| "authorId">,userId :string)=>{

const result= await prisma.post.create({
    data :{
        ...data,
        authorId:userId
    }
})

return result
}


const  getAllPostService= async(payload :
     {
        search : string| undefined,
        tags : string[] | []
    })=>{
 console.log('Get all posts');
 const andConditions:PostWhereInput[]=[]
   // search conditions
 if (payload.search){
    andConditions.push(  { OR:[
         {title :{
            contains:payload.search as string,
            mode:'insensitive'
        }},
        {content :{
             contains:payload.search as string,
            mode:'insensitive'
        }},
         {tags :{
             has: payload.search as string,
            // hasEvery: 'insensitive' // Commented out as it's not valid
        }}
       ]},)
 }

 if(payload.tags.length > 0){
    andConditions.push( {tags : {
        hasEvery: payload.tags as string[]
       }})
 }
 const allPosts= await prisma.post.findMany({

    

    where:{
    AND : andConditions
    }
 })
 console.log(allPosts.length);
 
 return allPosts
 
}


export const PostService={
    createPost,
    getAllPostService
}