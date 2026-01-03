
import { NextFunction, Request, Response } from 'express'
import {auth as betterAuth} from '../lib/auth'
import { success } from 'better-auth/*'
export enum UserRole{
USER="USER",
ADMIN="ADMIN"
}
declare global{
    namespace Express{
        interface Request{
            user?:{
                id:string,
                email:string,
                name:string,
                role:string,
                emailVerified:boolean

            }
        }
    }
}
export const auth=(...roles:UserRole[])=>{
  return async(req:Request,res:Response,next:NextFunction)=>{

   try {
     console.log('Middleware!!!');
    console.log(req.headers);
    
    // console.log(roles);
    //get user session
    const session = await betterAuth.api.getSession({
        headers:req.headers as any
    })

    if(!session){
       return res.status(400).json({
            success:false,
            message:'You are not autorized to perform this action.'
        })

    }
    if(!session?.user.emailVerified){
        return res.status(400).json({
            success:false,
            message:"Email verifiction is required . Please verify your email"
        })

    }

    req.user={
        id:session.user.id,
        email:session.user.email,
        name:session.user.name,
        role:session.user.role as any,
        emailVerified:session.user.emailVerified

    }
    if(roles.length && !roles.includes(req.user.role as UserRole)){
       return res.status(403).json({
            success:false,
            message:"Forbidden"
        })
        
    }
    next()
   } catch (error:any) {
    res.status(500).json({
        success:false,
        message:error.message
    })
   }
// console.log(session);

}
}