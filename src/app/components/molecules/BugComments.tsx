import { useEffect, useState } from "react";
import { MessageSquare } from "lucide-react";
import { Comment, CommentService } from "@/app/services/commentService";
import { User, UserService } from "@/app/services/userService";
import { UtilService } from "@/app/services/utilService";
import { Button } from "../atoms";

type CommentWithAuthor = Comment & {
  author?: User;
};

interface CommentsSectionProps {
  bugId: string;
  loggedUser: User;
}

export function CommentsSection({ bugId, loggedUser }: CommentsSectionProps) {
  const [comments, setComments] = useState<CommentWithAuthor[]>([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    const fetchCommentsWithAuthors = async () => {
      const rawComments = await CommentService.getAllCommentsByBug(bugId);
      const commentsWithAuthors = await Promise.all(
        (rawComments ?? []).map(async (comment) => {
          const author = await UserService.getById(comment.authorId);
          return { ...comment, author };
        })
      );
      setComments(commentsWithAuthors);
    };

    fetchCommentsWithAuthors();
  }, [bugId]);

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    const savedComment = await CommentService.saveComment({
      bugId,
      authorId: loggedUser.id,
      content: newComment,
      createdAt: new Date().toISOString(),
    });

    const author = await UserService.getById(loggedUser.id);

    setComments((prev) => [...prev, { ...savedComment, author }]);
    setNewComment("");
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {comments.map((comment) => (
          <div
            key={comment.id}
            className="flex gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
          >
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <p className="font-semibold text-gray-900 dark:text-white">
                  {comment.author?.firstName + " " + comment.author?.lastName}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {UtilService.formatDate(comment.createdAt)}
                </p>
              </div>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {comment.content}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
          <MessageSquare className="w-4 h-4 mr-2" />
          Adicionar Comentário
        </h3>
        <div className="space-y-3">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Digite seu comentário..."
            className="w-full p-4 border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            rows={4}
          />
          <div className="flex justify-end">
            <Button onClick={handleAddComment}>Publicar Comentário</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
