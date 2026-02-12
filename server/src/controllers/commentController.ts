import type { Request, Response } from 'express';
import * as queries from '../db/queries';
import { getAuth } from '@clerk/express';

// Create a new comment for a project (private)
export const createComment = async (req: Request, res: Response) => {
    try {
        const { userId } = getAuth(req);
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const { projectId } = req.params;
        const { content } = req.body;

        if (!content) return res.status(400).json({ message: 'Comment content is required' });

        const project = await queries.getProjectById(String(projectId));
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        const comment = await queries.createComment({
            content,
            userId,
            projectId: String(projectId),
        });
        res.status(201).json(comment);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to create comment' });
    }
};

// Delete a comment by its ID (private - owner only)
export const deleteComment = async (req: Request, res: Response) => {
    try {
        const { userId } = getAuth(req);
        if (!userId) return res.status(401).json({ message: 'Unauthorized' });
        
        const { commentId } = req.params;

        const existingComment = await queries.getCommentById(String(commentId));
        if (!existingComment) return res.status(404).json({ message: 'Comment not found' });

        if (existingComment.userId !== userId) {
            return res.status(403).json({ message: 'You can only delete your own comments' });
        }
        
        await queries.deleteComment(String(commentId));
        res.status(200).json({ message: 'Comment deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to delete comment' });
    }
};