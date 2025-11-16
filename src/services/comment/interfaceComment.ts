// Interfaces para los datos de comentarios

/**
 * Comentario base - estructura interna
 * Cada comentario está asociado a un post y puede tener un parentCommentId
 */
export interface Comment {
  id: string;
  postId: string; // Asociado a una publicación
  parentCommentId: string | null; // null para comentarios de nivel superior
  author: string;
  avatar: string;
  content: string;
  timestamp: string;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Comentario con respuestas anidadas
 * El backend estructura los comentarios y envía esta estructura
 */
export interface CommentWithReplies {
  id: string;
  postId: string;
  parentCommentId: string | null;
  author: string;
  avatar: string;
  content: string;
  timestamp: string;
  createdAt?: string;
  updatedAt?: string;
  replies?: CommentWithReplies[]; // Respuestas anidadas (estructuradas por el backend)
  replyCount?: number; // Calculado por el backend
  replyAvatars?: string[]; // Avatares de respuestas (calculado por el backend)
}

/**
 * Request para crear un comentario
 */
export interface CreateCommentRequest {
  postId: string;
  parentCommentId?: string | null;
  content: string;
}

/**
 * Response del backend al crear un comentario
 */
export interface CreateCommentResponse {
  comment: Comment;
  message?: string;
}

/**
 * Response del backend al obtener comentarios
 * El backend envía los comentarios ya estructurados en árbol
 */
export interface GetCommentsResponse {
  comments: CommentWithReplies[]; // Array de comentarios ya estructurados por el backend
}

