import React, { useState } from "react";
import styles from "./styles.module.css"; // Import stylów

const Users = ({ users }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 6;

    // Funkcja do zmiany aktualnej strony
    const paginate = pageNumber => setCurrentPage(pageNumber);

    // Oblicz indeks pierwszego i ostatniego użytkownika na aktualnej stronie
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;

    // Pobierz aktualną stronę użytkowników
    const currentUsers = users.data.slice(indexOfFirstUser, indexOfLastUser);

    return (
        <div>
            {/* Tło */}
            <div className={styles.background}></div>

            <div className={styles.users_container}>
                <h2 className={styles.users_title}>{users.message}</h2>
                <div className={styles.user_table}>
                    <div className={styles.table_header}>
                        <div className={styles.table_cell}>#</div>
                        <div className={styles.table_cell}>Email</div>
                        <div className={styles.table_cell}>Name</div>
                        <div className={styles.table_cell}>Surname</div>
                    </div>
                    {currentUsers && currentUsers.length > 0 ? (
                        currentUsers.map((user, index) => (
                            <div key={index} className={styles.table_row}>
                                <div className={styles.table_cell}>{indexOfFirstUser + index + 1}</div>
                                <div className={styles.table_cell}>{user.email}</div>
                                <div className={styles.table_cell}>{user.firstName}</div>
                                <div className={styles.table_cell}>{user.lastName}</div>
                            </div>
                        ))
                    ) : (
                        <div className={styles.table_row}>No users available</div>
                    )}
                </div>
                {/* Przyciski nawigacji */}
                <div className={styles.pagination}>
                    <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>Previous</button>
                    <button onClick={() => paginate(currentPage + 1)} disabled={indexOfLastUser >= users.data.length}>Next</button>
                </div>
            </div>
        </div>
    );
};

export default Users;
