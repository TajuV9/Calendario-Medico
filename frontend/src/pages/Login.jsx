import { useContext, useState } from 'react';
import { assets } from '../assets/assets';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AppContext } from '../context/AppContext';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { backendUrl, getUserData } = useContext(AppContext);
  const navigate = useNavigate();

  const { t } = useTranslation();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    axios.defaults.withCredentials = true;
    setLoading(true);

    try {
      const response = await axios.post(`${backendUrl}/login`, { email, password });

      if (response.status === 200) {
        const { token, user } = response.data;

        localStorage.setItem('jwt', token);
        localStorage.setItem('userData', JSON.stringify(user));
        await getUserData();

        navigate("/home");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || t('login_failed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="position-relative min-vh-100 d-flex justify-content-center align-items-center"
      style={{ background: "linear-gradient(90deg, #6a5af9, #8268f9)" }}
    >
      <div
        style={{ position: "absolute", top: "20px", left: "30px", display: "flex", alignItems: "center" }}
      >
        <Link to="/" className="text-decoration-none d-flex align-items-center gap-2">
          <img src={assets.home_logo} alt="logo" width={32} height={32} />
          <span className="fw-bold fs-4 text-light">MiSALUD</span>
        </Link>
      </div>

      <div className="card p-4" style={{ maxWidth: "400px", width: "100%" }}>
        <h2 className="text-center mb-4">{t('login')}</h2>

        <form onSubmit={onSubmitHandler}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">{t('email')}</label>
            <input
              type="text"
              id="email"
              className="form-control"
              placeholder={t('enter_email')}
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label">{t('password')}</label>
            <input
              type="password"
              id="password"
              className="form-control"
              placeholder={t('enter_password')}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="btn btn-primary w-100" disabled={loading}>
            {loading ? t('loading') : t('login')}
          </button>

          <div className="text-center my-3">
            <p>
              {t('dont_have_account')}{' '}
              <Link to="/register" className="text-decoration-underline" style={{ cursor: "pointer" }}>
                {t('register_here')}
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;