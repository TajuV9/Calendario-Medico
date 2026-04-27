import { useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets';
import { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import LanguageSwitcher from "./LanguageSwitcher";
import { useTranslation } from 'react-i18next';

const Menubar = () => {
  const navigate = useNavigate();
  const { userData } = useContext(AppContext);
  const { t } = useTranslation();

  return (
    <nav className="navbar bg-white px-5 py-4 d-flex justify-content-between align-items-center">
      <div className="d-flex align-items-center gap-2">
        <img src={assets.home_logo} alt="logo" width={32} height={32} />
        <span className="fw-bold fs-4 text-dark">MiSALUD</span>
        <LanguageSwitcher />
      </div>

      {!userData && (
        <div
          className="btn btn-outline-dark rounded-pill px-3"
          onClick={() => navigate("/login")}
          style={{ cursor: 'pointer' }}
        >
          {t('login')}
        </div>
      )}
    </nav>
  );
};

export default Menubar;