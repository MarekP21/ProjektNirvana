import React, { useState } from "react";
import styles from "./styles.module.css"; // Import stylów
import axios from 'axios';
import Swal from 'sweetalert2';

const CommentsList = ({ comments, userId, getComments, onEditComment }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const commentsPerPage = 5;

    // Funkcja do zmiany aktualnej strony
    const paginate = pageNumber => setCurrentPage(pageNumber);

    // Oblicz indeks pierwszego i ostatniego komentarza na aktualnej stronie
    const indexOfLastComment = currentPage * commentsPerPage;
    const indexOfFirstComment = indexOfLastComment - commentsPerPage;

    // Pobierz aktualną stronę komentarzy
    const currentComments = comments.data.slice(indexOfFirstComment, indexOfLastComment);

    // Obsługa usunięnia komentarza przez użytkownika który go napisał
    const handleDeleteComment = async (commentId) => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'You will not be able to revert this!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete my Comment!',
            cancelButtonText: 'Cancel',
        }).then(async (result) => {
            if (result.isConfirmed) {
                // kod usuwania komentarza
                const token = localStorage.getItem("token");
                if (token) {
                    try {
                        const config = {
                            method: 'delete',
                            url: `http://localhost:8080/api/comments/${commentId}`,
                            headers: { 'Content-Type': 'application/json', 'x-access-token': token }
                        };
        
                        const{data: res} = await axios(config);
                        alert(res.message);
                        getComments();
                    } catch (error) {
                        console.error("Error deleting user comment:", error);
                    }
                }
            }
        });
    };

    return (
        <div className={styles.container}>
            <div className={styles.tableContainer}>
                <div className={styles.title}>
                    <h3 className={styles.h3Class}>{comments.message}</h3>
                </div>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>User Name</th>
                            <th>Favorite Album</th>
                            <th>Favorite Song</th>
                            <th>Opinion</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentComments && currentComments.length > 0 ? (
                            currentComments.map((comment, index) => (
                                <tr key={index}>
                                    <td>{indexOfFirstComment + index + 1}</td>
                                    <td>
                                        {comment.userId ? `${comment.userId.firstName} ${comment.userId.lastName}` : 'Użytkownik Usunięty'}
                                    </td>
                                    <td>{comment.favoriteAlbum}</td>
                                    <td>{comment.favoriteSong}</td>
                                    <td>{comment.userComment}</td>
                                    <td>
                                        {comment.userId && comment.userId._id === userId && (
                                            <div className={styles.actionTable}>
                                                <button className={styles.editButton} onClick={() => onEditComment(comment._id)}>Edytuj</button>
                                                <button className={styles.deleteButton} onClick={() => handleDeleteComment(comment._id)}>Usuń</button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <div className={styles.table_row}>No comments available</div>
                        )}
                    </tbody>
                </table>
                {/* Przyciski nawigacji */}
                <div className={styles.pagination}>
                        <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>Previous</button>
                        <button onClick={() => paginate(currentPage + 1)} disabled={indexOfLastComment >= comments.data.length}>Next</button>
                </div>
            </div>
        </div>
    );
};

export default CommentsList;
