import { useState } from "react";
import ProductTable from "./ProductTable";
import OrderManagement from "./OrderMenagment";
import RatingsTable from "./RatingForm";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("");
  const [showTabs, setShowTabs] = useState(false);

  const tabs = [
    { id: "dashboard", label: "Produkte", icon: "bi bi-box-seam" },
    { id: "users", label: "Përdoruesit", icon: "bi bi-people" },
    { id: "order", label: "Porosit", icon: "bi bi-bag-check" },
    { id: "rates", label: "Vlerësimi", icon: "bi bi-star-half" },
    { id: "raport", label: "Raporti", icon: "bi bi-graph-up" },
  ];

  return (
    <div className="d-flex min-vh-100">
      {/* Sidebar */}
      <div
        className="bg-dark mt-5 text-white shadow transition-all"
        style={{
          width: showTabs ? "250px" : "60px",
          minHeight: "100vh",
          transition: "width 0.3s ease",
          padding: showTabs ? "1rem" : "0.5rem",
        }}
      >
        {showTabs && (
          <div className="mb-4 pb-3 border-bottom border-secondary">
            <h5 className="mb-0" style={{ fontSize: "18px" }}>
              <i className="bi bi-speedometer2 me-2"></i>
              Admin Panel
            </h5>
          </div>
        )}

        <div className="mb-3">
          <button
            className="btn mt-5 btn-outline-light w-100 d-flex align-items-center justify-content-center"
            onClick={() => setShowTabs((prev) => !prev)}
            style={{
              minHeight: "40px",
              padding: "0.5rem",
            }}
          >
            <i className="bi bi-list" style={{ fontSize: "1.2rem" }}></i>
            {showTabs && <span className="ms-2">Dashboard Menu</span>}
          </button>
        </div>

        {showTabs && (
          <div>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                className={`btn d-flex align-items-center w-100 mb-2 text-start ${
                  activeTab === tab.id
                    ? "btn-light text-dark"
                    : "btn-outline-light"
                }`}
                onClick={() => {
                  setActiveTab(tab.id);
                  setShowTabs(false);
                }}
                style={{ gap: "10px" }}
              >
                <i className={tab.icon}></i>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div
        className="flex-grow-1"
        style={{
          background:
            "linear-gradient(135deg,rgb(209, 209, 218) 0%,rgb(76, 107, 155) 100%)",
        }}
      >
        <div className="bg-dark shadow-sm p-3 border-bottom">
          <h4 className="mb-0">
            {activeTab === "dashboard" && "Menaxhimi i Produkteve"}
            {activeTab === "users" && "Menaxhimi i Përdoruesve"}
            {activeTab === "order" && "Menaxhimi i Porosive"}
            {activeTab === "rates" && "Vlerësimet"}
            {activeTab === "raport" && "Raportet"}
            {!activeTab && "Admin Dashboard"}
          </h4>
        </div>

        {/* Content Area */}
        <div className="p-4d">
          {activeTab === "dashboard" && (
            <div
              className=" rounded p-1 shadow-sm"
              style={{
                background: "transparent)",
              }}
            >
              <ProductTable />
            </div>
          )}

          {activeTab === "users" && (
            <div className="bg-transparent rounded p-4 shadow-sm">
              <div className="text-center py-4">
                <i
                  className="bi bi-people text-muted mb-3"
                  style={{ fontSize: "3rem" }}
                ></i>
                <h5>Menaxhimi i Përdoruesve</h5>
                <p className="text-muted">Përdoruesit do shfaqen këtu.</p>
              </div>
            </div>
          )}

          {activeTab === "order" && (
            <div className="bg-transparent rounded p-1 shadow-sm">
              <OrderManagement />
            </div>
          )}

          {activeTab === "rates" && (
            <div className="bg-transparent rounded p-1 shadow-sm">
             <RatingsTable/>
            </div>
          )}

          {activeTab === "raport" && (
            <div
              className=" rounded p-4 shadow-sm"
              style={{
                background: "transparent",
              }}
            >
              <div className="text-center py-1">
                <i
                  className="bi bi-graph-up text-muted mb-3"
                  style={{ fontSize: "3rem" }}
                ></i>
                <h5>Raportet</h5>
                <p className="text-muted">Raportet do shfaqen këtu.</p>
              </div>
            </div>
          )}

          {!activeTab && (
            <div
              className=" rounded p-4 shadow-sm"
              style={{
                background: "transparent)",
              }}
            >
              <div className="text-center py-1">
                <i
                  className="bi bi-speedometer2 text-primary mb-3"
                  style={{ fontSize: "4rem" }}
                ></i>
                <h3>Mirësevini në Admin Dashboard</h3>
                <p className="text-muted">
                  Zgjidhni një seksion nga menuja për të filluar.
                </p>

                <div className="row mt-4">
                  {tabs.map((tab) => (
                    <div key={tab.id} className="col-md-6 col-lg-4 mb-3">
                      <div
                        className="card h-100 border-0 shadow-sm"
                        style={{
                          cursor: "pointer",
                          background:
                            "linear-gradient(135deg,rgb(226, 226, 229) 0%,rgb(76, 107, 155) 100%)",
                        }}
                        onClick={() => setActiveTab(tab.id)}
                      >
                        <div className="card-body text-center">
                          <i
                            className={`${tab.icon} text-primary mb-2`}
                            style={{ fontSize: "2rem" }}
                          ></i>
                          <h6 className="card-title">{tab.label}</h6>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
