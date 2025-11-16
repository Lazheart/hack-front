import React from 'react';
import type { CommentWithReplies } from '../services/comment/interfaceComment';

// Tipo alias para mantener compatibilidad con el componente actual
export type Reply = CommentWithReplies;
export type CommentData = CommentWithReplies;

interface CommentProps {
  comment: CommentData;
}

interface CommentSectionProps {
  comments?: CommentData[];
}

// Componente individual de comentario
export const Comment: React.FC<CommentProps> = ({ comment }) => {
  return (
    <div className="flex">
      <div className="flex-shrink-0 mr-3">
        <img
          className="mt-2 rounded-full w-8 h-8 sm:w-10 sm:h-10"
          src={comment.avatar}
          alt={comment.author}
        />
      </div>
      <div className="flex-1 border rounded-lg px-4 py-2 sm:px-6 sm:py-4 leading-relaxed">
        <strong>{comment.author}</strong>{' '}
        <span className="text-xs text-gray-400">{comment.timestamp}</span>
        <p className="text-sm">{comment.content}</p>

        {/* Mostrar respuestas si existen */}
        {comment.replies && comment.replies.length > 0 && (
          <>
            <h4 className="my-5 uppercase tracking-wide text-gray-400 font-bold text-xs">
              Respuestas
            </h4>
            <div className="space-y-4">
              {comment.replies.map((reply) => (
                <div key={reply.id} className="flex">
                  <div className="flex-shrink-0 mr-3">
                    <img
                      className="mt-3 rounded-full w-6 h-6 sm:w-8 sm:h-8"
                      src={reply.avatar}
                      alt={reply.author}
                    />
                  </div>
                  <div className="flex-1 bg-gray-100 rounded-lg px-4 py-2 sm:px-6 sm:py-4 leading-relaxed">
                    <strong>{reply.author}</strong>{' '}
                    <span className="text-xs text-gray-400">{reply.timestamp}</span>
                    <p className="text-xs sm:text-sm">{reply.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Mostrar contador de respuestas si no hay replies expandidos */}
        {!comment.replies && comment.replyCount && comment.replyCount > 0 && (
          <div className="mt-4 flex items-center">
            <div className="flex -space-x-2 mr-2">
              {comment.replyAvatars?.slice(0, 2).map((avatar, index) => (
                <img
                  key={index}
                  className="rounded-full w-6 h-6 border border-white"
                  src={avatar}
                  alt=""
                />
              ))}
            </div>
            <div className="text-sm text-gray-500 font-semibold">
              {comment.replyCount} {comment.replyCount === 1 ? 'Respuesta' : 'Respuestas'}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Componente de sección de comentarios
export const CommentSection: React.FC<CommentSectionProps> = ({ comments = [] }) => {
  return (
    <div className="antialiased mx-auto max-w-screen-sm">
      <h3 className="mb-4 text-lg font-semibold text-gray-900">Comentarios</h3>

      {comments.length === 0 ? (
        <p className="text-gray-500 text-sm">No hay comentarios aún.</p>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <Comment key={comment.id} comment={comment} />
          ))}
        </div>
      )}
    </div>
  );
};

export default { CommentSection, Comment };
