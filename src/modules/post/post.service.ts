import { number } from "better-auth/*";
import { Post, PostStatus } from "../../../generated/prisma/client";
import { PostWhereInput } from "../../../generated/prisma/models";
import { prisma } from "../../lib/prisma";
import { paginationSorting } from "../../utils/pagination_sorting";


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
        tags : string[] | [],
        isFeatured : boolean | undefined,
        status: PostStatus | undefined,
        authorId: string | undefined,
        page: number ,
        limit: number ,
        skip:number,
        sortBy: string ,
        sortOrder: string 
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
 if(typeof payload.isFeatured === 'boolean' ){
    andConditions.push({isFeatured:payload.isFeatured})
 }
 if (payload.status){
    andConditions.push(
       {
        status: payload.status.toUpperCase() as PostStatus
        
       }
    )
 }

 if (payload.authorId){
    andConditions.push({
        authorId: payload.authorId
    })
 }


  

 const allPosts= await prisma.post.findMany({

    take: payload.limit,
    skip:payload.skip,

    where:{
    AND : andConditions
    },
    orderBy: {[payload.sortBy] : payload.sortOrder}
 })
//  console.log(allPosts.length);

const count= await prisma.post.count({
   where:{
    AND : andConditions
    }
})
 
 return {
   data :allPosts,
   pagination :{
      count,
      page:payload.page,
      limit:payload.limit,
      totalPage: Math.ceil(count/ payload.limit)
      

   }
 }
 
}

const getPostByIdService=async(postId : string )=>{

  
   const result = await prisma.$transaction(async(newCount)=>{
        await newCount.post.update({
      where:{
         id:postId
      },
      data:{
         views:{
            increment:1
         }
      }
   })
   // console.log('get post by id',id);
   const postData = await prisma.post.findUnique({
      where :{
         id :postId
      }
   })
   return postData
   })
   return result
   
}
export const PostService={
    createPost,
    getAllPostService,
    getPostByIdService
}