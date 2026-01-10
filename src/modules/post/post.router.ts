
import express, { Router } from "express";
import { postController } from "./post.controller";
import { auth, UserRole } from "../../middleware/auth";



const router= express.Router()


router.post('/',auth(UserRole.ADMIN,UserRole.USER),postController.createPost)
router.get('/myPosts',auth(UserRole.ADMIN,UserRole.USER),postController.getMyPosts)

router.get('/',postController.getAllPosts)

router.get('/states',postController.getStates)
router.patch ('/:postId',auth(UserRole.ADMIN,UserRole.USER),postController.updateMyPost)

router.delete('/:postId',auth(UserRole.ADMIN,UserRole.USER),postController.deletePost)
 router.get('/:postId',auth(UserRole.ADMIN,UserRole.USER),postController.getPostById)

export const postRouter:Router=router 