// Plik App.js jest głównym plikiem komponentu React, 
// który zarządza trasami aplikacji:
import { Route, Routes, Navigate } from "react-router-dom"
import Main from "./components/Main"
import Signup from "./components/Signup"
import Login from "./components/Login"

function App() {
  // Sprawdza obecność tokenu w localStorage dla uwierzytelnienia użytkownika.
  // Jeśli token istnieje, użytkownik jest przekierowywany do Main.
  // Jeśli token nie istnieje, domyślnie przekierowuje do strony logowania (Login).
  const user = localStorage.getItem("token");
  return (
    <Routes>
      {user ? (
        <>
          <Route path="/" element={<Main />} />
          {/* Przekieruj użytkownika do głównego widoku, jeśli próbuje uzyskać dostęp do "/signup" lub "/login" */}
          <Route path="/signup" element={<Navigate replace to="/" />} />
          <Route path="/login" element={<Navigate replace to="/" />} />
        </>
      ) : (
        <>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          {/* Przekieruj użytkownika do strony logowania, jeśli próbuje uzyskać dostęp do innych tras */}
          <Route path="/" element={<Navigate replace to="/login" />} />
        </>
      )}
      {!user && <Route path="/" element={<Navigate replace to="/login" />}/>}
    </Routes>
  )
}


export default App
