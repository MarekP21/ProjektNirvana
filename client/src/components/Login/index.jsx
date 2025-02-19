import { useState } from "react"
import axios from "axios"
import { Link } from "react-router-dom"
import styles from "./styles.module.css"

const Login = () => {
    const [data, setData] = useState({ email: "", password: "" })
    const [error, setError] = useState("")
    const [errors, setErrors] = useState({});

    const validate = () => {
        const errors = {};
        const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;

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
        setData({ ...data, [input.name]: input.value })
        setErrors({ ...errors, [input.name]: "" });
    };

    const handleSubmit = async (e) => {
        e.preventDefault()
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            setError("")
            return;
        }

        try {
            const url = "http://localhost:8080/api/auth"
            const { data: res } = await axios.post(url, data)
            localStorage.setItem("token", res.data)
            window.location = "/"
        } catch (error) {
            if (
                error.response &&
                error.response.status >= 400 &&
                error.response.status <= 500
            ) {
                setError(error.response.data.message)
                setErrors({ ...errors, form: error.response.data.message });
            }
        }
    } 

    return (
        <div>
            <div className={styles.login_container}>
                <div className={styles.login_form_container}>
                    <div className={styles.left}>
                        <form className={styles.form_container} onSubmit={handleSubmit}>
                            <h1>Login to Your Account</h1>
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
                                Sing In
                            </button>
                        </form>
                    </div>
                    <div className={styles.right}>
                        <h1>New Here?</h1>
                        <Link to="/signup">
                            <button type="button" className={styles.white_btn}>
                                Sing Up
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login;
