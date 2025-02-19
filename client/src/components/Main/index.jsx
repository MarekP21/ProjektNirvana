import React, { useState } from "react";
// Komponenty są modularne i 
// używają Axios do komunikacji z serwerem.
import axios from "axios";
import Swal from 'sweetalert2';
import styles from "./styles.module.css";
import Users from "./Users"; // Import komponentu Users
import UserDetail from "./UserDetail"; // Import komponentu Users
import Home from "./Home";
import Comments from "../Comments";
import Products from "../Products";
import Shop from "../Shop";

const Main = () => {
    // Dodatkowa zmienna stanu dla listy użytkowników
    const [dane, ustawDane] = useState({ data: [], message: "" });
    // Stan do przechowywania szczegółów użytkownika 
    const [userDetails, setuserDetails] = useState(null); 
    // Stan do zarządzania menu Hamburger
    const [menuOpen, setMenuOpen] = useState(false);
    // Stan do przechowywania infomacji o stronie głównej
    const [isHome, setIsHome] = useState(true);
    // Stan do przechowywania infomacji o komentarzach
    const [isComments, setIsComments] = useState(false);
    // Stan do przechowywania infomacji o producktach
    const [isProducts, setIsProducts] = useState(false);
    // Stan do przechowywania infomacji o sklepie
    const [isShop, setIsShop] = useState(false);
    
    // Obsługa wylogowania
    const handleLogout = () => {
        Swal.fire({
            title: 'Are you sure you want to logout?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, logout'
        }).then((result) => {
            if (result.isConfirmed) {
                localStorage.removeItem("token");
                window.location.reload();
            }
        });
        setMenuOpen(false); // Zamknij menu po akcji
    }

    // Obsługa pobrania użytkowników
    const handleGetUsers = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token"); // pobierz token z localStorage
        if (token) {
            try {
                // konfiguracja zapytania asynchronicznego z tokenem w nagłówku:
                const config = {
                    method: 'get',
                    url: 'http://localhost:8080/api/users',
                    headers: { 'Content-Type': 'application/json', 'x-access-token': token }
                };

                // wysłanie żądania o dane:
                const { data: res } = await axios(config);

                // `res.data` - zawiera sparsowane dane – listę:
                ustawDane({ data: res.data, message: res.message }); // Ustawienie danych użytkowników
                setuserDetails(null);
            } catch (error) {
                if (error.response && error.response.status >= 400 && error.response.status <= 500) {
                    localStorage.removeItem("token");
                    window.location.reload();
                }
            }
        } else {
            localStorage.removeItem("token");
            window.location.reload();
        }
        setMenuOpen(false); // Zamknij menu po akcji
        setIsHome(false); // Nie pokazuj home
        setIsComments(false);
        setIsProducts(false);
        setIsShop(false);
    };

    // Obsługa pobrania szczegółów użytkownika obecnie zalogowanego
    const handleGetUserDetails = async () => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const config = {
                    method: 'get',
                    url: 'http://localhost:8080/api/auth/user',
                    headers: { 'Content-Type': 'application/json', 'x-access-token': token }
                };
    
                const { data: res } = await axios(config);
                 // Ustaw szczegóły użytkownika po pobraniu
                 setuserDetails({ data: res.data, message: res.message });
                 ustawDane({ data: [], message: "" });
            } catch (error) {
                if (error.response && error.response.status >= 400 && error.response.status <= 500) {
                    localStorage.removeItem("token");
                    window.location.reload();
                }
            }
        } else {
            localStorage.removeItem("token");
            window.location.reload();
        }
        setMenuOpen(false); // Zamknij menu po akcji
        setIsHome(false); // Nie pokazuj home
        setIsComments(false);
        setIsProducts(false);
        setIsShop(false);
    };

    // Obsługa usunięnia konta przez użytkownika
    const handleDeleteAccount = async () => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'You will not be able to revert this!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete my account!',
            cancelButtonText: 'Cancel',
        }).then(async (result) => {
            if (result.isConfirmed) {
                // kod usuwania konta
                const token = localStorage.getItem("token");
                if (token) {
                    try {
                        const config = {
                            method: 'delete',
                            url: 'http://localhost:8080/api/auth/user',
                            headers: { 'Content-Type': 'application/json', 'x-access-token': token }
                        };
        
                        const { data: res } = await axios(config);
                        alert(res.message); // Alert z potwierdzeniem usunięcia konta

                        localStorage.removeItem("token")
                        window.location.reload()
                    } catch (error) {
                        console.error("Error deleting user account:", error);
                    }
                }
            }
        });
        setMenuOpen(false); // Zamknij menu po akcji
    };

    const handleHome = async () => {
        const token = localStorage.getItem("token");
        if(token){
            setIsHome(true);
            ustawDane({ data: [], message: "" });
            setuserDetails(null);
            setMenuOpen(false); // Zamknij menu po akcji
            setIsComments(false);
            setIsProducts(false);
            setIsShop(false);
        } else {
            localStorage.removeItem("token");
            window.location.reload();
        }
    };

    const handleShowComments = () => {
        // Obsługa przycisku "Comments"
        setIsComments(true);
        setMenuOpen(false);
        setIsHome(false); // Wyłącz wyświetlanie strony głównej
        ustawDane({ data: [], message: "" }); // Wyczyść dane użytkowników
        setuserDetails(null); // Wyczyść szczegóły użytkownika
        setIsProducts(false);
        setIsShop(false);
        
    };

    const handleShowProducts= () => {
        // Obsługa przycisku "Products"
        setIsProducts(true);
        setIsComments(false);
        setMenuOpen(false);
        setIsHome(false); // Wyłącz wyświetlanie strony głównej
        ustawDane({ data: [], message: "" }); // Wyczyść dane użytkowników
        setuserDetails(null); // Wyczyść szczegóły użytkownika
        setIsShop(false);
    };

    const handleShowShop = () => {
        // Obsługa przycisku "Shop"
        setIsShop(true);
        setIsProducts(false);
        setIsComments(false);
        setMenuOpen(false);
        setIsHome(false); // Wyłącz wyświetlanie strony głównej
        ustawDane({ data: [], message: "" }); // Wyczyść dane użytkowników
        setuserDetails(null); // Wyczyść szczegóły użytkownika
    };

    return (
        <div className={styles.main_container}>
            <nav className={styles.navbar}>
                <button button className={styles.menu_h1} onClick={handleHome}>Nirvana FanClub</button> 
                <div className={styles.second_menu}>
                    <button className={styles.menu_h2} onClick={handleShowShop}>Shop</button> 
                    <button className={styles.menu_h2} onClick={handleShowProducts}>Products</button> 
                    <button className={styles.menu_h2} onClick={handleShowComments}>Comments</button> 
                    <div className={styles.hamburger} onClick={() => setMenuOpen(!menuOpen)}>
                        ☰
                    </div>
                    {menuOpen && (
                        <div className={styles.menu}>
                            <button className={styles.menu_btn} onClick={handleGetUserDetails}>User Details</button>       
                            <button className={styles.menu_btn} onClick={handleGetUsers}>Users</button>
                            <button className={styles.menu_btn} onClick={handleLogout}>Logout</button>
                            <button className={styles.menu_btn} onClick={handleDeleteAccount}>Delete Account</button>
                        </div>
                    )}
                </div>
            </nav>
            
            {/* Warunkowe wyświetlanie strony głównej*/}
            {isHome && <Home user={userDetails}/>}

            {/* Warunkowe wyświetlanie elementów związanych z komentarzami*/}
            {isComments && <Comments />}

            {/* Warunkowe wyświetlanie elementów związanych z listą produktów*/}
            {isProducts && <Products />}

            {/* Warunkowe wyświetlanie elementów związanych z listą produktów*/}
            {isShop && <Shop />}

            {/* Warunkowe wyświetlanie listy użytkowników */}
            {dane.data.length > 0 ? (
                <>
                    <Users users={dane} />
                </>
            ) : null}
            {/* Warunkowe wyświetlanie szczegółów użytkownika */}
            {userDetails !== null ? (
                <>
                    <UserDetail user={userDetails} />
                </>
            ): null}
        </div>
    )
}
        
export default Main