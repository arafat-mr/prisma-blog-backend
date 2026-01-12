import { NextFunction, Request, Response } from "express"
import { Prisma } from "../../generated/prisma/client";

function errorHandler (err :any, req:Request, res:Response, next:NextFunction) {
  if (res.headersSent) {
    return next(err)
  }


  let statusCode = 500;
  let errorMessage = 'Internal server error';
  let errorDetails= err

  // prismaClientValidationError

  if(err instanceof Prisma.PrismaClientValidationError){
    statusCode=400;
    errorMessage= 'You have entered an invalid field type or some fields are missing'
  }
  //PrismaClientKnownRequestError
  else if(err instanceof Prisma.PrismaClientKnownRequestError){
      if(err.code ==='P2025'){
        statusCode=400;
        errorMessage= 'An operation failed because it depends on one or more records that were required but not found. {cause}'
      }
      else if(err.code= "P2002"){
          statusCode=400;
        errorMessage= 'Unique constraint failed on the {constraint}'
      } else if(err.code='P2003'){
         statusCode=400;
        errorMessage="Foreign key constraint failed on the field: {field_name}"
      }
  }
  // PrismaClientUnknownError
  else if ( err instanceof Prisma.PrismaClientUnknownRequestError){
    statusCode;
    errorMessage='An error occured during query execution'

  }
  // prismaClientInitializationError
  else if (err instanceof Prisma.PrismaClientInitializationError){
   if(err.errorCode=== 'P1000'){
     statusCode=401;
     errorMessage='Authentication failed! please check your login credentials'
   }
   else if(err.errorCode==='P1001'){
    statusCode = 400,
    errorMessage= 'Cant reach database server'
   }
  }
  res.status(statusCode)
  res.json({
    message :errorMessage,
    error:errorDetails
  })
}


export default errorHandler