import React, { useEffect, useState } from "react";
import { useUser } from "../../services/UserContext";
import ApiService from "../../services/ApiService";
import { useNavigate, Routes, Route, useLocation } from "react-router-dom";
import Comments from "./Comments";
import Modal from "./Modal";
import styles from "./Posts.module.css";

const Post = ({ post, setError, updatePosts, index }) => {
  const [editedContent, setEditedContent] = useState(post.body);
  const [editingPost, setEditingPost] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);
  const [showComments, setShowComments] = useState(false);

  const navigate = useNavigate();
  const { currentUser } = useUser();
  const location = useLocation();

  useEffect(() => {
    if (
      location.pathname === `/users/${currentUser.id}/home/posts/${post.id}/comments`
    ) {
      openModal(post.id);
      setShowComments(true);
    }
  }, [location.pathname, currentUser?.id]);

  const openModal = (post) => {
    setSelectedPost(post);
  };
  const closeModal = () => {
    navigate(`/users/${currentUser.id}/home/posts`);
    setSelectedPost(null);
    setShowComments(false);
  };

  const handleEditPost = async () => {
    try {
      await ApiService.request({
        url: `http://localhost:3000/posts/${post.id}`,
        method: "PATCH",
        body: { body: editedContent },
      });
      updatePosts((prevPosts) => {
        const updatedPosts = [...prevPosts];
        updatedPosts[index] = { ...updatedPosts[index], body: editedContent };
        return updatedPosts;
      });
      setEditingPost(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeletePost = async (id) => {
    try {
      await ApiService.request({
        url: `http://localhost:3000/posts/${id}`,
        method: "DELETE",
      });
      updatePosts((prevPosts) => prevPosts.filter((post) => post.id !== id));
      closeModal();
    } catch (err) {
      setError(err.message);
    }
  };

  const toggleComments = () => {
    if (showComments) {
      navigate(-1);
    } else {
      navigate(`${post.id}/comments`);
    }
    setShowComments((prev) => !prev);
  };

  return (
    <div className={styles.postCard}>
      <div
        className={styles.postContent}
        onClick={() => openModal(post)}
      >
        <strong>{post.id}</strong>. {post.title}
      </div>

      <Modal isOpen={!!selectedPost} onClose={closeModal}>
        {selectedPost && (
          <div>
            <h2>{post.title}</h2>
            <div className={styles.postContent}>
              <p>{post.body}</p>
              {String(post.userId) === String(currentUser.id) && (
                <div className={styles.postActions}>
                  <button
                    className={styles.deleteButton}
                    onClick={() => handleDeletePost(post.id)}
                  >
                    🗑️ Delete
                  </button>
                  {editingPost === post.id ? (
                    <>
                      <textarea
                        className={styles.addPostTextarea}
                        value={editedContent}
                        onChange={(e) => setEditedContent(e.target.value)}
                      ></textarea>
                      <button className={styles.addButton} onClick={handleEditPost}>
                        Save
                      </button>
                      <button
                        className={styles.cancelButton}
                        onClick={() => setEditingPost(null)}
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      className={styles.editButton}
                      onClick={() => setEditingPost(post.id)}
                    >
                      ✏️ Edit
                    </button>
                  )}
                </div>
              )}
              <button
                onClick={toggleComments}
                className={styles.commentsButton}
              >
                {showComments ? "Hide Comments" : "View Comments"}
              </button>
              <Routes>
                <Route
                  path=":id/comments"
                  element={<Comments post={post} setError={setError} />}
                />
              </Routes>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Post;
