import React, { useEffect, useState, useContext, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AppContext } from '../context/AppContext';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

const EditMed = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const { backendUrl, userData } = useContext(AppContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    doses: '',
    frequency: '',
    days: '',
    startDate: '',
    additionalInfo: '',
  });

  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const wrapperRef = useRef(null);

  const formatDateFromDDMMYYYY = (dateStr) => {
    if (!dateStr) return '';
    const parts = dateStr.split('/');
    if (parts.length !== 3) return '';
    const [day, month, year] = parts;
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  };

  useEffect(() => {
    const fetchMedication = async () => {
      try {
        const token = localStorage.getItem('jwt');
        const res = await axios.get(`${backendUrl}/medications/get/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });
        const med = res.data;
        const formattedStartDate = formatDateFromDDMMYYYY(med.startDate);

        setFormData({
          name: med.name,
          doses: med.doses,
          frequency: med.frequency,
          days: med.days,
          startDate: formattedStartDate,
          additionalInfo: med.additionalInfo || '',
        });
      } catch (err) {
        toast.error(t('loadError'));
        console.error(err);
      }
    };
    fetchMedication();
  }, [backendUrl, id, t]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === 'name') {
      const buscado = value.trim().toUpperCase();
      if (buscado.length === 0) {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }

      fetch(`https://cima.aemps.es/cima/rest/medicamentos?nombre=${buscado}`)
        .then((res) => res.json())
        .then((data) => {
          const medicamentos = data.resultados || [];
          const listaMedicamentos = [];
          medicamentos.forEach((medicamento) => {
            let nombreMedicamento = medicamento.nombre.split(' ')[0];
            const ultimaLetra = nombreMedicamento.slice(-1);
            if (!/[a-zA-Z]/.test(ultimaLetra)) {
              nombreMedicamento = nombreMedicamento.slice(0, -1);
            }
            if (!listaMedicamentos.includes(nombreMedicamento) && nombreMedicamento.includes(buscado)) {
              listaMedicamentos.push(nombreMedicamento);
            }
          });
          listaMedicamentos.sort();
          setSuggestions(listaMedicamentos);
          setShowSuggestions(listaMedicamentos.length > 0);
        })
        .catch((error) => {
          console.error('Error fetching medication suggestions:', error);
          setSuggestions([]);
          setShowSuggestions(false);
        });
    }
  };

  const handleSuggestionClick = (nombre) => {
    setFormData((prev) => ({ ...prev, name: nombre }));
    setShowSuggestions(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('jwt');
      const start = new Date(formData.startDate);
      const end = new Date(start);
      end.setDate(end.getDate() + parseInt(formData.days));
      const formattedEndDate = end.toISOString().split('T')[0];

      const payload = {
        ...formData,
        endDate: formattedEndDate,
        userModel: { id: userData.id },
        active: true,
      };

      await axios.put(`${backendUrl}/medications/edit/${id}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });

      toast.success(t('success_changes'));
      navigate('/medications/current');
    } catch (err) {
      toast.error(t('error'));
      console.error('Update error: ', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container py-4" style={{ maxWidth: '700px' }}>
      <div className="card shadow-sm">
        <div className="card-header bg-primary text-white">
          <h2 className="h4 mb-0">{t('title')}</h2>
        </div>
        
        <div className="card-body">
          <form onSubmit={handleSubmit} ref={wrapperRef}>
            <div className="mb-4">
              <label htmlFor="name" className="form-label fw-bold">{t('name')}</label>
              <div className="input-group">
                <input
                  type="text"
                  className="form-control form-control-lg"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  autoComplete="off"
                  readOnly
                />
              </div>
            </div>

            <div className="row g-3 mb-4">
              <div className="col-md-6">
                <label htmlFor="doses" className="form-label fw-bold">{t('doses')}</label>
                <input
                  type="number"
                  className="form-control"
                  id="doses"
                  name="doses"
                  value={formData.doses}
                  onChange={handleChange}
                  readOnly
                />
              </div>
              
              <div className="col-md-6">
                <label htmlFor="frequency" className="form-label fw-bold">{t('frequency')}</label>
                <input
                  type="number"
                  className="form-control"
                  id="frequency"
                  name="frequency"
                  value={formData.frequency}
                  onChange={handleChange}
                  readOnly
                />
              </div>
            </div>

            <div className="row g-3 mb-4">
              <div className="col-md-6">
                <label htmlFor="days" className="form-label fw-bold">{t('days')}</label>
                <input
                  type="number"
                  className="form-control"
                  id="days"
                  name="days"
                  value={formData.days}
                  onChange={handleChange}
                  readOnly
                />
              </div>
              
              <div className="col-md-6">
                <label htmlFor="startDate" className="form-label fw-bold">{t('startDate')}</label>
                <input
                  type="date"
                  className="form-control"
                  id="startDate"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  readOnly
                />
              </div>
            </div>

            <div className="mb-4">
              <label htmlFor="additionalInfo" className="form-label fw-bold">{t('additionalInfo')}</label>
              <textarea
                className="form-control"
                id="additionalInfo"
                name="additionalInfo"
                value={formData.additionalInfo}
                onChange={handleChange}
                rows="4"
                style={{ resize: 'none' }}
                placeholder={t('additionalInfo')}
              />
            </div>

            <div className="d-flex justify-content-between pt-3 border-top">
              <button 
                type="submit" 
                className="btn btn-primary px-4"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    {t('saving')}
                  </>
                ) : (
                  <>
                    <i className="bi bi-check-circle me-2"></i>
                    {t('save')}
                  </>
                )}
              </button>


              <button
                type="button"
                className="btn btn-outline-secondary px-4"
                onClick={() => navigate('/medications/current')}
              >
                <i className="bi bi-arrow-left me-2"></i>
                {t('cancel')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditMed;