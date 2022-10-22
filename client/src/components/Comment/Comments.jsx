import { useState, useEffect } from 'react';
import { Paper, Divider } from '@mui/material';
import { useSelector } from 'react-redux';
import CommentForm from './CommentForm';
import Comment from './Comment';
import './Comment.css';
import { axiosInstance } from '../../config.js';

const Comments = ({ eventId }) => {
  const { currentUser, token } = useSelector((state) => state.user);
  const [backendComments, setBackendComments] = useState([]);
  const [rootComments, setRootComments] = useState([]);
  const [activeComment, setActiveComment] = useState(null);
  const [change, setChange] = useState(false);

  const getReplies = (commentId) =>
    backendComments
      .filter((backendComment) => backendComment.parent_id === commentId)
      .sort((a, b) => new Date(a.last_update_date).getTime() - new Date(b.last_update_date).getTime());

  const addComment = async (text, parent_id, replyId) => {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    await axiosInstance.post(
      `/review/${eventId}`,
      {
        parent_id: parent_id,
        message: text,
        reply_review_id: replyId,
      },
      config
    );
    setActiveComment(null);
    setChange((prev) => !prev);
  };

  const updateComment = async (text, commentId) => {
    await axiosInstance.put('/review', { id: commentId, message: text });
    setActiveComment(null);
    setChange((prev) => !prev);
  };
  const deleteComment = async (commentId) => {
    if (window.confirm('Are you sure you want to remove comment?')) {
      await axiosInstance.delete('/review', {}, { params: { id: commentId } });
      setChange((prev) => !prev);
    }
  };

  useEffect(() => {
    axiosInstance.get('/review', { params: { id: eventId } }).then((res) => {
      setBackendComments(res.data);
      const root = res.data.filter((backendComment) => backendComment.parent_id === null);
      setRootComments(root);
      console.log(res.data);
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
              userId={rootComment.user_id}
              key={rootComment.id}
              comment={rootComment}
              replies={getReplies(rootComment._id)}
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
