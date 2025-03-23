import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Comment } from '../../types';

interface CommentsState {
  comments: Comment[];
  loading: boolean;
  error: string | null;
}

const initialState: CommentsState = {
  comments: [],
  loading: false,
  error: null,
};

const commentsSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {
    addComment: (state, action: PayloadAction<Comment>) => {
      state.comments.push(action.payload);
    },
    addReply: (state, action: PayloadAction<{ parentId: string; reply: Comment }>) => {
      const comment = state.comments.find(c => c.id === action.payload.parentId);
      if (comment) {
        if (!comment.replies) {
          comment.replies = [];
        }
        comment.replies.push(action.payload.reply);
      }
    },
    toggleLike: (state, action: PayloadAction<{ commentId: string; userId: string }>) => {
      const comment = state.comments.find(c => c.id === action.payload.commentId);
      if (comment) {
        if (comment.likes.includes(action.payload.userId)) {
          comment.likes = comment.likes.filter(id => id !== action.payload.userId);
        } else {
          comment.likes.push(action.payload.userId);
        }
      }
    },
  },
});

export const { addComment, addReply, toggleLike } = commentsSlice.actions;
export default commentsSlice.reducer;