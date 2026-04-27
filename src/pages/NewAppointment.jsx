import React, { useState, useContext } from "react";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

const NewAppointment = () => {
  const { t } = useTranslation();
  const { backendUrl, userData } = useContext(AppContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    type: "",
    name: "",
    city: "",
    street: "",
    number: "",
    date: "",
    hour: "",
    additionalInfo: ""
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userData?.id) return toast.error(t("unauthorized"));

    const requiredFields = ["type", "date", "hour"];
    for (const field of requiredFields) {
      if (!formData[field]) {
        return toast.error(t("requiredFieldsError"));
      }
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("jwt");

      const isoDateTime = `${formData.date}T${formData.hour}`;

      const payload = {
        type: formData.type,
        name: formData.name,
        city: formData.city,
        street: formData.street,
        number: formData.number,
        date: isoDateTime,
        additionalInfo: formData.additionalInfo,
        active: true,
        userModel: { id: userData.id }
      };

      await axios.post(`${backendUrl}/apt/add`, payload, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true
      });

      toast.success(t("appointmentCreated"));
      navigate("/appointments/current");
    } catch (err) {
      console.error(err);
      toast.error(t("errorAddingAppointment"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8 col-md-10">
          <div className="card shadow-sm">
            <div className="card-header bg-primary text-white">
              <h2 className="h4 mb-0">{t("newAppointment")}</h2>
            </div>
            
            <div className="card-body">
              <form onSubmit={handleSubmit} autoComplete="off">
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-bold">{t("type")} *</label>
                    <input
                      list="appointmentTypes"
                      className="form-control"
                      name="type"
                      value={formData.type}
                      onChange={handleChange}
                      placeholder={t("selectOption")}
                      required
                    />
                    <datalist id="appointmentTypes">
                      <option value="Consulta médica general" />
                      <option value="Odontología" />
                      <option value="Dermatología" />
                      <option value="Oftalmología" />
                      <option value="Cardiología" />
                      <option value="Pediatría" />
                      <option value="Ginecología" />
                      <option value="Psicología" />
                      <option value="Fisioterapia" />
                      <option value="Cirugía" />
                    </datalist>
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-bold">{t("doctorName")}</label>
                    <input
                      type="text"
                      className="form-control"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder={t("doctorName")}
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-bold">{t("city")}</label>
                    <input
                      type="text"
                      className="form-control"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder={t("city")}
                    />
                  </div>

                  <div className="col-md-4 mb-3">
                    <label className="form-label fw-bold">{t("street")}</label>
                    <input
                      type="text"
                      className="form-control"
                      name="street"
                      value={formData.street}
                      onChange={handleChange}
                      placeholder={t("street")}
                    />
                  </div>

                  <div className="col-md-2 mb-3">
                    <label className="form-label fw-bold">{t("number")}</label>
                    <input
                      type="text"
                      className="form-control"
                      name="number"
                      value={formData.number}
                      onChange={handleChange}
                      placeholder={t("number")}
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-bold">{t("date")} *</label>
                    <input
                      type="date"
                      className="form-control"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      min={new Date().toISOString().split('T')[0]}
                      required
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-bold">{t("hour")} *</label>
                    <input
                      type="time"
                      className="form-control"
                      name="hour"
                      value={formData.hour}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="form-label fw-bold">{t("additionalInfo")}</label>
                  <textarea
                    className="form-control"
                    name="additionalInfo"
                    rows="4"
                    value={formData.additionalInfo}
                    onChange={handleChange}
                    placeholder={t("additionalInfo")}
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
                        {t("saving")}
                      </>
                    ) : (
                      <>
                      <i className="bi bi-plus-circle me-2"></i>
                      {t("add")}
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
      </div>
    </div>
  );
};

export default NewAppointment;