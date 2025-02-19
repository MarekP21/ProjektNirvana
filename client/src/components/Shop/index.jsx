import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductList from './ProductList';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from './styles.module.css';
import Cart from './Cart';

const Shop = () => {
    const [products, setProducts] = useState({ data: [], message: "" });
    const [categories, setCategories] = useState([]);
    const [filterParams, setFilterParams] = useState({});
    const [appliedFilters, setAppliedFilters] = useState({});  // To store filters applied on button click
    const [showCart, setShowCart] = useState(false);
    const [showShop, setShowShop] = useState(true);

    // Handle changes in filter form inputs and update filterParams state
    const handleInputChange = (event) => {
        const { name, value, checked } = event.target;
        if (name === "filter[categories][]") {
            if (checked) {
                setFilterParams(prevState => ({
                    ...prevState,
                    [name]: Array.isArray(prevState[name]) ? [...prevState[name], value] : [value]
                }));
            } else {
                setFilterParams(prevState => ({
                    ...prevState,
                    [name]: (prevState[name] || []).filter(cat => cat !== value)
                }));
            }
        } else {
            setFilterParams(prevState => ({
                ...prevState,
                [name]: value
            }));
        }
    };

    // Pobieranie produktów
    const handleGetProducts = async (filters) => {
        try {
            const token = localStorage.getItem("token");
            const url = 'http://localhost:8080/api/products';
            const config = {
                method: 'get',
                url: url,
                headers: { 'Content-Type': 'application/json', 'x-access-token': token },
                params: filters
            };

            const { data: res } = await axios(config);
            setProducts({ data: res.data, message: res.message });
        } catch (error) {
            if (error.response && error.response.status >= 400 && error.response.status <= 500) {
                localStorage.removeItem("token");
                window.location.reload();
            }
        }
    };

    // Pobieranie kategorii
    const handleGetCategories = async () => {
        try {
            const token = localStorage.getItem("token");
            const url = 'http://localhost:8080/api/categories';
            const config = {
                method: 'get',
                url: url,
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
    };

    useEffect(() => {
        handleGetProducts(appliedFilters);  // Fetch products based on applied filters
        handleGetCategories();
    }, [appliedFilters]);

    // Handle filter button click
    const handleFilterButtonClick = () => {
        setAppliedFilters(filterParams);
    };

    const handleShowShop= () => {
        setShowShop(true);
        setShowCart(false);
    };

    const handleShowCart= () => {
        setShowShop(false);
        setShowCart(true);
        setFilterParams({});
        setAppliedFilters({});
    };

    return (
        <div className={styles.container}>
            {showShop && (
                <div className="row">
                    <div className="col-md-8 order-md-2 col-lg-9">
                        <h3 className="mt-0 mb-5 text-center">Products <span className="text-primary">{products.data.length}</span></h3>
                        <ProductList products={products} />
                    </div>
                    <form className={`col-md-4 order-md-1 col-lg-3 ${styles.sidebarFilter}`}>
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <button type="button" className="btn btn-lg btn-block btn-primary" style={{ textDecoration: 'none', marginTop: '20px' }} onClick={handleShowCart}>
                               <i>View Cart </i>🛒
                            </button>
                        </div>
                        <div className={`${styles.divider} mt-5 mb-5`}></div>
                        <h6 className="text-uppercase font-weight-bold mb-3 ">Categories</h6>
                        {categories.map(category => (
                            <div key={category._id} className="mt-2 mb-2 pl-2">
                                <div className="custom-control custom-checkbox">
                                    <input type="checkbox" className={`custom-control-input`} name="filter[categories][]" id={`category-${category._id}`} value={category._id} onChange={handleInputChange}/>
                                    <label className={`custom-control-label ${styles.padCat}`} htmlFor={`category-${category._id}`}>{category.name}</label>
                                </div>
                            </div>
                        ))}
                        <div className={`${styles.divider} mt-5 mb-5`}></div>
                        <h6 className="text-uppercase mt-5 mb-3 font-weight-bold">Price</h6>
                        <div className={styles.priceFilterControl}>
                            <div class={`${styles.priceVal}`}>
                                <label class={`${styles.labelPriceVal}`}>min: </label>
                                <input type="number" min="0" className="form-control w-50 pull-left mb-2" placeholder="50" name="filter[price_min]" id="price-min-control" onChange={handleInputChange}/>
                            </div>
                            <div class={`${styles.priceVal}`}>
                                <label class={`${styles.labelPriceVal}`}>max: </label>
                                <input type="number" min="0" className="form-control w-50 pull-right" placeholder="150" name="filter[price_max]" id="price-max-control" onChange={handleInputChange}/>
                            </div>
                        </div>
                        <input id="ex2" type="text" className="slider" value="50,150" data-slider-min="10" data-slider-max="200" data-slider-step="5" data-slider-value="[50,150]" data-value="50,150" style={{ display: 'none' }} />
                        <div className={`${styles.divider} mt-5 mb-5`}></div>
                        <button type="button" className="btn btn-lg btn-block btn-primary" id="filter-button" onClick={handleFilterButtonClick}>Filter</button>
                    </form>
                </div>
            )}
            {showCart && <Cart onShowShop={handleShowShop}/>}
        </div>
    );
};

export default Shop;
