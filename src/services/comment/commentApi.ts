import { Comment, CommentWithReplies, CreateCommentRequest, CreateCommentResponse, GetCommentsResponse } from './interfaceComment';

// Base URL - ajustar según tu configuración
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ;

export const getCommentsByPostId = async (postId: string): Promise<CommentWithReplies[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/posts/${postId}/comments`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Agregar token de autenticación si es necesario
        // 'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Error al obtener comentarios: ${response.statusText}`);
    }

    const data: GetCommentsResponse = await response.json();
    
    // El backend ya envía los comentarios estructurados
    // Solo validamos y devolvemos los datos
    return data.comments;
  } catch (error) {
    console.error('Error en getCommentsByPostId:', error);
    throw error;
  }
};

export const createComment = async (commentData: CreateCommentRequest): Promise<Comment> => {
  try {
    const response = await fetch(`${API_BASE_URL}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // 'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(commentData),
    });

    if (!response.ok) {
      throw new Error(`Error al crear comentario: ${response.statusText}`);
    }

    const data: CreateCommentResponse = await response.json();
    return data.comment;
  } catch (error) {
    console.error('Error en createComment:', error);
    throw error;
  }
};

export const updateComment = async (commentId: string, content: string): Promise<Comment> => {
  try {
    const response = await fetch(`${API_BASE_URL}/comments/${commentId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        // 'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ content }),
    });

    if (!response.ok) {
      throw new Error(`Error al actualizar comentario: ${response.statusText}`);
    }

    const data: CreateCommentResponse = await response.json();
    return data.comment;
  } catch (error) {
    console.error('Error en updateComment:', error);
    throw error;
  }
};

export const deleteComment = async (commentId: string): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/comments/${commentId}`, {
      method: 'DELETE',
      headers: {
        // 'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Error al eliminar comentario: ${response.statusText}`);
    }
  } catch (error) {
    console.error('Error en deleteComment:', error);
    throw error;
  }
};

export const parseStructuredComments = (comments: any[]): CommentWithReplies[] => {
  return comments.map((comment) => ({
    ...comment,
    replies: comment.replies ? parseStructuredComments(comment.replies) : undefined,
  })) as CommentWithReplies[];
};
