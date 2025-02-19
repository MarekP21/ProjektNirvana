// Comments/index.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './styles.module.css';
import CommentsList from "./CommentsList";
import NewCommentForm from "./NewCommentForm";
import EditCommentForm from "./EditCommentForm";

const Comment = () => {
    const [comments, setComments] = useState({ data: [], message: "" });
    const [showForm, setShowForm] = useState(false);
    const [editCommentId, setEditCommentId] = useState(null);
    // Stan do przechowywania szczegółów użytkownika 
    const [userDetails, setuserDetails] = useState(null); 

    // Obsługa pobrania komentarzy
    const handleGetComments = async () => {
        const token = localStorage.getItem("token"); // pobierz token z localStorage
        if (token) {
            try {
                // konfiguracja zapytania asynchronicznego z tokenem w nagłówku:
                const config = {
                    method: 'get',
                    url: 'http://localhost:8080/api/comments',
                    headers: { 'Content-Type': 'application/json', 'x-access-token': token }
                };

                // wysłanie żądania o dane:
                const { data: res } = await axios(config);

                // `res.data` - zawiera sparsowane dane – listę:
                setComments({ data: res.data, message: res.message }); // Ustawienie danych komentarzy
            } catch (error) {
                if (error.response && error.response.status >= 400 && error.response.status <= 500) {
                    localStorage.removeItem("token");
                    window.location.reload();
                }
            }
        }
    };

    // Obsługa pobrania szczegółów użytkownika obecnie zalogowanego
    const handleGetUserDetails = async () => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const config = {
                    method: 'get',
                    url: 'http://localhost:8080/api/auth/user',
                    headers: { 'Content-Type': 'application/json', 'x-access-token': token }
                };
    
                const { data: res } = await axios(config);
                 // Ustaw szczegóły użytkownika po pobraniu
                 setuserDetails({ data: res.data, message: res.message });
            } catch (error) {
                if (error.response && error.response.status >= 400 && error.response.status <= 500) {
                    localStorage.removeItem("token");
                    window.location.reload();
                }
            }
        }
    };

    useEffect(() => {
        handleGetComments();
        handleGetUserDetails();
    }, []);

    const handleToggleForm = () => {
        if (showForm || editCommentId) {
            setShowForm(false);
            setEditCommentId(null);
        } else {
            setShowForm(true);
        }
    };

    const handleEditComment = (commentId) => {
        setEditCommentId(commentId);
        setShowForm(false); // Hide the new comment form when editing
    };

    const handleCommentAdded = () => {
        setEditCommentId(null);
        setShowForm(false);
        handleGetComments();
    };

    return (
        <div>
            {showForm && !editCommentId && (
                <NewCommentForm onCommentAdded={handleCommentAdded} comments={comments} />
            )}
            {!showForm && editCommentId && (
                <EditCommentForm
                    comment={comments.data.find(comment => comment._id === editCommentId)}
                    commentId={editCommentId}
                    comments={comments}
                    onCommentUpdated={handleCommentAdded}
                />
            )}
            {!showForm && !editCommentId && comments.data.length > 0 && (
                <CommentsList comments={comments} userId={userDetails?.data?._id} getComments={handleGetComments} onEditComment={handleEditComment} />
            )}
            <div className={styles.buttonShareStyle}>
                <h1>♬</h1>
                <button onClick={handleToggleForm} className={styles.toggleButton}>
                    {showForm || editCommentId ? "Back to Comments ↩" : "Share Your Opinion!"}
                </button>
                <h1>♬</h1>
            </div>
        </div>
    );
};

export default Comment;
