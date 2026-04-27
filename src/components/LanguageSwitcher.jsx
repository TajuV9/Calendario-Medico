import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  const isActive = (lng) => i18n.language === lng;

  return (
    <div className="d-flex gap-2">
      <button
        className={`btn btn-sm ${isActive('es') ? 'btn-primary' : 'btn-outline-primary'}`}
        onClick={() => changeLanguage('es')}
        aria-label="Cambiar a Español"
      >
        🇪🇸
      </button>
      <button
        className={`btn btn-sm ${isActive('en') ? 'btn-primary' : 'btn-outline-primary'}`}
        onClick={() => changeLanguage('en')}
        aria-label="Change to English"
      >
        🇬🇧
      </button>
    </div>
  );
};

export default LanguageSwitcher;