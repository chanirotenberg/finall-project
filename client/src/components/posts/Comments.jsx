import React, { useEffect, useState } from "react";
import { useUser } from "../../services/UserContext";
import ApiService from "../../services/ApiService";
import styles from "./Posts.module.css";

const Comments = ({ post, setError }) => {
  const [newComment, setNewComment] = useState("");
  const [editingComment, setEditingComment] = useState(null);
  const [editedComment, setEditedComment] = useState("");
  const [comments, setComments] = useState([]);
  const { currentUser } = useUser();

  useEffect(() => {
    if (!post?.id) return;
    const fetchComments = async () => {
      try {
        const data = await ApiService.request({
          url: `http://localhost:3000/comments/?postId=${post.id}`,
        });
        setComments(data);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchComments();
  }, [post?.id]);

  const handleAddComment = async () => {
    try {
      const userDetails = await ApiService.request({
        url: `http://localhost:3000/users?username=${currentUser.username}`,
      });
      const newCommentData = {
        postId: post.id,
        name:currentUser.username,
        email: userDetails[0].email,
        body: newComment
      };
      const savedComment = await ApiService.request({
        url: "http://localhost:3000/comments",
        method: "POST",
        body: newCommentData,
      });
      setComments((prev) => [...prev, savedComment]);
      setNewComment("");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEditComment = async (commentId, index) => {
    try {
      await ApiService.request({
        url: `http://localhost:3000/comments/${commentId}`,
        method: "PATCH",
        body: { body: editedComment },
      });
      setComments((prev) => {
        const updatedComments = [...prev];
        updatedComments[index] = { ...updatedComments[index], body: editedComment };
        return updatedComments;
      });
      setEditingComment(null);
      setEditedComment("");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await ApiService.request({
        url: `http://localhost:3000/comments/${commentId}`,
        method: "DELETE",
      });
      setComments((prev) => prev.filter((comment) => comment.id !== commentId));
    } catch (err) {
      console.error("Failed to delete comment", err);
    }
  };

  return (
    <div className={styles.commentsContainer}>
      <h4 className={styles.commentsHeader}>Comments</h4>
      {comments.map((comment, index) => (
        <div key={comment.id} className={styles.commentCard}>
          <p>{comment.body}</p>
          <small>
            
            By: {comment.name === currentUser.username ? "You" : comment.email || "Unknown User"}
          </small>
          {comment.name === currentUser.username && (
            <div className={styles.commentActions}>
              {editingComment === comment.id ? (
                <>
                  <textarea
                    className={styles.addPostTextarea}
                    value={editedComment}
                    onChange={(e) => setEditedComment(e.target.value)}
                  ></textarea>
                  <button
                    className={styles.addButton}
                    onClick={() => handleEditComment(comment.id, index)}
                  >
                    Save
                  </button>
                  <button
                    className={styles.cancelButton}
                    onClick={() => setEditingComment(null)}
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <button
                    className={styles.editButton}
                    onClick={() => {
                      setEditingComment(comment.id);
                      setEditedComment(comment.body);
                    }}
                  >
                    ✏️
                  </button>
                  <button
                    className={styles.deleteButton}
                    onClick={() => handleDeleteComment(comment.id)}
                  >
                    🗑️
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      ))}
      <textarea
        className={styles.addPostTextarea}
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
        placeholder="Add a comment"
      ></textarea>
      <button className={styles.addButton} onClick={handleAddComment}>
        Add Comment
      </button>
    </div>
  );
};

export default Comments;
