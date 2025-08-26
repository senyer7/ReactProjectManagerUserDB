import { useState, useRef } from "react";
import { supabase } from "../supabase.js";

export default function Login({ onLoginSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const emailRef = useRef();
  const passwordRef = useRef();
  const nameRef = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const email = emailRef.current.value;
    const password = passwordRef.current.value;

    try {
      if (isLogin) {
        // Логин
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      } else {
        // Регистрация
        const name = nameRef.current.value;
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              name: name,
            },
          },
        });
        if (error) throw error;

        // Сохраняем пользователя в таблицу Users
        if (data.user) {
          const { error: dbError } = await supabase
            .from("Users")
            .insert([{ id: data.user.id, name: name, password: "" }]);

          if (dbError)
            console.error("Ошибка сохранения пользователя:", dbError);
        }
      }

      onLoginSuccess();
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">{isLogin ? "Вход" : "Регистрация"}</h2>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          {!isLogin && (
            <div className="input-container">
              <label className="input-label">Имя</label>
              <input
                ref={nameRef}
                type="text"
                className="input-field"
                required
                placeholder="Введите ваше имя"
              />
            </div>
          )}

          <div className="input-container">
            <label className="input-label">Email</label>
            <input
              ref={emailRef}
              type="email"
              className="input-field"
              required
              placeholder="Введите email"
            />
          </div>

          <div className="input-container">
            <label className="input-label">Пароль</label>
            <input
              ref={passwordRef}
              type="password"
              className="input-field"
              required
              placeholder="Введите пароль"
              minLength={6}
            />
          </div>

          <button
            type="submit"
            className="btn-primary auth-btn"
            disabled={loading}
          >
            {loading ? "Загрузка..." : isLogin ? "Войти" : "Зарегистрироваться"}
          </button>
        </form>

        <p className="auth-switch">
          {isLogin ? "Нет аккаунта?" : "Уже есть аккаунт?"}{" "}
          <button
            type="button"
            className="auth-switch-btn"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? "Зарегистрироваться" : "Войти"}
          </button>
        </p>
      </div>
    </div>
  );
}
