
import express, { Router } from "express";
import { postController } from "./post.controller";
import { auth, UserRole } from "../../middleware/auth";



const router= express.Router()


router.post('/',postController.createPost)
router.get('/myPosts',auth(UserRole.ADMIN,UserRole.USER),postController.getMyPosts)

router.get('/',postController.getAllPosts)

router.patch ('/:postId',auth(UserRole.ADMIN,UserRole.USER),postController.updateMyPost)
 router.get('/:postId',auth(UserRole.ADMIN,UserRole.USER),postController.getPostById)

export const postRouter:Router=router 