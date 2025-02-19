import React, { useState, useEffect } from "react";
import axios from 'axios';
import styles from "./styles.module.css";

const EditProductForm = ({ product, productId, categories, onProductUpdated }) => {
    const [productData, setProductData] = useState({
        name: product.name,
        description: product.description,
        amount: product.amount,
        price: product.price,
        category_id: product.category_id
    });
    const [imageFile, setImageFile] = useState(null);
    const [imageUrl, setImageUrl] = useState(product.image || "");
    const [errors, setErrors] = useState({});
    const [error, setError] = useState("");

    useEffect(() => {
        setProductData({
            name: product.name,
            description: product.description,
            amount: product.amount,
            price: product.price,
            category_id: product.category_id
        });
        setImageUrl(product.image ? `http://localhost:8080/${product.image}` : "");
    }, [product]);

    const validate = () => {
        const errors = {};
        const nameRegex = /^[A-Z][a-zA-Z0-9\s]*$/;

        if (!productData.name || productData.name.length > 50 || !nameRegex.test(productData.name)) {
            errors.name = "Name is required, must be less than 50 characters, and start with an uppercase letter. Only letters and numbers are allowed.";
        }
        if (!productData.description || productData.description.length > 500) {
            errors.description = "Description is required, must be less than 500 characters.";
        }
        if (productData.amount < 1) {
            errors.amount = "Amount must be integer 1 or greater.";
        }
        if (productData.price <= 0 || productData.price > 99999999.99) {
            errors.price = "Price must be between 0.01 and 99999999.99.";
        }
        if (!productData.category_id) {
            errors.category_id = "Category must be selected.";
        }
        return errors;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProductData({ ...productData, [name]: value });
        setErrors({ ...errors, [name]: "" });
        setError("");
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setImageFile(file);
        // Jeśli plik nie jest pusty, utwórz obiekt URL
        if (file) {
            setImageUrl(URL.createObjectURL(file));
        } else {
            // Jeśli plik jest pusty, ustaw obrazek placeholder
            setImageUrl(productData.image);
        }
        setErrors({ ...errors, imageFile: "" });
        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(imageFile); // Dodaj ten console.log
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            setError("");
            return;
        }

        const formData = new FormData();
        formData.append("name", productData.name);
        formData.append("description", productData.description);
        formData.append("amount", productData.amount);
        formData.append("price", productData.price);
        // Sprawdzenie i ustawienie category_id jako string
        if (typeof productData.category_id === 'object' && productData.category_id._id) {
            formData.append("category_id", productData.category_id._id);
        } else {
            formData.append("category_id", productData.category_id);
        }

        if (imageFile) {
            formData.append("image", imageFile);
        }
        
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const url = `http://localhost:8080/api/products/${productId}`;
                const config = {
                    headers: { 'Content-Type' : 'multipart/form-data', 'x-access-token': token }
                };
                setError("");
                const{data: res} = await axios.put(url, formData, config);
                alert(res.message);
                onProductUpdated();
            } catch (error) {
                if (
                    error.response &&
                    error.response.status >= 400 &&
                    error.response.status <= 500
                ) {
                    setError(error.response.data.message);
                    setErrors({ ...errors, form: error.response.data.message });
                }
            }
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.tableContainer}>
                <div className={styles.title}>
                    <h3 className={styles.h3Class}>Editing product ✏️</h3>
                </div>
                <form onSubmit={handleSubmit} className={styles.form} enctype="multipart/form-data">
                    <label htmlFor="name">Name:</label>
                    <div className={styles.input_container}>
                        <input
                            type="text"
                            name="name"
                            id="name"
                            placeholder="Name"
                            value={productData.name}
                            onChange={handleChange}
                            className={`${styles.input} ${errors.name ? styles.error_input : ""}`}
                            title="Name is required, must be less than 50 characters, and start with an uppercase letter. Only letters and numbers are allowed."
                        />
                        {errors.name && (
                            <div className={styles.error_tooltip}>
                                <span>!</span>
                            </div>
                        )}
                    </div>
                    {errors.name && (
                        <div className={`${styles.error_msg} ${styles.error_input}`}>{errors.name}</div>
                    )}

                    <label htmlFor="description">Description:</label>
                    <div className={styles.input_container}>
                        <textarea
                            name="description"
                            id="description"
                            placeholder="Description"
                            value={productData.description}
                            onChange={handleChange}
                            className={`${styles.textarea} ${errors.description ? styles.error_input : ""}`}
                            title = "Description is required, must be less than 500 characters."
                        ></textarea>
                        {errors.description && (
                            <div className={styles.error_tooltip}>
                                <span>!</span>
                            </div>
                        )}
                    </div>
                    {errors.description && (
                        <div className={`${styles.error_msg} ${styles.error_input}`}>{errors.description}</div>
                    )}

                    <label htmlFor="amount">Amount:</label>
                    <div className={styles.input_container}>
                        <input
                            type="number"
                            name="amount"
                            id="amount"
                            placeholder="Amount"
                            step="1"
                            value={productData.amount}
                            onChange={handleChange}
                            className={`${styles.input} ${errors.amount ? styles.error_input : ""}`}
                            title="Amount must be 1 or greater."
                        />
                        {errors.amount && (
                            <div className={styles.error_tooltip}>
                                <span>!</span>
                            </div>
                        )}
                    </div>
                    {errors.amount && (
                        <div className={`${styles.error_msg} ${styles.error_input}`}>{errors.amount}</div>
                    )}

                    <label htmlFor="price">Price:</label>
                    <div className={styles.input_container}>
                        <input
                            type="number"
                            name="price"
                            id="price"
                            placeholder="Price"
                            step="0.01"
                            value={productData.price}
                            onChange={handleChange}
                            className={`${styles.input} ${errors.price ? styles.error_input : ""}`}
                            title="Price must be between 0.01 and 99999999.99."
                        />
                        {errors.price && (
                            <div className={styles.error_tooltip}>
                                <span>!</span>
                            </div>
                        )}
                    </div>
                    {errors.price && (
                        <div className={`${styles.error_msg} ${styles.error_input}`}>{errors.price}</div>
                    )}

                    <label htmlFor="image">Image:</label>
                    <div className={styles.input_container}>
                        <input
                            type="file"
                            name="image"
                            id="image"
                            onChange={handleFileChange}
                            className={`${styles.input} ${errors.imageFile ? styles.error_input : ""}`}
                        />
                        {errors.imageFile && (
                            <div className={styles.error_tooltip}>
                                <span>!</span>
                            </div>
                        )}
                    </div>
                    {errors.imageFile && (
                        <div className={`${styles.error_msg} ${styles.error_input}`}>{errors.imageFile}</div>
                    )}
                    {imageUrl && (
                        <div className={styles.image_preview}>
                            <img src={imageUrl} alt="Product" className={styles.image} />
                        </div>
                    )}

                    <label htmlFor="category_id">Category:</label>
                    <div className={styles.input_container}>
                        <select
                            name="category_id"
                            id="category_id"
                            value={productData.category_id ? productData.category_id._id : ""}
                            onChange={handleChange}
                            className={`${styles.input} ${errors.category_id ? styles.error_input : ""}`}
                            title="Category must be selected."
                        >
                            <option value="" disabled hidden>--Select Category--</option>
                            {categories.map(category => (
                                <option key={category._id} value={category._id}>{category.name}</option>
                            ))}
                        </select>
                        {errors.category_id && (
                            <div className={styles.error_tooltip}>
                                <span>!</span>
                            </div>
                        )}
                    </div>
                    {errors.category_id && (
                        <div className={`${styles.error_msg} ${styles.error_input}`}>{errors.category_id}</div>
                    )}

                    {error && <div className={styles.error_msg}>{error}</div>}
                    <button type="submit" className={styles.submitButton}>Update Product</button>
                </form>
            </div>
        </div>
    );
};

export default EditProductForm;
