import React from 'react';
import styles from './styles.module.css';
import axios from 'axios';

const ProductList = ({ products }) => {
    const handleAddToCart = async (productId) => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const url = `http://localhost:8080/api/carts/${productId}`;
                console.log(url);
                const config = {
                    headers: {'x-access-token': token }
                };
                const{data: res} = await axios.post(url, {}, config);
                alert(res.message);
            } catch (error) {
                if (
                    error.response &&
                    error.response.status >= 400 &&
                    error.response.status <= 500
                ) {
                    console.error("There was an error adding the product to the cart!", error);
                }
            }
        }
    };

    return (
        <div className="row">
            {products.data.map(product => (
                <div key={product._id} className="col-md-4 mb-4">
                    <div className={`card h-100 border-0 ${styles.card}`}>
                        <div className="card-img-top">
                            {product.image ? (
                                <img src={`http://localhost:8080/${product.image}`} className={`${styles.imgFluid}  mx-auto d-block ${styles.cardImgTop}`} alt="" />
                            ) : (
                                <img src="https://via.placeholder.com/200x200/5fa9f8/efefef" className={`${styles.imgFluid} mx-auto d-block ${styles.cardImgTop}`} alt="" />
                            )}
                        </div>
                        <div className="card-body text-center">
                            <h4 className={`card-price small ${styles.cardPrice}`}>
                                {product.name}
                            </h4>
                            <h5 className={`card-price small ${styles.cardPrice}`}>
                                <i>PLN {product.price}</i>
                            </h5>
                        </div>
                        <button className={`btn btn-success btn-sm ${styles.addCartButton}`} data-id={product._id} onClick={() => handleAddToCart(product._id)}><i className="fas fa-cart-plus"></i> 🛒 Add Product </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ProductList;
