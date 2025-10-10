import { useEffect, useState } from "react";
import { MessageSquare } from "lucide-react";
import { UtilService } from "@/app/services/utilService";
import { Button } from "../atoms";
import User from "@/app/models/User";
import { BugService } from "@/app/services/bugService";

type LocalComment = {
  id: string;
  bugId: string;
  authorId: string;
  content: string;
  createdAt: string;
};

type CommentWithAuthor = LocalComment & {
  author?: string;
};

interface CommentsSectionProps {
  bugId: string;
  loggedUser: User;
  initialComments?: any[];
  onCommentAdded?: (comment: CommentWithAuthor) => void;
}

export function CommentsSection({ bugId, loggedUser, initialComments = [], onCommentAdded }: CommentsSectionProps) {
  const [comments, setComments] = useState<CommentWithAuthor[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadFromProps = async () => {
      const remapped = (initialComments ?? []).map((c: any) => {
        const normalized: LocalComment = {
          id: c.id || c.commentId || String(c.createdAt || Date.now()),
          bugId: c.bugId || bugId,
          authorId: c.authorId || c.userId || c.createdBy || "",
          content: c.content || c.text || c.message || "",
          createdAt: c.createdAt || c.createdDate || new Date().toISOString(),
        };
        const authorName: string | undefined = c.author ?? c.authorName ?? c.createdByName ?? c.userName ?? c.userFullName;
        return { ...normalized, author: authorName ?? "-" } as CommentWithAuthor;
      });
      setComments(remapped);
    };

    loadFromProps();
  }, [bugId, initialComments]);

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    setIsSubmitting(true);
    // Persist via backend
    try {
      const resp = await BugService.addCommentAsync(bugId, newComment);
      // Try to infer created entity from response
      const created = (resp?.data ?? resp) as any;

      const local: LocalComment = {
        id: created?.id || created?.commentId || String(Date.now()),
        bugId,
        authorId: String(loggedUser.id),
        content: created?.content || created?.comment || newComment,
        createdAt: created?.createdAt || new Date().toISOString(),
      };

  const withAuthor: CommentWithAuthor = { ...local, author: created?.author || (loggedUser.firstName + " " + loggedUser.lastName) };
      setComments((prev) => [...prev, withAuthor]);
      onCommentAdded?.(withAuthor);
    } catch (e) {
      // As a fallback, still update UI locally
      const local: CommentWithAuthor = {
        id: String(Date.now()),
        bugId,
        authorId: String(loggedUser.id),
        content: newComment,
        createdAt: new Date().toISOString(),
        author: loggedUser.firstName + " " + loggedUser.lastName,
      };
      setComments((prev) => [...prev, local]);
      onCommentAdded?.(local);
    } finally {
      setNewComment("");
      setIsSubmitting(false);
    }
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
                  {comment.author}
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
            <Button onClick={handleAddComment} disabled={isSubmitting || !newComment.trim()}>
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span>
                  Publicando...
                </span>
              ) : (
                "Publicar Comentário"
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
