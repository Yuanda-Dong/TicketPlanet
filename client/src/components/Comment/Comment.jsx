import CommentForm from './CommentForm';
import { Grid, Button, Avatar } from '@mui/material';
import ReplyIcon from '@mui/icons-material/Reply';
import { useNavigate } from 'react-router-dom';

import More from './More';
import './Comment.css';

function Comment({
  userId,
  comment,
  replies,
  setActiveComment,
  activeComment,
  updateComment,
  deleteComment,
  addComment,
  parentId = null,
  currentUserId,
}) {
  const navigate = useNavigate();

  const isEditing = activeComment && activeComment.id === comment.id && activeComment.type === 'editing';
  const isReplying = activeComment && activeComment.id === comment.id && activeComment.type === 'replying';
  // const fiveMinutes = 300000;
  // const timePassed = new Date() - new Date(comment.createdAt) > fiveMinutes;
  // const canDelete = currentUserId === comment.userId && replies.length === 0;
  // const canEdit = currentUserId === comment.userId;
  const canModify = currentUserId === userId;
  const canReply = Boolean(currentUserId);
  const replyId = parentId ? parentId : comment.id;
  // const createdAt = new Date(comment.update_time).toLocaleDateString();
  const navigateProfile = () => {
    navigate(`/profile/${userId}`);
  };
  return (
    <Grid className="comment" container wrap="wrap" spacing={2}>
      <Grid item onClick={navigateProfile}>
        <Avatar>{comment.username}</Avatar>
      </Grid>
      <Grid justifyContent="left" item xs zeroMinWidth>
        <div className="comment-header">
          <div className="comment-content">
            <h4 className="comment-author">{comment.username || 'Unknown User'}</h4>
            <div>{comment.createdAt}</div>
          </div>

          {canModify && <More handleEdit={setActiveComment} handleDelete={deleteComment} id={comment.id} />}
        </div>
        {!isEditing && (
          <div className="comment-text">
            {comment.parentId ? `@${comment.replyUsername} ${comment.body}` : comment.body}
          </div>
        )}
        {isEditing && (
          <CommentForm
            submitLabel="Update"
            hasCancelButton
            initialText={comment.body}
            handleSubmit={(text) => updateComment(text, comment.id)}
            handleCancel={() => {
              setActiveComment(null);
            }}
          />
        )}
        <div className="comment-actions">
          {canReply && (
            <Button
              startIcon={<ReplyIcon />}
              className="comment-action"
              onClick={() => setActiveComment({ id: comment.id, type: 'replying' })}
            >
              Reply
            </Button>
          )}
        </div>
        {isReplying && (
          <CommentForm
            submitLabel="Reply"
            hasCancelButton={true}
            handleCancel={() => {
              setActiveComment(null);
            }}
            handleSubmit={(text) => addComment(text, replyId, comment.username)}
          />
        )}
        {replies.length > 0 && (
          <div className="replies">
            {replies.map((reply) => (
              <Comment
                userId={reply.userId}
                key={reply.id}
                comment={reply}
                replies={[]}
                setActiveComment={setActiveComment}
                activeComment={activeComment}
                updateComment={updateComment}
                deleteComment={deleteComment}
                addComment={addComment}
                parentId={comment.id}
                currentUserId={currentUserId}
              />
            ))}
          </div>
        )}
      </Grid>
    </Grid>
  );
}

export default Comment;
