import React, { useEffect, useState } from "react";
import { useUser } from "../../services/UserContext";
import { useNavigate, useLocation } from "react-router-dom";
import ApiService from "../../services/ApiService";
import SearchService from "../../services/SearchService";
import Post from "./Post";
import styles from "./Posts.module.css";

const Posts = () => {
    const [posts, setPosts] = useState([]);
    const [filteredPosts, setFilteredPosts] = useState([]);
    const [error, setError] = useState("");
    const [showAllPosts, setShowAllPosts] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [criteria, setCriteria] = useState("");
    const [isAdding, setIsAdding] = useState(false);
    const [newPostTitle, setNewPostTitle] = useState("");
    const [newPostBody, setNewPostBody] = useState("");

    const navigate = useNavigate();
    const { currentUser } = useUser();
    const location = useLocation();

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                if (!currentUser?.id) {
                    return;
                }
                if (!["posts", "comments"].includes(location.pathname.split("/").pop())) {
                    navigate("/NotFound");
                }
                const url = showAllPosts
                    ? "http://localhost:3000/posts"
                    : `http://localhost:3000/posts/?userId=${currentUser.id}`;
                const data = await ApiService.request({
                    url: url,
                });
                updatePosts(data);
            } catch (err) {
                setError(err.message);
            }
        };

        fetchPosts();
    }, [currentUser?.id, showAllPosts]);

    const updatePosts = (updatedPosts) => {
        let resolvedPosts = updatedPosts;

        if (typeof updatedPosts === "function") {
            resolvedPosts = updatedPosts(posts);
        }
        setSearchQuery("");
        setCriteria("");
        setPosts(resolvedPosts);
        setFilteredPosts(resolvedPosts);
    };

    const handleSearch = (searchQuery) => {
        setSearchQuery(searchQuery);
        if (!criteria) {
            setError("Please select a search criteria and enter a query");
            return;
        }
        setError("");
        setFilteredPosts(SearchService.filterItems(searchQuery, posts, criteria));
    };

    const handleAddPost = async () => {
        try {
            const newPost = {
                userId: currentUser.id,
                title: newPostTitle,
                body: newPostBody,
            };

            const response = await ApiService.request({
                url: "http://localhost:3000/posts",
                method: "POST",
                body: newPost,
            });

            updatePosts((prevPosts) => [response, ...prevPosts]);
            setIsAdding(false);
            setNewPostTitle("");
            setNewPostBody("");
        } catch (err) {
            setError(err.message);
        }
    };

    const togglePostView = () => {
        setShowAllPosts((prev) => !prev);
    };

    return (
        <div className={styles.postsContainer}>
            <div className={styles.controlPanel}>
                <select
                    className={styles.selectCriteria}
                    value={criteria}
                    onChange={(e) => setCriteria(e.target.value)}
                >
                    <option value="">Select criteria</option>
                    <option value="id">ID</option>
                    <option value="title">Title</option>
                </select>
                <input
                    className={styles.searchInput}
                    type="text"
                    placeholder="Enter search query"
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                />
            </div>
            {error && <p className={styles.errorMessage}>{error}</p>}
            <h2 className={styles.postsHeader}>
                {showAllPosts ? "All Posts" : "My Posts"}
            </h2>
            <button onClick={togglePostView} className={styles.toggleViewButton}>
                {showAllPosts ? "View My Posts" : "View All Posts"}
            </button>
            {isAdding ? (
                <div className={styles.addPostContainer}>
                      <div className={styles.inputs}>
                    <input
                        className={styles.addPostInput}
                        type="text"
                        value={newPostTitle}
                        onChange={(e) => setNewPostTitle(e.target.value)}
                        placeholder="Enter post title"
                    />
                    <textarea
                        className={styles.addPostTextarea}
                        value={newPostBody}
                        onChange={(e) => setNewPostBody(e.target.value)}
                        placeholder="Enter post content"
                    ></textarea>
                    </div>
                    <div className={styles.buttons}>
                        <button className={styles.addButton} onClick={handleAddPost}>
                            Save
                        </button>
                        <button
                            className={styles.cancelButton}
                            onClick={() => setIsAdding(false)}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            ) : (
                <button
                    onClick={() => setIsAdding(true)}
                    className={styles.addButton}
                >
                    + Add Post
                </button>
            )}

            <div className={styles.postsList}>
                {filteredPosts.map((post, index) => (
                    <Post
                        key={post.id}
                        index={index}
                        post={post}
                        setError={setError}
                        updatePosts={updatePosts}
                    />
                ))}
            </div>
        </div>
    );
};

export default Posts;
