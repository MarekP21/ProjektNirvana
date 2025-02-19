// Products/index.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './styles.module.css';
import ProductsList from "./ProductsList";
import NewProductForm from "./NewProductForm";
import EditProductForm from "./EditProductForm";

const Product = () => {
    const [products, setProducts] = useState({ data: [], message: "" });
    const [showForm, setShowForm] = useState(false);
    const [editProductId, setEditProductId] = useState(null);
    const [categories, setCategories] = useState([]);

    // Pobieranie produktów
    const handleGetProducts = async () => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const config = {
                    method: 'get',
                    url: 'http://localhost:8080/api/products',
                    headers: { 'Content-Type': 'application/json', 'x-access-token': token }
                };
                const { data: res } = await axios(config);
                setProducts({ data: res.data, message: res.message });
            } catch (error) {
                if (error.response && error.response.status >= 400 && error.response.status <= 500) {
                    localStorage.removeItem("token");
                    window.location.reload();
                }
            }
        }
    };

    // Pobieranie kategorii
    const handleGetCategories = async () => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const config = {
                    method: 'get',
                    url: 'http://localhost:8080/api/categories',
                    headers: { 'Content-Type': 'application/json', 'x-access-token': token }
                };
                const { data: res } = await axios(config);
                setCategories(res.data);
            } catch (error) {
                if (error.response && error.response.status >= 400 && error.response.status <= 500) {
                    localStorage.removeItem("token");
                    window.location.reload();
                }
            }
        }
    };

    useEffect(() => {
        handleGetProducts();
        handleGetCategories();
    }, []);

    const handleToggleForm = () => {
        if (showForm || editProductId) {
            setShowForm(false);
            setEditProductId(null);
        } else {
            setShowForm(true);
        }
    };

    const handleEditProduct = (productId) => {
        setEditProductId(productId);
        setShowForm(false);
    };

    const handleProductAdded = () => {
        setEditProductId(null);
        setShowForm(false);
        handleGetProducts();
    };

    return (
        <div>
            {showForm && !editProductId && (
                <NewProductForm onProductAdded={handleProductAdded} categories={categories} />
            )}
            {!showForm && editProductId && (
                <EditProductForm
                    product={products.data.find(product => product._id === editProductId)}
                    productId={editProductId}
                    categories={categories}
                    onProductUpdated={handleProductAdded}
                />
            )}
            {!showForm && !editProductId && products.data.length > 0 && (
                <ProductsList products={products} onEditProduct={handleEditProduct} getProducts={handleGetProducts} />
            )}
            <div className={styles.buttonShareStyle}>
                <button onClick={handleToggleForm} className={styles.toggleButton}>
                    {showForm || editProductId ? "Back to Products ↩" : "Add Product ➕"}
                </button>
            </div>
        </div>
    );
};

export default Product;
