"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postRouter = void 0;
var express_1 = require("express");
var post_controller_1 = require("./post.controller");
var router = express_1.default.Router();
router.post('/', post_controller_1.postController.createPost);
exports.postRouter = router;
