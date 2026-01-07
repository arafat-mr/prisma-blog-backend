import express, { Router } from "express";
import { commnetsController } from "./comments.controller";
import { auth, UserRole } from "../../middleware/auth";



const router =express.Router()

router.post('/',
    auth(UserRole.ADMIN,UserRole.USER),
    commnetsController.createComments)
    router.get('/author/:authorId',commnetsController.getCommentsByAuthor)
router.get('/:commentId',commnetsController.getCommentsById)
export const commentsRouter : Router=router