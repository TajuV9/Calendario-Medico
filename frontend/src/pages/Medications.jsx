import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaEdit, FaTrash, FaFilter } from "react-icons/fa";
import { useTranslation } from "react-i18next";

const Medications = () => {
  const { t } = useTranslation();
  const { backendUrl, userData } = useContext(AppContext);
  const [medications, setMedications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [filterActive, setFilterActive] = useState("true");
  const [filterDoses, setFilterDoses] = useState("");
  const [filterDays, setFilterDays] = useState("");
  const [filterStartDate, setFilterStartDate] = useState("");
  const [filterEndDate, setFilterEndDate] = useState("");
  const navigate = useNavigate();

  function parseDate(dateStr) {
    const [day, month, year] = dateStr.split("/");
    return new Date(year, month - 1, day);
  }

  const fetchMedications = async () => {
    if (!userData?.id) return;

    try {
      const token = localStorage.getItem("jwt");
      const response = await axios.get(
        `${backendUrl}/medications/current/${userData.id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      setMedications(response.data || []);
    } catch (error) {
      toast.error(t("error_fetching"));
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedications();
  }, [backendUrl, userData]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const toggleFilter = () => {
    setShowFilter((prev) => !prev);
  };

  const handleEdit = (medId) => {
    navigate(`/medications/edit/${medId}`);
  };

  const handleDelete = async (medId) => {
    const confirm = window.confirm(t("confirm_delete"));
    if (!confirm) return;

    try {
      const token = localStorage.getItem("jwt");
      await axios.delete(`${backendUrl}/medications/delete/${medId}`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      toast.success(t("deleted"));
      fetchMedications();
    } catch (error) {
      toast.error(t("error_deleting"));
      console.error(error);
    }
  };

  const filteredMedications = medications.filter((med) => {
    if (!med.name.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    if (filterActive !== "") {
      const activeBool = filterActive === "true";
      if (med.active !== activeBool) return false;
    }
    if (filterDoses !== "" && med.doses !== Number(filterDoses)) return false;
    if (filterDays !== "" && med.days !== Number(filterDays)) return false;
    if (filterStartDate !== "") {
      const startDateFilter = new Date(filterStartDate);
      const medStartDate = parseDate(med.startDate);
      if (!medStartDate || medStartDate < startDateFilter) return false;
    }
    if (filterEndDate !== "") {
      const endDateFilter = new Date(filterEndDate);
      const medEndDate = parseDate(med.endDate);
      if (!medEndDate || medEndDate > endDateFilter) return false;
    }
    return true;
  });

  if (loading) return <p>{t("loading")}</p>;

  if (medications.length === 0)
    return (
      <div className="container mt-4">
        <p>{t("no_medications")}</p>
        <button className="btn btn-secondary mt-3" onClick={() => navigate("/home")}>
          {t("back_home")}
        </button>
      </div>
    );

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="mb-0">{t("medications")}</h2>
        <div className="d-flex align-items-center gap-2">
          <input
            type="text"
            placeholder={t("search_name")}
            className="form-control"
            style={{ maxWidth: "200px" }}
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <button className="btn btn-outline-secondary" onClick={toggleFilter}>
            <FaFilter />
          </button>
        </div>
      </div>

      {showFilter && (
        <div className="mb-3 border rounded p-3 bg-light">
          <div className="row g-3">
            <div className="col-md-2">
              <label className="form-label">{t("doses")}</label>
              <input
                type="number"
                className="form-control"
                min="1"
                value={filterDoses}
                onChange={(e) => setFilterDoses(e.target.value)}
                placeholder={t("any")}
              />
            </div>

            <div className="col-md-2">
              <label className="form-label">{t("days")}</label>
              <input
                type="number"
                className="form-control"
                min="1"
                value={filterDays}
                onChange={(e) => setFilterDays(e.target.value)}
                placeholder={t("any")}
              />
            </div>

            <div className="col-md-2">
              <label className="form-label">{t("active")}</label>
              <select
                className="form-select"
                value={filterActive}
                onChange={(e) => setFilterActive(e.target.value)}
              >
                <option value="true">{t("active_true")}</option>
                <option value="false">{t("active_false")}</option>
                <option value="">{t("all")}</option>
              </select>
            </div>

            <div className="col-md-3">
              <label className="form-label">{t("start_date")}</label>
              <div className="d-flex align-items-center gap-2">
                <input
                  type="date"
                  className="form-control"
                  value={filterStartDate}
                  onChange={(e) => setFilterStartDate(e.target.value)}
                />
                <button
                  type="button"
                  className="btn btn-outline-secondary btn-sm"
                  onClick={() => setFilterStartDate("")}
                  title={t("clear")}
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="col-md-3">
              <label className="form-label">{t("end_date")}</label>
              <div className="d-flex align-items-center gap-2">
                <input
                  type="date"
                  className="form-control"
                  value={filterEndDate}
                  onChange={(e) => setFilterEndDate(e.target.value)}
                />
                <button
                  type="button"
                  className="btn btn-outline-secondary btn-sm"
                  onClick={() => setFilterEndDate("")}
                  title={t("clear")}
                >
                  ✕
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <ul className="list-group">
        {filteredMedications.length > 0 ? (
          filteredMedications.map((med) => (
            <li
              key={med.id}
              className="list-group-item d-flex justify-content-between align-items-start mb-2"
            >
              <div>
                <div>
                  <strong>{med.name}</strong>{" "}
                  <span
                    style={{
                      display: "inline-block",
                      width: "12px",
                      height: "12px",
                      borderRadius: "50%",
                      backgroundColor: med.active ? "green" : "red",
                      marginLeft: "8px",
                      verticalAlign: "middle",
                    }}
                    title={med.active ? t("active") : t("inactive")}
                  ></span>
                </div>

                <div>{t("doses")}: {med.doses}</div>
                <div>{t("frequency")}: {med.frequency}</div>
                <div>{t("duration")}: {med.days} {t("days_label")}</div>
                <div>{t("start_date")}: {parseDate(med.startDate)?.toLocaleDateString() || t("invalid_date")}</div>
                <div>{t("end_date")}: {parseDate(med.endDate)?.toLocaleDateString() || t("invalid_date")}</div>

                {med.additionalInfo && (
                  <div className="text-muted">
                    <small>{t("notes")}: {med.additionalInfo}</small>
                  </div>
                )}
              </div>
              <div className="d-flex gap-2">
                <button className="btn btn-sm btn-outline-primary" onClick={() => handleEdit(med.id)}>
                  <FaEdit />
                </button>
                <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(med.id)}>
                  <FaTrash />
                </button>
              </div>
            </li>
          ))
        ) : (
          <p className="text-muted">{t("no_matches")}</p>
        )}
      </ul>

      <button className="btn btn-secondary mt-3" onClick={() => navigate("/home")}>
        {t("back_home")}
      </button>
    </div>
  );
};

export default Medications;