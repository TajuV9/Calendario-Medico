import { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { assets } from '../assets/assets';
import CustomCalendar from './CustomCalendar';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../components/LanguageSwitcher';


const Home = () => {
  const { userData, isLoggedIn, setIsLoggedIn, backendUrl, setUserData } = useContext(AppContext);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [nextMedications, setNextMedications] = useState([]);
  const [nextAppointment, setNextAppointment] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [dayAppointments, setDayAppointments] = useState([]);
  const [dayMedications, setDayMedications] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const formatAppointmentDate = (dateString, hourString, language) => {
    if (!dateString || !hourString) return '';
    const [day, month, year] = dateString.split('/');
    if (!day || !month || !year) return 'Invalid Date';

    const isoDateStr = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    const dateTimeStr = `${isoDateStr}T${hourString}:00`;

    const dateObj = new Date(dateTimeStr);
    if (isNaN(dateObj)) return 'Invalid Date';

    const options = { weekday: 'long', day: 'numeric', month: 'long' };
    const datePart = dateObj.toLocaleDateString(language, options);
    const timePart = dateObj.toLocaleTimeString(language, { hour: '2-digit', minute: '2-digit' });

    return `${datePart} - ${timePart}`;
  };

  // Format date yyyy-MM-dd
  const formatDateForBackend = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    if (!isLoggedIn || !userData) {
      navigate("/login");
      return;
    }

    const updateExpiredMedications = async (medications) => {
      const token = localStorage.getItem('jwt');
      const today = new Date();
      const expiredMeds = medications.filter(med => {
        const [day, month, year] = med.endDate.split('/');
        const endDate = new Date(year, month - 1, day);
        return med.active && endDate < today;
      });

      for (const med of expiredMeds) {
        try {
          await axios.patch(`${backendUrl}/medications/update/${med.id}`,
            { active: false },
            {
              headers: { Authorization: `Bearer ${token}` },
              withCredentials: true,
            }
          );
        } catch (error) {
          console.error(`Error updating medication ${med.id}`, error);
        }
      }
    };

    const fetchAndUpdateMedications = async () => {
      try {
        const token = localStorage.getItem('jwt');
        const response = await axios.get(`${backendUrl}/medications/current/${userData.id}`, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });

        const medications = response.data;
        await updateExpiredMedications(medications);

        const updatedResponse = await axios.get(`${backendUrl}/medications/current/${userData.id}`, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });


        const today = new Date();
        const formatDate = (date) => {
          const day = String(date.getDate()).padStart(2, '0');
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const year = date.getFullYear();
          return `${day}/${month}/${year}`;
        };

        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);

        const tomorrowStr = formatDate(tomorrow);
        const updatedMedications = updatedResponse.data;
        setNextMedications(updatedMedications.filter(med => med.active && med.startDate === tomorrowStr));

      } catch (error) {
        console.error("Error fetching medications:", error);
        setNextMedications([]);
      }
    };

    const fetchNextAppointment = async () => {
      try {
        const token = localStorage.getItem('jwt');
        const response = await axios.get(`${backendUrl}/apt/next/${userData.id}`, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });

        if (response.data && response.data.length > 0) {
          setNextAppointment(response.data[0]);
        } else {
          setNextAppointment(null);
        }
      } catch (error) {
        console.error("Error fetching next appointment:", error);
        setNextAppointment(null);
      }
    };

    fetchAndUpdateMedications();
    fetchNextAppointment();
  }, [backendUrl, isLoggedIn, userData, navigate]);

  const handleDateClick = async (date) => {
    setSelectedDate(date);
    setLoading(true);

    try {
      const token = localStorage.getItem('jwt');
      const formattedDate = formatDateForBackend(date);

      const appointmentsResponse = await axios.get(
        `${backendUrl}/apt/date/${formattedDate}/user/${userData.id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      setDayAppointments(appointmentsResponse.data);

      const medicationsResponse = await axios.get(
        `${backendUrl}/medications/date/${formattedDate}/user/${userData.id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      setDayMedications(medicationsResponse.data);

    } catch (error) {
      console.error("Error fetching day data:", error);
      toast.error(t('error_loading_day_info'));
      setDayAppointments([]);
      setDayMedications([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      axios.defaults.withCredentials = true;
      const response = await axios.post(`${backendUrl}/logout`, {}, { withCredentials: true });

      if (response.status === 200) {
        localStorage.removeItem('jwt');
        setIsLoggedIn(false);
        setUserData(null);
        navigate("/welcome");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || t('error_during_logout'));
    }
  };

  if (!isLoggedIn || !userData) return null;

  return (
    <div className="d-flex" style={{ minHeight: '100vh', background: '#f8f9fa' }}>
      {/* Sidebar */}
      <aside
        className="d-flex flex-column p-4 shadow-sm"
        style={{
          width: '250px',
          backgroundColor: '#ffffff',
          borderRight: '1px solid #e0e0e0',
        }}
      >
        <div className="d-flex align-items-center mb-5">
          <img src={assets.home_logo} alt="logo" width={40} height={40} />
          <span className="fw-bold fs-4 ms-2 text-primary">MiSALUD</span>
        </div>

        <nav className="nav flex-column w-100">
          <SidebarLink to="/appointments/add" icon="plus-circle" text={t('add_appointments')} />
          <SidebarLink to="/appointments/current" icon="clipboard-data" text={t('view_appointments')} />
          <SidebarLink to="/medications/add" icon="capsule" text={t('add_medications')} />
          <SidebarLink to="/medications/current" icon="list-ul" text={t('view_medications')} />

          <div
            className="nav-link py-2 mt-3 rounded d-flex justify-content-between align-items-center text-dark fw-semibold sidebar-hover"
            style={{ cursor: 'pointer' }}
            onClick={() => setShowProfileMenu(!showProfileMenu)}
          >
            <div><i className="bi bi-person-circle me-2"></i>{t('account')}</div>
            <i className={`bi ${showProfileMenu ? 'bi-chevron-up' : 'bi-chevron-down'}`}></i>
          </div>

          {showProfileMenu && (
            <div className="d-flex flex-column ps-4">
              <Link to="/profile" className="nav-link text-dark py-1 sidebar-hover">{t('profile')}</Link>
              <Link to="/reset-password" className="nav-link text-dark py-1 sidebar-hover">{t('reset_password')}</Link>
              <button
                className="btn btn-link text-start nav-link text-danger py-1 sidebar-hover"
                onClick={handleLogout}
              >
                {t('logout')}
              </button>
            </div>
          )}
        </nav>

        <div style={{ marginTop: 'auto' }}>
          <LanguageSwitcher />
        </div>
      </aside>

      {/* Main */}
      <main className="flex-grow-1 p-4 d-flex flex-column">
        {isLoggedIn && userData && (
          <div className="mb-4 text-center">
            <h4 className="fw-semibold">
              👋 {t('welcome')}, <span className="text-primary">{userData.name}</span>
            </h4>
          </div>
        )}

        <div className="row flex-grow-1 h-100 align-items-stretch">
          <div className="col-md-8 h-100">
            <div className="card shadow-sm p-3 h-100 d-flex flex-column">
              <h5 className="fw-bold mb-3 text-center">{t('calendar')}</h5>
              <CustomCalendar onDateClick={handleDateClick} />

              {/* Meds and apts for the selected day */}
              {selectedDate && (
                <div className="mt-3">
                  {loading ? (
                    <div className="text-center">
                      <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">{t('loading')}</span>
                      </div>
                    </div>
                  ) : (
                    <>
                      {dayAppointments.length === 0 && dayMedications.length === 0 && (
                        <p className="text-muted">{t("no_meds_apt_day")}</p>
                      )}

                      {dayAppointments.length > 0 && (
                        <div className="mb-3">
                          <h6><strong>{t('appointments')}</strong></h6>
                          <div className="list-group">
                            {dayAppointments.map((apt, i) => (
                              <div key={i} className="list-group-item">
                                <p className="mb-1 fw-semibold">
                                  {formatAppointmentDate(apt.date, apt.hour, i18n.language)}
                                </p>
                                {apt.type && <p className="mb-0 text-muted">{t("type")}: {apt.type}</p>}
                                {apt.name && <p className="mb-0 text-muted">{t("name")}: {apt.name}</p>}
                                {apt.city && <p className="mb-0 text-muted">{t("city")}: {apt.city}</p>}
                                {apt.street && <p className="mb-0 text-muted">{t("street")}: {apt.street}</p>}
                                {apt.number && <p className="mb-0 text-muted">{t("number")}: {apt.number}</p>}
                                {apt.additionalInfo && <p className="mb-0 text-muted">{t("notes")}: {apt.additionalInfo}</p>}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {dayMedications.length > 0 && (
                        <div>
                          <h6><strong>{t('medications')}</strong></h6>
                          <div className="list-group">
                            {dayMedications.map((med, i) => (
                              <div key={i} className="list-group-item">
                                <p className="mb-1 fw-semibold">{med.name}</p>
                                <p className="mb-0 text-muted">{t('doses')}: {med.doses}</p>
                                <p className="mb-0 text-muted">{t('frequency')}: {med.frequency}</p>
                                <p className="mb-0 text-muted">{t('duration')}: {med.days}</p>
                                <p className="mb-0 text-muted">{t('from')} {med.startDate} {t('to')} {med.endDate}</p>
                                {med.additionalInfo && (
                                  <p className="mb-0 text-muted">{t('notes')}: {med.additionalInfo}</p>
                                )}
                              </div>
                            ))}

                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="col-md-4 d-flex flex-column gap-3">
            <div className="card shadow-sm p-3">
              <h6 className="fw-bold mb-2">{t('next_appointment')}</h6>
              {nextAppointment ? (
                <div className="list-group-item">
                  <p className="mb-1 fw-semibold">
                    {formatAppointmentDate(nextAppointment.date, nextAppointment.hour, i18n.language)}
                  </p>
                  {nextAppointment.additionalInfo && (
                    <p className="mb-0 text-muted">{nextAppointment.additionalInfo}</p>
                  )}
                </div>
              ) : (
                <p className="text-muted mb-0">{t('no_next_appointment')}</p>
              )}
            </div>

            <div className="card shadow-sm p-3">
              <h6 className="fw-bold mb-2">{t('next_medications')}</h6>
              {nextMedications.length > 0 ? (
                nextMedications.slice(0, 3).map((med, i) => (
                  <div key={i} className="mb-2">
                    <p className="text-muted mb-0 fw-semibold">{med.name}</p>
                    <p className="text-muted mb-0 small">{t('from')} {med.startDate} {t('to')} {med.endDate}</p>
                  </div>
                ))
              ) : (
                <p className="text-muted mb-0">{t('no_next_medications')}</p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

const SidebarLink = ({ to, icon, text }) => (
  <Link
    to={to}
    className="nav-link d-flex align-items-center py-2 text-dark sidebar-hover fw-semibold rounded"
  >
    <i className={`bi bi-${icon} me-2`}></i> {text}
  </Link>
);

export default Home;