import { date, number, prefault } from "better-auth/*";
import { CommentStatus, Post, PostStatus } from "../../../generated/prisma/client";
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
    include:{
     _count:{
      select:{
         comments:true
      }
     }
    },
    orderBy: {[payload.sortBy] : payload.sortOrder}
 })
//  console.log(allPosts.length);

const count= await prisma.post.count({
   where:{
    AND : andConditions
    },
    
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
      },
      include:{
         // comments:true // for all commemts
         comments :{
         where :{
            parentId:null
         },
         orderBy:{createdAt : "desc"},
         include:{
            replies: {
               where:{
                  status: CommentStatus.APPROVED
               },
               orderBy:{createdAt:"asc"},

               include: {
                  replies : true
               }
            }
         }
         },
         _count: {
            select:{
               comments: true
            }
         }
      }
   })
   return postData
   })
   return result
   
}


const getMyPosts=async(authorId : string)=>{

   const userInfo = await prisma.user.findFirstOrThrow({
      where :{
         id : authorId,
         status : 'ACTIVE'
      },
      select :{
         id : true
      }
   })
   // console.log('My Posts');
   const result = await prisma.post.findMany({
      where :{
         authorId
      },
      orderBy :{
         createdAt : "desc"
      },
      include :{
         _count :{
            select :{
               comments : true
            }
         }
      }
   })

   const myTotalPosts= await prisma.post.count ({
      where :{
         authorId
      }
   })
   return { data :{
      result,
      myTotalPosts
   }}
}

const updateMyPost =async(postId : string, data : Partial<Post>,authorId : string,isAdmin : boolean)=>{
   console.log('Updated',{postId,data,authorId});
   // user - update own posts but cant update is featured field
// admi - everything
const postData = await prisma.post.findUniqueOrThrow({
  where :{
   id : postId
  },
  select :{
   authorId:true,
   id : true
  } 
})

if ( !isAdmin && (postData.authorId !== authorId)  ){
   throw new Error('You are not allowed to update this')
}
// if(!isAdmin && (postData.authorId === authorId)){
//    return prisma.post.update ({
//       where :{
//          id : postId
//       },
//      select :{
//       isFeatured : false
//      },
//      data
//    })
// }

if (!isAdmin){
   delete data.isFeatured
}
 return prisma.post.update({
   where :{
      id : postId
   },
   data
 })
}

// delete user

// user nijer post delete
// admin all posts delete

const deletePost= async(postId : string,authorId : string, isAdmin : boolean)=>{
   console.log('Deleted');
   const postData = await prisma.post.findFirstOrThrow ({
      where :{
         id :postId
      },
      select :{
         id :true,
         authorId : true
      }
   })

   if (!isAdmin && (postData.authorId !== authorId)){
      throw new Error("You are not owner or creator")
   }

   return await prisma.post.delete ({
      where :{
         id : postId
      }
   })
   
}

export const PostService={
    createPost,
    getAllPostService,
    getPostByIdService,
  getMyPosts,
  updateMyPost,
  deletePost
}