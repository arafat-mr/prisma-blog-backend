import { email } from "better-auth/*"
import { prisma } from "../lib/prisma"
import { UserRole } from "../middleware/auth"
import { error, log } from "node:console"


async function seedAdmin() {
    try {
  console.log(' --------admin seeding started-------');
  
    const adminData= {
        name:'Arafatddd Mrrrr',
        email:'admin2@gmail.com',
        role:UserRole.ADMIN,
        password:'admin123',
        emailVerified:true
    }
         
    // check user if exists
    const existingUser=  await prisma.user.findUnique({
        where :{
            email: adminData.email
        }
    })

    if(existingUser){
        throw new Error('User already exists!!')
    }

    const signUpAdmin= await fetch('http://localhost:5000/api/auth/sign-up/email',{
        method:"POST",
        headers:{
            "content-type":"application/json"
        
        },
        body:JSON.stringify(adminData)

    }


    
)
console.log('----------initial admin data',signUpAdmin.body)

// emailverified false 
if(signUpAdmin.ok){
    await prisma.user.update({
        where:{
            email:adminData.email
        },
        data:{
            emailVerified: true
        }
    })
    console.log('------data after updating',signUpAdmin);
    
}
    
} catch (error) {
    console.error(error)
}
}

seedAdmin()