// Products/ProductsList.jsx
import React, { useState } from "react";
import styles from "./styles.module.css";
import axios from 'axios';
import Swal from 'sweetalert2';
import ProductPreview from './ProductPreview';

const ProductsList = ({ products, getProducts, onEditProduct }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [previewProduct, setPreviewProduct] = useState(null);
    const productsPerPage = 4;

    const paginate = pageNumber => setCurrentPage(pageNumber);

    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = products.data.slice(indexOfFirstProduct, indexOfLastProduct);

    const handleDeleteProduct = async (productId) => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'You will not be able to revert this!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete this product!',
            cancelButtonText: 'Cancel',
        }).then(async (result) => {
            if (result.isConfirmed) {
                const token = localStorage.getItem("token");
                if (token) {
                    try {
                        const config = {
                            method: 'delete',
                            url: `http://localhost:8080/api/products/${productId}`,
                            headers: { 'Content-Type': 'application/json', 'x-access-token': token }
                        };
                        const { data: res } = await axios(config);
                        alert(res.message);
                        getProducts();
                    } catch (error) {
                        console.error("Error deleting product:", error);
                    }
                }
            }
        });
    };

    const handlePreviewProduct = (product) => {
        setPreviewProduct(product);
    };

    const closePreview = () => {
        setPreviewProduct(null);
    };

    return (
        <div className={styles.container}>
            <div className={styles.tableContainer}>
                <div className={styles.title}>
                    <h3 className={styles.h3Class}>{products.message}</h3>
                </div>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Name</th>
                            <th>Description</th>
                            <th>Amount</th>
                            <th>Price (zł)</th>
                            <th>Category</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentProducts.length > 0 ? (
                            currentProducts.map((product, index) => (
                                <tr key={index}>
                                    <td>{indexOfFirstProduct + index + 1}</td>
                                    <td>{product.name}</td>
                                    <td>{product.description}</td>
                                    <td>{product.amount}</td>
                                    <td>{product.price.toFixed(2)}</td>
                                    <td>{product.category_id ? product.category_id.name : "No category"}</td>
                                    <td>
                                        <div className={styles.actionTable}>
                                            <button className={styles.previewButton} onClick={() => handlePreviewProduct(product)}>👁️</button>
                                            <button className={styles.editButton} onClick={() => onEditProduct(product._id)}>✏️</button>
                                            <button className={styles.deleteButton} onClick={() => handleDeleteProduct(product._id)}>🗑️</button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" className={styles.noData}>No products available</td>
                            </tr>
                        )}
                    </tbody>
                </table>
                <div className={styles.pagination}>
                    <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>Previous</button>
                    <button onClick={() => paginate(currentPage + 1)} disabled={indexOfLastProduct >= products.data.length}>Next</button>
                </div>
                {previewProduct && <ProductPreview product={previewProduct} onClose={closePreview} />}
            </div>
        </div>
    );
};

export default ProductsList;
