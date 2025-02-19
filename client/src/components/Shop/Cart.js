import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './styles.module.css';

const Cart = ({ onShowShop }) => {
    const [cart, setCart] = useState({ items: [], total: 0 });

    useEffect(() => {
        fetchCart();
    }, []);

    const fetchCart = async () => {
        const token = localStorage.getItem("token");
        const url = 'http://localhost:8080/api/carts';
        try {
            const { data } = await axios.get(url, {
                headers: { 'x-access-token': token }
            });
            setCart({ items: data.items, total: data.total });
        } catch (error) {
            console.error("There was an error fetching the cart!", error);
        }
    };

    const handleRemoveFromCart = async (productId) => {
        const token = localStorage.getItem("token");
        const url = `http://localhost:8080/api/carts/${productId}`;
        try {
            const{data: res} = await axios.delete(url, {
                headers: { 'x-access-token': token }
            });
            alert(res.message);
            fetchCart(); // Refresh the cart
        } catch (error) {
            console.error("There was an error removing the product from the cart!", error);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.headCart}>
                <button type="button" className="btn btn-lg btn-block btn-primary" style={{ textDecoration: 'none', marginTop: '20px' }} onClick={onShowShop}>
                    <i>Back to Products</i> ↩
                </button>    
                <h3 className={styles.komorka4}>Shopping Cart</h3>
            </div>
            <div className="cart-section">
                <div className="cart-items">
                    <ul className="cart-list">
                        {cart.items.map(item => (
                            <li key={item.productId} className="cart-item clearfix">
                                <div className="cart-item-info d-flex flex-md-row flex-column justify-content-between">
                                <div className={styles.komorka3}><img className={styles.imagine} src={`http://localhost:8080/${item.imagePath}`} alt="Product" /></div>
                                    <div className={styles.komorka}>
                                        <h6>Name</h6>
                                        <div className="cart-item-text">{item.name}</div>
                                    </div>
                                    <div className={styles.komorka}>
                                        <h6>Quantity</h6>
                                        <div className="cart-item-text">{item.quantity}</div>
                                    </div>
                                    <div className={styles.komorka}>
                                        <h6>Price</h6>
                                        <div className="cart-item-text">{item.price}</div>
                                    </div>
                                    <div className={styles.komorka}>
                                        <h6>Total</h6>
                                        <div className="cart-item-text">{item.price * item.quantity}</div>
                                    </div>
                                    <div className={styles.komorka2}>
                                        <button
                                            className="btn btn-danger btn-sm"
                                            onClick={() => handleRemoveFromCart(item.productId)}
                                        >
                                            Remove
                                        </button>
                                    </div>
                                    <div className={`${styles.divider} mt-5 mb-5`}></div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className={styles.orderTotal}>
                    <div className={styles.orderTotalTitle}>Order Total:</div>
                    <div className={styles.orderTotalAmount}>{cart.total.toFixed(2)}</div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
