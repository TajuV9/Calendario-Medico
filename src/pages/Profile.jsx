import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import { assets } from '../assets/assets';
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

const Profile = () => {
  const { t } = useTranslation();
  const { backendUrl, isLoggedIn, setIsLoggedIn, setUserData } = useContext(AppContext);
  const [userDataLocal, setUserDataLocal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem("jwt");
        if (!token) {
          navigate("/login");
          return;
        }
        const response = await axios.get(`${backendUrl}/profile`, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });
        setUserDataLocal(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setError(t("errorLoadingProfile"));
        setUserDataLocal(null);
      } finally {
        setLoading(false);
      }
    };

    if (isLoggedIn) {
      fetchUserData();
    } else {
      navigate("/login");
    }
  }, [backendUrl, isLoggedIn, navigate, t]);

  const handleDeleteAccount = async () => {
    if (!userDataLocal?.id) return;
    const confirmDelete = window.confirm(t("confirmDeleteAccount"));
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("jwt");
      await axios.delete(`${backendUrl}/delete/${userDataLocal.id}`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });

      toast.success(t("accountDeleted"));
      localStorage.removeItem("jwt");

      // Update global context
      setIsLoggedIn(false);
      setUserData(null);

      navigate("/welcome");
    } catch (err) {
      toast.error(t("errorDeletingAccount"));
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger text-center" role="alert">
          {error}
          <div className="mt-3">
            <button className="btn btn-primary" onClick={() => window.location.reload()}>
              {t("refresh")}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!userDataLocal) {
    return (
      <div className="container mt-5 text-center">
        <div className="card p-4 shadow-sm">
          <p className="text-muted mb-3">{t("noUserData")}</p>
          <button className="btn btn-primary" onClick={() => navigate("/login")}>
            {t("goToLogin")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="container-fluid d-flex justify-content-center align-items-center vh-100"
      style={{
        background: "linear-gradient(to bottom right, #1e1e2e, #181825)",
      }}
    >
      <div className="card shadow rounded" style={{ maxWidth: "400px", width: "100%", backgroundColor: "#1e1e2e", border: "none" }}>
        <div className="card-body text-center">
          <img
            src={assets.profile_icon}
            alt={t("profile")}
            className="rounded-circle mb-3"
            width={60}
            height={60}
            style={{
              filter: "invert(76%) sepia(100%) saturate(500%) hue-rotate(233deg) brightness(100%) contrast(101%)",
            }}
          />
          <h5 className="card-title text-white">{userDataLocal.name}</h5>
          <p className="card-text" style={{ color: "#bac2de" }}>{userDataLocal.email}</p>
          <div className="d-grid gap-2 mt-4">
            <button className="btn btn-primary" onClick={() => navigate("/reset-password")}>
              {t("changePassword")}
            </button>
            <button className="btn btn-danger" onClick={handleDeleteAccount}>
              {t("deleteAccount")}
            </button>
            <button className="btn btn-outline-secondary text-white border-light" onClick={() => navigate("/home")}>
              {t("back")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;