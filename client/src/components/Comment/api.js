const imgLink =
  'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260';

let comments = [
  {
    id: '1',
    body: 'First comment',
    username: 'Jack',
    userId: '1',
    parentId: null,
    replyUsername: null,
    createdAt: '2021-08-16T23:00:33.010+02:00',
  },
  {
    id: '2',
    body: 'Second comment',
    username: 'John',
    userId: '2',
    parentId: null,
    replyUsername: null,
    createdAt: '2021-08-16T23:00:33.010+02:00',
  },
  {
    id: '3',
    body: 'First comment first child',
    username: 'Jessie',
    userId: '2',
    parentId: '1',
    replyUsername: 'Jack',
    createdAt: '2021-08-16T23:00:33.010+02:00',
  },
  {
    id: '4',
    body: 'Second commentsecond child',
    username: 'Mike',
    userId: '2',
    parentId: '3',
    replyUsername: 'Jessie',
    createdAt: '2021-08-16T23:00:33.010+02:00',
  },
];

export const getComments = async (eventId) => {
  return comments;
};

export const createComment = async (text, eventId, parentId = null, replyUsername) => {
  const newComment = {
    id: Math.random().toString(36).substr(2, 9),
    body: text,
    parentId,
    userId: 'b181acc6-b50d-4938-951a-0b19a5ed59b0',
    username: 'Serena',
    replyUsername,
    createdAt: new Date().toISOString(),
  };
  comments.push(newComment);
  return newComment;
};

export const updateComment = async (commentId, text) => {
  comments = comments.map((comment) => {
    if (comment.id === commentId) {
      return { ...comment, body: text };
    }
    return comment;
  });
};

export const deleteComment = async (commentId) => {
  comments = comments.filter((comment) => comment.id !== commentId);
};
