import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import styles from "./styles.module.css";

const Signup = () => {
    const [data, setData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
    });
    const [error, setError] = useState("")
    const [errors, setErrors] = useState({});

    const validate = () => {
        const errors = {};
        const nameRegex = /^[A-ZŻŹĆĄŚĘŁÓŃ][a-zżźćńółęąś]*$/;
        const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;

        if (!nameRegex.test(data.firstName)) {
            errors.firstName = "First Name is invalid.";
        }
        if (!nameRegex.test(data.lastName)) {
            errors.lastName = "Last Name is invalid.";
        }
        if (!data.email) {
            errors.email = "Email is required.";
        } else if (!/\S+@\S+\.\S+/.test(data.email)) {
            errors.email = "Email is invalid.";
        }
        if (!data.password) {
            errors.password = "Password is required.";
        } else if (!passwordRegex.test(data.password)) {
            errors.password = "Password is invalid";
        }
        setError("")
        return errors;
    };

    const handleChange = ({ currentTarget: input }) => {
        setData({ ...data, [input.name]: input.value });
        setErrors({ ...errors, [input.name]: "" });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            setError("")
            return;
        }

        try {
            const url = "http://localhost:8080/api/users";
            const { data: res } = await axios.post(url, data);
            localStorage.setItem("token", res.data);
            window.location = "/";
            console.log(res.message);
        } catch (error) {
            if (error.response && error.response.status >= 400 && error.response.status <= 500) {
                setError(error.response.data.message)
                setErrors({ ...errors, form: error.response.data.message });
            }
        }
    };

    return (
        <div className={styles.signup_container}>
            <div className={styles.signup_form_container}>
                <div className={styles.left}>
                    <h1>Welcome Back</h1>
                    <Link to="/login">
                        <button type="button" className={styles.white_btn}>
                            Sign in
                        </button>
                    </Link>
                </div>
                <div className={styles.right}>
                    <form className={styles.form_container} onSubmit={handleSubmit}>
                        <h1>Create Account</h1>
                        <div className={styles.input_container}>
                            <input
                                type="text"
                                placeholder="First Name"
                                name="firstName"
                                onChange={handleChange}
                                value={data.firstName}
                                className={`${styles.input} ${errors.firstName ? styles.error_input : ""}`}
                                title="First Name must start with an uppercase letter followed by lowercase letters and cannot contain numbers."
                            />
                            {errors.firstName && (
                                <div className={styles.error_tooltip}>
                                    <span>!</span>
                                </div>
                            )}
                        </div>
                        {errors.firstName&& <div className={styles.error_msg}>{errors.firstName}</div>}
                        <div className={styles.input_container}>
                            <input
                                type="text"
                                placeholder="Last Name"
                                name="lastName"
                                onChange={handleChange}
                                value={data.lastName}
                                className={`${styles.input} ${errors.lastName ? styles.error_input : ""}`}
                                title="Last Name must start with an uppercase letter followed by lowercase letters and cannot contain numbers."
                            />
                            {errors.lastName && (
                                <div className={styles.error_tooltip}>
                                    <span>!</span>
                                </div>
                            )}
                        </div>
                        {errors.lastName && <div className={styles.error_msg}>{errors.lastName}</div>}
                        <div className={styles.input_container}>
                            <input
                                type="text"
                                placeholder="Email"
                                name="email"
                                onChange={handleChange}
                                value={data.email}
                                className={`${styles.input} ${errors.email ? styles.error_input : ""}`}
                                title={errors.email || "Enter your email"}
                            />
                            {errors.email && (
                                <div className={styles.error_tooltip}>
                                    <span>!</span>
                                </div>
                            )}
                        </div>
                        {errors.email && <div className={styles.error_msg}>{errors.email}</div>}
                        <div className={styles.input_container}>
                            <input
                                type="password"
                                placeholder="Password"
                                name="password"
                                onChange={handleChange}
                                value={data.password}
                                className={`${styles.input} ${errors.password ? styles.error_input : ""}`}
                                title="Password must contain at least 8 characters, including at least uppercase letter, lowercase letter, number and symbol."
                            />
                            {errors.password && (
                                <div className={styles.error_tooltip}>
                                    <span>!</span>
                                </div>
                            )}
                        </div>
                        {errors.password && <div className={styles.error_msg}>{errors.password}</div>}
                        {error && <div className={styles.error_msg}>{error}</div>}
                        <button type="submit" className={styles.green_btn}>
                            Sign Up
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Signup;
