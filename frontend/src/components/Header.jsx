import { assets } from '../assets/assets';
import { AppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';

const Header = () => {
    const navigate = useNavigate();
    const { userData } = useContext(AppContext);
    const { t } = useTranslation();

    return (
        <div className="text-center d-flex flex-column align-items-center justify-content-center py-5 px-3" style={{ minHeight: "80vh" }}>
            <img src={assets.home_logo} alt="header" width={120} className="mb-4" />

            <h1 className="fw-bold display-5 mb-3">{t('welcome_message')}</h1>

            <p className="text-muted fs-5 mb-4" style={{ maxWidth: "80vw" }}>
                {t('welcome_description')}
            </p>

            {userData ? (
                <button className="btn btn-outline-dark rounded-pill px-4 py-4" onClick={() => navigate("/home")}>
                    {t('go_home')}
                </button>    
            ) : (
                <button className="btn btn-outline-dark rounded-pill px-4 py-4" onClick={() => navigate("/register")}>
                    {t('register')}
                </button>
            )}
        </div>
    );
};

export default Header;