import { v4 as uuidv4 } from "uuid";

export interface Comment {
  id: string;
  bugId: string;
  authorId: string;
  content: string;
  createdAt: string;
}

const COMMENTS_KEY = "comment";
export const CommentService = {
  getAllComments: (): Comment[] => {
    if (typeof window === "undefined") return [];
    const commentsJson = localStorage.getItem(COMMENTS_KEY);
    return commentsJson ? JSON.parse(commentsJson) : [];
  },

  getAllCommentsByUser: (id: String): Comment[] => {
    if (typeof window === "undefined") return [];
    const commentsJson = CommentService.getAllComments().filter(
      (comment) => comment.authorId === id
    );
    return commentsJson ? commentsJson : [];
  },

  getAllCommentsByBug: (bugId: String | undefined): Comment[] | undefined => {
    if (typeof window === "undefined") return [];
    const commentsJson = CommentService.getAllComments().filter(
      (comment) => comment.bugId === bugId
    );
    return commentsJson ? commentsJson : [];
  },

  saveComment: (comment: Omit<Comment, "id">): Comment => {
    const newComment: Comment = { ...comment, id: uuidv4() };
    const comments = CommentService.getAllComments();
    comments.push(newComment);
    localStorage.setItem(COMMENTS_KEY, JSON.stringify(comments));
    return newComment; 
  },

  deleteComment: (id: string): void => {
    const comments = CommentService.getAllComments().filter(
      (comment) => comment.id !== id
    );
    localStorage.setItem(COMMENTS_KEY, JSON.stringify(comments));
  },

  updateComment: (updateComment: Comment): void => {
    const comments = CommentService.getAllComments().map((comment) =>
      comment.id === updateComment.id ? updateComment : comment
    );
    localStorage.setItem(COMMENTS_KEY, JSON.stringify(comments));
  },

  getCommentById: (id: string): Comment | undefined => {
    return CommentService.getAllComments().find((comment) => comment.id === id);
  },
};
