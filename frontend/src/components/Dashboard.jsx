import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

// API Base URL - ajustar según tu configuración
const API_BASE_URL = 'http://localhost:8000/api';

// Datos por defecto para categorías (esto podría venir de la API también)
const categoryData = [
  { name: "Comida", value: 45, color: "#007bff" },
  { name: "Farmacia", value: 25, color: "#28a745" },
  { name: "Supermercado", value: 20, color: "#ffc107" },
  { name: "Otros", value: 10, color: "#dc3545" }
];

export function Dashboard() {
  const [dashboardData, setDashboardData] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    deliveredOrders: 0,
    urgentOrders: 0,
    totalClients: 0,
    activeDrivers: 0,
    totalRevenue: 0
  });
  const [monthlyData, setMonthlyData] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Función para hacer llamadas a la API
  const fetchData = async (endpoint) => {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`);
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      return await response.json();
    } catch (err) {
      console.error(`Error fetching ${endpoint}:`, err);
      throw err;
    }
  };

  // Cargar todos los datos del dashboard
  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Cargar datos en paralelo
      const [stats, monthly, recent] = await Promise.all([
        fetchData('/dashboard/stats/'),
        fetchData('/dashboard/monthly/'),
        fetchData('/dashboard/recent/')
      ]);
      
      setDashboardData(stats);
      setMonthlyData(monthly);
      setRecentOrders(recent);
    } catch (err) {
      setError('Error al cargar los datos del dashboard');
      console.error('Dashboard data loading error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initialize tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
      return new window.bootstrap.Tooltip(tooltipTriggerEl);
    });
    
    // Cargar datos del dashboard
    loadDashboardData();
  }, []);

  const getStatusBadge = (status, urgent) => {
    const statusConfig = {
      pending: { label: "Pendiente", class: "bg-warning" },
      in_transit: { label: "En tránsito", class: "bg-info" },
      delivered: { label: "Entregado", class: "bg-success" }
    };

    return (
      <div className="d-flex align-items-center gap-1">
        {urgent && (
          <span className="badge bg-danger me-1">
            <i className="bi bi-exclamation-triangle me-1"></i>
            URGENTE
          </span>
        )}
        <span className={`badge ${statusConfig[status]?.class || 'bg-secondary'}`}>
          {statusConfig[status]?.label || 'Desconocido'}
        </span>
      </div>
    );
  };

  // Componente de carga
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="mt-3 text-muted">Cargando datos del dashboard...</p>
        </div>
      </div>
    );
  }

  // Componente de error
  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        <h4 className="alert-heading">Error al cargar datos</h4>
        <p>{error}</p>
        <hr />
        <button className="btn btn-outline-danger" onClick={loadDashboardData}>
          <i className="bi bi-arrow-clockwise me-2"></i>
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="row mb-4">
        <div className="col">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2>Dashboard</h2>
              <p className="text-muted">Resumen general del sistema de entregas</p>
            </div>
            <button className="btn btn-outline-primary" onClick={loadDashboardData}>
              <i className="bi bi-arrow-clockwise me-2"></i>
              Actualizar
            </button>
          </div>
        </div>
      </div>

      {/* Tarjetas de estadísticas principales */}
      <div className="row mb-4">
        <div className="col-md-3 mb-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <h6 className="card-title text-muted mb-1">Total Pedidos</h6>
                  <h3 className="mb-0">{dashboardData.totalOrders.toLocaleString()}</h3>
                  <small className="text-success">+12% desde el mes pasado</small>
                </div>
                <div className="text-primary">
                  <i className="bi bi-box-seam" style={{ fontSize: '2rem' }}></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-3 mb-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <h6 className="card-title text-muted mb-1">Pendientes</h6>
                  <h3 className="mb-0 text-warning">{dashboardData.pendingOrders}</h3>
                  <small className="text-muted">Esperando asignación</small>
                </div>
                <div className="text-warning">
                  <i className="bi bi-clock" style={{ fontSize: '2rem' }}></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-3 mb-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <h6 className="card-title text-muted mb-1">Entregados</h6>
                  <h3 className="mb-0 text-success">{dashboardData.deliveredOrders.toLocaleString()}</h3>
                  <small className="text-muted">94.4% tasa de éxito</small>
                </div>
                <div className="text-success">
                  <i className="bi bi-check-circle" style={{ fontSize: '2rem' }}></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-3 mb-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <h6 className="card-title text-muted mb-1">Urgentes</h6>
                  <h3 className="mb-0 text-danger">{dashboardData.urgentOrders}</h3>
                  <small className="text-muted">Requieren atención</small>
                </div>
                <div className="text-danger">
                  <i className="bi bi-exclamation-triangle" style={{ fontSize: '2rem' }}></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Segunda fila de estadísticas */}
      <div className="row mb-4">
        <div className="col-md-4 mb-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <h6 className="card-title">Clientes Activos</h6>
              <h4 className="mb-2">{dashboardData.totalClients}</h4>
              <div className="progress mb-2" style={{ height: '8px' }}>
                <div className="progress-bar" style={{ width: '78%' }}></div>
              </div>
              <small className="text-muted">78% con pedidos este mes</small>
            </div>
          </div>
        </div>

        <div className="col-md-4 mb-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <h6 className="card-title">Choferes Activos</h6>
              <h4 className="mb-2">{dashboardData.activeDrivers}</h4>
              <div className="progress mb-2" style={{ height: '8px' }}>
                <div className="progress-bar bg-success" style={{ width: '85%' }}></div>
              </div>
              <small className="text-muted">85% disponibles ahora</small>
            </div>
          </div>
        </div>

        <div className="col-md-4 mb-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <h6 className="card-title">Ingresos</h6>
              <h4 className="mb-2">${dashboardData.totalRevenue.toLocaleString()}</h4>
              <small className="text-success">+8.2% desde el mes pasado</small>
            </div>
          </div>
        </div>
      </div>

      {/* Gráficos */}
      <div className="row mb-4">
        <div className="col-lg-8 mb-3">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white">
              <h5 className="card-title mb-0">Pedidos por Mes</h5>
              <small className="text-muted">Evolución mensual de pedidos</small>
            </div>
            <div className="card-body">
              <div style={{ height: '300px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="orders" fill="#007bff" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-4 mb-3">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white">
              <h5 className="card-title mb-0">Pedidos por Categoría</h5>
              <small className="text-muted">Distribución por tipo</small>
            </div>
            <div className="card-body">
              <div style={{ height: '300px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pedidos recientes */}
      <div className="row">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white">
              <h5 className="card-title mb-0">Pedidos Recientes</h5>
              <small className="text-muted">Últimos pedidos registrados en el sistema</small>
            </div>
            <div className="card-body">
              <div className="list-group list-group-flush">
                {recentOrders.map((order, index) => (
                  <div key={order.id} className="list-group-item border-0 px-0">
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="d-flex align-items-center">
                        <div className="me-3">
                          <h6 className="mb-0">{order.id}</h6>
                          <small className="text-muted">{order.client}</small>
                        </div>
                      </div>
                      <div className="d-flex align-items-center gap-2">
                        <span className="badge bg-secondary">{order.category}</span>
                        {getStatusBadge(order.status, order.urgent)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}