'use strict';

const Comment = require('../models/comment.model');
const { BadRequestError, NotFoundError } = require("../core/error.response");
const { findProduct } = require("../models/repositories/product.repo");

class CommentService {
    static async createComment({
        productId, userId, content, parentCommentId = null
    }) {
        const comment = new Comment({
            comment_productId: productId,
            comment_userId: userId,
            comment_content: content,
            comment_parentId: parentCommentId
        })

        let rightValue
        if (parentCommentId) {
            const parentComment = await Comment.findById(parentCommentId);
            if (!parentComment) {
                throw new NotFoundError('Parent comment not found');
            }

            rightValue = parentComment.comment_right;

            await Comment.updateMany(
                {
                    comment_productId: productId,
                    comment_right: { $gte: rightValue }
                },
                { $inc: { comment_right: 2 } }
            );

            await Comment.updateMany(
                {
                    comment_productId: productId,
                    comment_left: { $gt: rightValue }
                },
                { $inc: { comment_left: 2 } }
            );
        } else {
            const maxRightComment = await Comment.findOne({
                comment_productId: productId,
            }, 'comment_right').sort({ comment_right: -1 });

            if (maxRightComment) {
                rightValue = maxRightComment.comment_right + 1;
            } else {
                rightValue = 1;
            }
        }

        comment.comment_left = rightValue;
        comment.comment_right = rightValue + 1;

        return await comment.save();
    }

    static async getCommentsByProductId({
        productId,
        parentCommentId = null,
        limit = 50,
        offset = 0
    }) {
        if (parentCommentId) {
            const parentComment = await Comment.findById(parentCommentId);
            if (!parentComment) {
                throw new NotFoundError('Parent comment not found');
            }

            return await Comment.find({
                comment_productId: productId,
                comment_left: { $gt: parentComment.comment_left },
                comment_right: { $lt: parentComment.comment_right },
            })
                .select({
                    comment_left: 1,
                    comment_right: 1,
                    comment_content: 1,
                    comment_userId: 1,
                })
                .sort({ comment_left: 1 })
                .skip(offset)
                .limit(limit);
        }

        return await Comment.find({
            comment_productId: productId,
            comment_parentId: null
        })
            .select({
                comment_left: 1,
                comment_right: 1,
                comment_content: 1,
                comment_userId: 1,
            })
            .sort({ comment_left: 1 })
            .skip(offset)
            .limit(limit);
    }

    static async deleteComment({ commentId, productId }) {
        const foundProduct = await findProduct({ product_id: productId });
        if (!foundProduct) {
            throw new NotFoundError('Product not found');
        }
        const commentToDelete = await Comment.findById(commentId);
        if (!commentToDelete) {
            throw new NotFoundError('Comment not found');
        }
        const leftValue = commentToDelete.comment_left;
        const rightValue = commentToDelete.comment_right;
        const width = rightValue - leftValue + 1;
        await Comment.deleteMany({
            comment_productId: productId,
            comment_left: { $gte: leftValue, $lte: rightValue }
        });
        await Comment.updateMany(
            {
                comment_productId: productId,
                comment_left: { $gt: rightValue },
            },
            { $inc: { comment_left: -width } }
        );
        await Comment.updateMany(
            {
                comment_productId: productId,
                comment_right: { $gt: rightValue }
            },
            { $inc: { comment_right: -width } }
        );
        return true;
    }
}

module.exports = CommentService;