import CommentForm from './CommentForm';
import { Grid, Button, Avatar } from '@mui/material';
import ReplyIcon from '@mui/icons-material/Reply';
import { useNavigate } from 'react-router-dom';
import { format } from 'timeago.js';

import More from './More';
import './Comment.css';

function getInitials(firstname, lastname) {
  return `${firstname[0]}.${lastname[0]}`;
}

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
  const canModify = currentUserId === userId;
  const canReply = Boolean(currentUserId);
  const replyId = parentId ? parentId : comment.id;
  const navigateProfile = () => {
    navigate(`/profile/${userId}`);
  };
  return (
    <Grid className="comment" container wrap="wrap" spacing={2}>
      <Grid item onClick={navigateProfile}>
        {/* <Avatar>{getInitials(comment.username, comment.username)}</Avatar> */}
        <Avatar alt={comment.username} src="/" />
      </Grid>
      <Grid justifyContent="left" item xs zeroMinWidth>
        <div className="comment-header">
          <div className="comment-content">
            <h4 className="comment-author">{comment.username || 'Unknown User'}</h4>
            <div>{format(comment.createdAt)}</div>
          </div>

          {canModify && <More handleEdit={setActiveComment} handleDelete={deleteComment} id={comment.id} />}
        </div>
        {!isEditing && (
          <div className="comment-text">
            {comment.parentId ? (
              <>
                <span className="at_reply">{`@${comment.replyUsername}`}</span>
                <span>{comment.body}</span>
              </>
            ) : (
              comment.body
            )}
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
