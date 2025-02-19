import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './styles.module.css';

const EditCommentForm = ({ comment, commentId, comments, onCommentUpdated }) => {
    const [editedComment, setEditedComment] = useState({ favoriteAlbum: comment.favoriteAlbum, favoriteSong: comment.favoriteSong, userComment: comment.userComment });
    const [errors, setErrors] = useState({});
    const [error, setError] = useState("");

    useEffect(() => {
        setEditedComment({ favoriteAlbum: comment.favoriteAlbum, favoriteSong: comment.favoriteSong, userComment: comment.userComment });
    }, [comment]);

    const validate = () => {
        const errors = {};
        const songAlbumRegex = /^[A-Z][a-zA-Z1-9\s]+$/;

        if (!songAlbumRegex.test(editedComment.favoriteSong)) {
            errors.favoriteSong = "Favorite Song must start with an uppercase letter and can only contain letters, numbers, and spaces.";
        }
        if (!songAlbumRegex.test(editedComment.favoriteAlbum)) {
            errors.favoriteAlbum = "Favorite Album must be selected.";
        }
        if (editedComment.userComment.length < 10 || editedComment.userComment.length > 255) {
            errors.userComment = "User Comment must be between 10 and 255 characters long.";
        }
        return errors;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedComment({ ...editedComment, [name]: value });
        setErrors({ ...errors, [name]: "" });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            setError("");
            return;
        }

        const token = localStorage.getItem("token");
        if (token) {
            try {
                const url = `http://localhost:8080/api/comments/${commentId}`;
                const config = {
                    headers: { 'Content-Type': 'application/json', 'x-access-token': token }
                };
                const{data: res} = await axios.put(url, editedComment, config);
                alert(res.message);
                onCommentUpdated();
            } catch (error) {
                if (
                    error.response &&
                    error.response.status >= 400 &&
                    error.response.status <= 500
                ) {
                    setError(error.response.data.message)
                    setErrors({ ...errors, form: error.response.data.message });
                }
            }
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.tableContainer}>
                <div className={styles.title}>
                    <h3 className={styles.h3Class}>{comments.message}</h3>
                </div>
                <form onSubmit={handleSubmit} className={styles.form}>
                    <label htmlFor="favoriteAlbum">Favorite Album:</label>
                    <div className={styles.input_container}>
                        <select
                            name="favoriteAlbum"
                            id="favoriteAlbum"
                            title="Favorite Album must be selected."
                            value={editedComment.favoriteAlbum}
                            onChange={handleInputChange}
                            className={`${styles.input} ${errors.favoriteAlbum ? styles.error_input : ""}`}
                        >
                            <option value="" disabled hidden>--Select Album--</option>
                            <option value="Bleach">Bleach</option>
                            <option value="Nevermind">Nevermind</option>
                            <option value="Incesticide">Incesticide</option>
                            <option value="In Utero">In Utero</option>
                        </select>
                        {errors.favoriteAlbum && (
                            <div className={styles.error_tooltip}>
                                <span>!</span>
                            </div>
                        )}
                    </div>
                    {errors.favoriteAlbum && (
                        <div className={`${styles.error_msg} ${styles.error_input}`}>{errors.favoriteAlbum}</div>
                    )}

                    <label htmlFor="favoriteSong">Favorite Song:</label>
                    <div className={styles.input_container}>
                        <input
                            type="text"
                            name="favoriteSong"
                            id="favoriteSong"
                            title="Favorite Song must start with an uppercase letter and can only contain letters, numbers, and spaces."
                            value={editedComment.favoriteSong}
                            onChange={handleInputChange}
                            className={`${styles.input} ${errors.favoriteSong ? styles.error_input : ""}`}
                        />
                        {errors.favoriteSong && (
                            <div className={styles.error_tooltip}>
                                <span>!</span>
                            </div>
                        )}
                    </div>
                    {errors.favoriteSong && (
                            <div className={`${styles.error_msg} ${styles.error_input}`}>{errors.favoriteSong}</div>
                    )}

                    <label htmlFor="userComment">Your opinion:</label>
                    <div className={styles.input_container}>
                        <textarea
                            name="userComment"
                            id="userComment"
                            title="User Comment must be between 10 and 255 characters long."
                            cols="60"
                            rows="3"
                            value={editedComment.userComment}
                            onChange={handleInputChange}
                            className={`${styles.textarea} ${errors.userComment ? styles.error_input : ""}`}
                        ></textarea>
                        {errors.userComment && (
                            <div className={styles.error_tooltip}>
                                <span>!</span>
                            </div>
                        )}
                    </div>
                    {errors.userComment && (
                        <div className={`${styles.error_msg} ${styles.error_input}`}>{errors.userComment}</div>
                    )}
      
                    {error && <div className={styles.error_msg}>{error}</div>}
                    <button type="submit" className={styles.submitButton}>Update Opinion</button>
                </form>
            </div>
        </div>
    );
};

export default EditCommentForm;
