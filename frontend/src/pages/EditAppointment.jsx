import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

const EditAppointment = () => {
  const { t } = useTranslation();
  const { backendUrl, userData } = useContext(AppContext);
  const { id } = useParams();
  const navigate = useNavigate();

  const [appointment, setAppointment] = useState({
    type: "",
    name: "",
    city: "",
    street: "",
    number: "",
    date: "",
    hour: "",
    additionalInfo: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        const token = localStorage.getItem("jwt");
        const res = await axios.get(`${backendUrl}/apt/get/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });

        const data = res.data;

        const [day, month, year] = data.date.split("/");
        const formattedDate = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
        const formattedTime = data.hour;

        setAppointment({
          type: data.type || "",
          name: data.name || "",
          city: data.city || "",
          street: data.street || "",
          number: data.number || "",
          date: formattedDate,
          hour: formattedTime,
          additionalInfo: data.additionalInfo || "",
        });

      } catch (error) {
        toast.error(t("errorLoadingAppointment"));
        console.error("Error:", error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointment();
  }, [backendUrl, id, t]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAppointment((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateFields = () => {
    if (!appointment.type || !appointment.date || !appointment.hour) {
      toast.error(t("requiredFields"));
      return false;
    }
    if (!appointment.date || !appointment.hour) {
      toast.error(t("dateTimeRequired"));
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateFields()) return;

    try {
      setSaving(true);
      const token = localStorage.getItem("jwt");

      const isoDateTime = `${appointment.date}T${appointment.hour}`;

      const payload = {
        type: appointment.type,
        name: appointment.name,
        city: appointment.city,
        street: appointment.street,
        number: appointment.number,
        date: isoDateTime,
        additionalInfo: appointment.additionalInfo,
        active: true,
        userModel: {
          id: userData?.id || null,
        },
      };

      await axios.put(`${backendUrl}/apt/edit/${id}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });

      toast.success(t("appointmentUpdated"));
      navigate("/appointments/current");
    } catch (error) {
      toast.error(t("errorUpdatingAppointment"));
      console.error("Error:", error.response?.data || error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-8 text-center">
            <div className="spinner-border text-primary" style={{ width: "3rem", height: "3rem" }} role="status">
              <span className="visually-hidden">{t("loading")}</span>
            </div>
            <p className="mt-3">{t("loadingAppointmentData")}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8 col-md-10">
          <div className="card shadow-sm">
            <div className="card-header bg-primary text-white">
              <h2 className="h4 mb-0">{t("editAppointment")}</h2>
            </div>
            
            <div className="card-body">
              <form onSubmit={handleSubmit} autoComplete="off">
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-bold">{t("appointmentType")} *</label>
                    <input
                      list="appointmentTypes"
                      className="form-control"
                      name="type"
                      value={appointment.type}
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
                      value={appointment.name}
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
                      value={appointment.city}
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
                      value={appointment.street}
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
                      value={appointment.number}
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
                      value={appointment.date}
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
                      value={appointment.hour}
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
                    value={appointment.additionalInfo}
                    onChange={handleChange}
                    placeholder={t("additionalInfo")}
                  />
                </div>

                <div className="d-flex justify-content-between mt-4">
                  <button 
                    type="submit" 
                    className="btn btn-primary px-4"
                    disabled={saving}
                  >
                    {saving ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        {t("saving")}
                      </>
                    ) : (
                      <>
                      <i className="bi bi-check-circle me-2"></i>
                      {t("saveChanges")}
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    className="btn btn-outline-secondary px-4"
                    onClick={() => navigate("/appointments/current")}
                    disabled={saving}
                  >
                    <>
                    <i className="bi bi-arrow-left me-2"></i>
                    {t("cancel")}
                    </>
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

export default EditAppointment;