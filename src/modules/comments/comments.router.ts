import express, { Router } from "express";
import { commnetsController } from "./comments.controller";
import { auth, UserRole } from "../../middleware/auth";

const router = express.Router();

router.post(
  "/",
  auth(UserRole.ADMIN, UserRole.USER),
  commnetsController.createComments
);
router.get("/author/:authorId", commnetsController.getCommentsByAuthor);
router.delete(
  "/:id",
  auth(UserRole.ADMIN, UserRole.USER),
  commnetsController.deleteComment
);



router.patch(
  "/:commentId",
  auth(UserRole.ADMIN, UserRole.USER),
  commnetsController.updateComment
);
router.patch(
  "/moderate/:commentId",
  auth(UserRole.ADMIN),
  commnetsController.commentControl
);
router.get("/:commentId", commnetsController.getCommentsById);
export const commentsRouter: Router = router;
