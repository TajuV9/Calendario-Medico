import { useContext, useState, useEffect } from 'react';
import { assets } from '../assets/assets';
import { Link, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

const ResetPassword = () => {
  const { t } = useTranslation();
  const { backendUrl, userData } = useContext(AppContext);
  const [email, setEmail] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (userData?.email) {
      setEmail(userData.email);
    }
  }, [userData]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !oldPassword || !newPassword) {
      return toast.error(t("fillAllFields"));
    }

    setLoading(true);
    try {
      const response = await axios.put(backendUrl + "/reset-password", {
        email,
        oldPassword,
        newPassword
      });

      if (response.status === 200) {
        toast.success(t("success"));
      }
    } catch (error) {
      const msg = error?.response?.data || t("error");
      toast.error(msg);
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
        <h2 className="text-center mb-4">{t("resetPassword")}</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              {t("email")}
            </label>
            <input
              type="email"
              id="email"
              className="form-control"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              readOnly
            />
          </div>

          <div className="mb-3">
            <label htmlFor="oldPassword" className="form-label">
              {t("password")}
            </label>
            <input
              type="password"
              id="oldPassword"
              className="form-control"
              required
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="newPassword" className="form-label">
              {t("newPassword")}
            </label>
            <input
              type="password"
              id="newPassword"
              className="form-control"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="btn btn-primary w-100" disabled={loading}>
            {loading ? t("updating") : t("resetPasswordButton")}
          </button>

          <div className="text-center mt-3">
            <Link to="/home">{t("cancel")}</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;