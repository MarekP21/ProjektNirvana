import React from "react";
import styles from "./styles.module.css"; // Import stylów

const UserDetail = ({ user }) => {
    return (
        <div>
            {/* Tło */}
            <div className={styles.background}></div>
            <div className={styles.user_details_container}>
                <h2 className={styles.user_details_title}>{user.message}</h2>
                <ul className={styles.user_details_info}>
                    <li>
                        <span>First Name:</span> {user.data.firstName}
                    </li>
                    <li>
                        <span>Last Name:</span> {user.data.lastName}
                    </li>
                    <li>
                        <span>ID:</span> {user.data._id}
                    </li>
                    <li>
                        <span>Email:</span> {user.data.email}
                    </li>
                </ul>
                <h4>We are happy that you are with us!</h4>
            </div>
        </div>
    );
};

export default UserDetail;
