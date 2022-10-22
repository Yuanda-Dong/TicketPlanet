import { useState, useEffect } from 'react';
import { Paper, Divider } from '@mui/material';
import { useSelector } from 'react-redux';
import CommentForm from './CommentForm';
import Comment from './Comment';
import './Comment.css';

import {
  getComments as getCommentsApi,
  createComment as createCommentApi,
  updateComment as updateCommentApi,
  deleteComment as deleteCommentApi,
} from './api.js';

const Comments = ({ eventId }) => {
  const { currentUser } = useSelector((state) => state.user);
  const [backendComments, setBackendComments] = useState([]);
  const [rootComments, setRootComments] = useState([]);
  const [activeComment, setActiveComment] = useState(null);
  const [change, setChange] = useState(false);

  const getReplies = (commentId) =>
    backendComments
      .filter((backendComment) => backendComment.parent_id === commentId)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

  const addComment = (text, parent_id, replyId) => {
    createCommentApi(text, eventId, currentUser._id, parent_id, replyId).then((comment) => {
      setActiveComment(null);
      setChange((prev) => !prev);
    });
  };

  const updateComment = (text, commentId) => {
    updateCommentApi(commentId, text).then(() => {
      setActiveComment(null);
      setChange((prev) => !prev);
    });
  };
  const deleteComment = (commentId) => {
    if (window.confirm('Are you sure you want to remove comment?')) {
      deleteCommentApi(commentId);
      setChange((prev) => !prev);
    }
  };

  useEffect(() => {
    getCommentsApi(eventId).then((data) => {
      setBackendComments(data);
      const root = data.filter((backendComment) => backendComment.parent_id === null);
      setRootComments(root);
    });
  }, [change]);

  return (
    <Paper className="comments">
      <h3 className="comments-title">
        {rootComments?.length} {rootComments?.length === 1 ? 'Review' : 'Reviews'}
      </h3>
      <Divider sx={{ margin: '20px 0' }} />
      <CommentForm commentDisabled={currentUser ? false : true} submitLabel="Post" handleSubmit={addComment} />
      {rootComments && (
        <div className="comments-container">
          {rootComments.map((rootComment) => (
            <Comment
              userId={rootComment.userId}
              key={rootComment.id}
              comment={rootComment}
              replies={getReplies(rootComment.id)}
              activeComment={activeComment}
              setActiveComment={setActiveComment}
              addComment={addComment}
              deleteComment={deleteComment}
              updateComment={updateComment}
              currentUserId={currentUser?._id}
            />
          ))}
        </div>
      )}
    </Paper>
  );
};

export default Comments;
