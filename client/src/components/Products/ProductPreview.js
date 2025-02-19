import React from "react";
import styles from "./styles.module.css";

const ProductPreview = ({ product, onClose }) => {
    return (
        <div className={styles.previewContainer}>
            <div className={styles.card}>
                <div className={styles.cardHeader}>
                    Product Preview 👁️
                    <button onClick={onClose} className={styles.closeButton}>✖️</button>
                </div>
                <div className={styles.cardBody}>
                    <div className={styles.row}>
                        <label>Name:</label>
                        <input type="text" value={product.name} disabled className={styles.input} />
                    </div>
                    <div className={styles.row}>
                        <label>Description:</label>
                        <input value={product.description} disabled className={styles.textarea}></input>
                    </div>
                    <div className={styles.row}>
                        <label>Amount:</label>
                        <input type="number" value={product.amount} disabled className={styles.input} />
                    </div>
                    <div className={styles.row}>
                        <label>Price:</label>
                        <input type="number" value={product.price} disabled className={styles.input} />
                    </div>
                    <div className={styles.row}>
                        <label>Category:</label>
                        <input type="text" value={product.category_id.name} disabled className={styles.input} />
                    </div>
                    <div className={styles.row}>
                        <div className={styles.image_preview}>
                            <img src={`http://localhost:8080/${product.image}`} alt="Product" className={styles.image} />
                        </div>  
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductPreview;
