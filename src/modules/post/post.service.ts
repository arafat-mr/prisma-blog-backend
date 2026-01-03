import { Post } from "../../../generated/prisma/client";
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


const  getAllPostService= async(payload : {search : string| undefined})=>{
 console.log('Get all posts');
 const allPosts= await prisma.post.findMany({
    where:{
        title :{
            contains:payload.search as string,
            mode:'insensitive'
        },
        content :{
             contains:payload.search as string,
            mode:'insensitive'
        }
    }
 })
 console.log(allPosts.length);
 
 return allPosts
 
}


export const PostService={
    createPost,
    getAllPostService
}