import app from "./app";
import { prisma } from "./lib/prisma";

const port= process.env.PORT || 3000
async function main() {
     try {
        await prisma.$connect()
        

        console.log('Connected successfully');
        
        app.listen(port,()=>{
            console.log(`App is running on port ${port}`);
            
        })
        
     } catch (error) {
      console.log('An Erro Occured ',error);
        await prisma.$disconnect()
        process.exit(1)
     }
}

main()