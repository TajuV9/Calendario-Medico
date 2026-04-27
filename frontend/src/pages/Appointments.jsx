import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaTrash, FaFilter } from "react-icons/fa";
import { useTranslation } from "react-i18next";

const Appointments = () => {
  const { t } = useTranslation();
  const { backendUrl, userData } = useContext(AppContext);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchType, setSearchType] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [searchHour, setSearchHour] = useState("");
  const [filterActive, setFilterActive] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const navigate = useNavigate();

  const fetchAppointments = async () => {
    if (!userData?.id) return;
    try {
      const token = localStorage.getItem("jwt");
      const res = await axios.get(`${backendUrl}/apt/next/${userData.id}`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      setAppointments(res.data || []);
    } catch (error) {
      toast.error(t("errorLoading"));
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [backendUrl, userData]);

  const toggleFilter = () => setShowFilter(!showFilter);

  const handleEdit = (id) => navigate(`/appointments/edit/${id}`);

  const handleDelete = async (id) => {
    if (!window.confirm(t("confirmDelete"))) return;
    try {
      const token = localStorage.getItem("jwt");
      await axios.delete(`${backendUrl}/apt/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      toast.success(t("appointmentDeleted"));
      fetchAppointments();
    } catch (err) {
      toast.error(t("errorDeleting"));
      console.error(err);
    }
  };

  const filteredAppointments = appointments.filter((a) => {
    if (searchType && a.type && !a.type.toLowerCase().includes(searchType.toLowerCase())) {
      return false;
    }

    if (searchDate && a.date && a.date.substring(0, 10) !== searchDate) {
      return false;
    }

    if (searchHour && a.hour && a.hour !== searchHour) {
      return false;
    }

    if (filterActive !== "") {
      const activeBool = filterActive === "true";
      if (a.active !== activeBool) return false;
    }

    return true;
  });

  if (loading) return <p>{t("loading")}</p>;

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>{t("appointments")}</h2>
        <div className="d-flex align-items-center gap-2">
          <input
            type="text"
            className="form-control"
            placeholder={t("searchPlaceholder")}
            value={searchType}
            onChange={(e) => setSearchType(e.target.value)}
            style={{ maxWidth: "200px" }}
          />
          <button className="btn btn-outline-secondary" onClick={toggleFilter}>
            <FaFilter /> {t("filter")}
          </button>
        </div>
      </div>

      {showFilter && (
        <div className="mb-3 border rounded p-3 bg-light">
          <div className="row g-3">
            <div className="col-md-3">
              <label className="form-label">{t("date")}</label>
              <div className="d-flex align-items-center gap-2">
                <input
                  type="date"
                  className="form-control"
                  value={searchDate}
                  onChange={(e) => setSearchDate(e.target.value)}
                />
                <button
                  type="button"
                  className="btn btn-outline-secondary btn-sm"
                  onClick={() => setSearchDate("")}
                  title={t("clear")}
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="col-md-3">
              <label className="form-label">{t("hour")}</label>
              <input
                type="time"
                className="form-control"
                value={searchHour}
                onChange={(e) => setSearchHour(e.target.value)}
              />
            </div>

            <div className="col-md-3">
              <label className="form-label">{t("active")}</label>
              <select
                className="form-select"
                value={filterActive}
                onChange={(e) => setFilterActive(e.target.value)}
              >
                <option value="">{t("all")}</option>
                <option value="true">{t("active")}</option>
                <option value="false">{t("inactive")}</option>
              </select>
            </div>
          </div>
        </div>
      )}

      <ul className="list-group">
        {filteredAppointments.length > 0 ? (
          filteredAppointments.map((a) => (
            <li
              key={a.id}
              className="list-group-item d-flex justify-content-between align-items-start mb-2"
            >
              <div>
                <div>
                  <strong>{a.type}</strong> — {a.name || ""}
                  <span
                    style={{
                      display: "inline-block",
                      width: "12px",
                      height: "12px",
                      borderRadius: "50%",
                      backgroundColor: a.active ? "green" : "red",
                      marginLeft: "8px",
                    }}
                    title={a.active ? t("activeStatus") : t("inactiveStatus")}
                  />
                </div>
                <div>{t("date")}: {a.date?.substring(0, 10) || "-"}</div>
                <div>{t("hour")}: {a.hour || "-"}</div>
                {a.city && <div>{t("city")}: {a.city}</div>}
                {a.street && a.number && (
                  <div>{t("direction")}: {a.street} #{a.number}</div>
                )}
                {a.additionalInfo && (
                  <div className="text-muted">
                    <small>{t("notes")}: {a.additionalInfo}</small>
                  </div>
                )}
              </div>
              <div className="d-flex gap-2">
                <button className="btn btn-sm btn-outline-primary" onClick={() => handleEdit(a.id)}>
                  <FaEdit />
                </button>
                <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(a.id)}>
                  <FaTrash />
                </button>
              </div>
            </li>
          ))
        ) : (
          <p className="text-muted">{t("no_appointments")}</p>
        )}
      </ul>

      <button className="btn btn-secondary mt-3" onClick={() => navigate("/home")}>
        {t("back")}
      </button>
    </div>
  );
};

export default Appointments;