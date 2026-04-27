import React, { useState, useContext, useEffect, useRef } from 'react';
import axios from 'axios';
import { AppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

const getLocalDateString = () => {
  const today = new Date();
  const offset = today.getTimezoneOffset();
  const localDate = new Date(today.getTime() - offset * 60 * 1000);
  return localDate.toISOString().split('T')[0];
};

const NewMed = () => {
  const { t } = useTranslation();
  const { backendUrl, userData } = useContext(AppContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    doses: '',
    frequency: '',
    days: '',
    startDate: getLocalDateString(),
    additionalInfo: ''
  });

  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionsRef = useRef();

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  useEffect(() => {
    const fetchSuggestions = async () => {
      const search = formData.name.trim().toUpperCase();
      if (search.length === 0) {
        setSuggestions([]);
        return;
      }

      try {
        const res = await fetch(`https://cima.aemps.es/cima/rest/medicamentos?nombre=${search}`);
        const data = await res.json();
        const medicamentos = data.resultados || [];

        const listaMedicamentos = [];
        for (const medicamento of medicamentos) {
          let nombre = medicamento.nombre.split(' ')[0];
          const ultimaLetra = nombre[nombre.length - 1];
          if (!/[a-zA-Z]/.test(ultimaLetra)) {
            nombre = nombre.slice(0, -1);
          }
          if (!listaMedicamentos.includes(nombre) && nombre.includes(search)) {
            listaMedicamentos.push(nombre);
          }
        }

        listaMedicamentos.sort();
        setSuggestions(listaMedicamentos);
        setShowSuggestions(true);
      } catch (error) {
        console.error('Error:', error);
        setSuggestions([]);
      }
    };

    const delayDebounce = setTimeout(() => {
      fetchSuggestions();
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [formData.name]);

  useEffect(() => {
    const handleClickOutside = e => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSuggestionClick = (name) => {
    setFormData(prev => ({ ...prev, name }));
    setShowSuggestions(false);
  };

  const addDaysToDate = (dateStr, days) => {
    const date = new Date(dateStr);
    date.setDate(date.getDate() + Number(days) - 1);
    return date.toISOString().split('T')[0];
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (!userData?.id) return toast.error(t('unauthorized'));
    if (!formData.name || !formData.doses || !formData.frequency || !formData.days || !formData.startDate) {
      return toast.error(t('requiredFieldsError'));
    }

    setLoading(true);
    try {
      const endDate = addDaysToDate(formData.startDate, formData.days);
      const token = localStorage.getItem('jwt');

      const payload = {
        ...formData,
        doses: parseInt(formData.doses),
        frequency: parseInt(formData.frequency),
        days: parseInt(formData.days),
        endDate,
        active: true,
        userModel: { id: userData.id }
      };

      await axios.post(`${backendUrl}/medications/add`, payload, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true
      });

      toast.success(t('medicationAdded'));
      navigate('/medications/current');
    } catch (error) {
      toast.error(error?.response?.data || t('errorAddingMedication'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-4" style={{ maxWidth: '600px' }}>
      <div className="card shadow-sm">
        <div className="card-header bg-primary text-white">
          <h2 className="mb-0">{t('addMedication')}</h2>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit} autoComplete="off">
            <div className="mb-4 position-relative" ref={suggestionsRef}>
              <label htmlFor="med" className="form-label fw-bold">{t('medication')} *</label>
              <input
                type="text"
                className="form-control form-control-lg"
                id="med"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder={t('medication')}
                required
              />
              {showSuggestions && suggestions.length > 0 && (
                <div
                  className="list-group position-absolute w-100 z-3 mt-1 shadow"
                  style={{ maxHeight: '200px', overflowY: 'auto' }}
                >
                  {suggestions.map((item, idx) => (
                    <button
                      key={idx}
                      type="button"
                      className="list-group-item list-group-item-action text-start"
                      onClick={() => handleSuggestionClick(item)}
                      onMouseDown={(e) => e.preventDefault()}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="row g-3 mb-4">
              <div className="col-md-6">
                <label htmlFor="doses" className="form-label fw-bold">{t('dose')} *</label>
                <div className="input-group">
                  <input
                    type="number"
                    className="form-control"
                    id="doses"
                    name="doses"
                    value={formData.doses}
                    onChange={handleChange}
                    min="1"
                    placeholder="1"
                    required
                  />
                </div>
              </div>
              
              <div className="col-md-6">
                <label htmlFor="frequency" className="form-label fw-bold">{t('frequency')} *</label>
                <div className="input-group">
                  <input
                    type="number"
                    className="form-control"
                    id="frequency"
                    name="frequency"
                    value={formData.frequency}
                    onChange={handleChange}
                    min="1"
                    placeholder="1"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="row g-3 mb-4">
              <div className="col-md-6">
                <label htmlFor="days" className="form-label fw-bold">{t('days')} *</label>
                <div className="input-group">
                  <input
                    type="number"
                    className="form-control"
                    id="days"
                    name="days"
                    value={formData.days}
                    onChange={handleChange}
                    min="1"
                    placeholder="7"
                    required
                  />
                </div>
              </div>
              
              <div className="col-md-6">
                <label htmlFor="startDate" className="form-label fw-bold">{t('startDate')} *</label>
                <input
                  type="date"
                  className="form-control"
                  id="startDate"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>
            </div>

            <div className="mb-4">
              <label htmlFor="additionalInfo" className="form-label fw-bold">{t('additionalInfo')}</label>
              <textarea
                className="form-control"
                id="additionalInfo"
                name="additionalInfo"
                rows="3"
                value={formData.additionalInfo}
                onChange={handleChange}
                placeholder={t('additionalInfo')}
              ></textarea>
            </div>

            <div className="d-flex justify-content-between mt-4">  
              <button 
                type="submit" 
                className="btn btn-primary px-4" 
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    {t('saving')}
                  </>
                ) : (
                  <>
                    <i className="bi bi-plus-circle me-2"></i>
                    {t('add')}
                  </>
                )}
              </button>

              <button
                type="button"
                className="btn btn-outline-secondary px-4"
                onClick={() => navigate("/home")}
                disabled={loading}
              >
                {t("cancel")}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewMed;