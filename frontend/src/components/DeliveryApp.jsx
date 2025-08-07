import React, { useState } from 'react';

// Mock data para pedidos asignados al chofer
const mockDeliveryOrders = [
  {
    id: "#12345",
    client: "Juan Pérez",
    clientPhone: "+54 9 11 1234-5678",
    address: "Av. Corrientes 1234, CABA",
    notes: "Timbre 4B, edificio azul",
    urgent: true,
    category: "Comida",
    estimatedTime: "15 min",
    distance: "2.1 km"
  },
  {
    id: "#12348",
    client: "Ana Rodríguez",
    clientPhone: "+54 9 11 4567-8901",
    address: "Calle Lavalle 890, Microcentro",
    notes: "Oficina en piso 3",
    urgent: true,
    category: "Documentos",
    estimatedTime: "8 min",
    distance: "1.3 km"
  }
];

export function DeliveryApp() {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [deliveryNotes, setDeliveryNotes] = useState("");
  const [locationNotes, setLocationNotes] = useState("");
  const [driverStatus, setDriverStatus] = useState("online");

  const handleOrderComplete = (orderId) => {
    alert(`Pedido ${orderId} marcado como entregado`);
    setSelectedOrder(null);
    setDeliveryNotes("");
    setLocationNotes("");
    // Close modal
    const modal = document.getElementById('completeDeliveryModal');
    if (modal && window.bootstrap) {
      const bsModal = window.bootstrap.Modal.getInstance(modal);
      if (bsModal) bsModal.hide();
    }
  };

  const handleOrderStart = (orderId) => {
    alert(`Iniciaste la entrega del pedido ${orderId}`);
  };

  const openCompleteModal = (order) => {
    setSelectedOrder(order);
    if (window.bootstrap) {
      const modal = new window.bootstrap.Modal(document.getElementById('completeDeliveryModal'));
      modal.show();
    }
  };

  const toggleDriverStatus = () => {
    const newStatus = driverStatus === "online" ? "offline" : "online";
    setDriverStatus(newStatus);
    alert(`Estado cambiado a: ${newStatus === "online" ? "En línea" : "Fuera de línea"}`);
  };

  return (
    <div className="container-fluid" style={{ maxWidth: '480px', margin: '0 auto' }}>
      {/* Header del chofer */}
      <div className="card border-0 shadow-sm mb-3">
        <div className="card-body">
          <div className="text-center mb-3">
            <h4 className="mb-1">App de Delivery</h4>
            <p className="text-muted mb-0">Panel de control para choferes</p>
          </div>
          <div className="d-flex align-items-center justify-content-between">
            <div>
              <h6 className="mb-1">Carlos Mendoza</h6>
              <small className="text-muted">Moto Honda 150cc</small>
            </div>
            <span className={`badge ${driverStatus === "online" ? "bg-success" : "bg-secondary"} fs-6`}>
              <i className="bi bi-circle-fill me-1"></i>
              {driverStatus === "online" ? "Disponible" : "Fuera de línea"}
            </span>
          </div>
        </div>
      </div>

      {/* Estadísticas del día */}
      <div className="row g-2 mb-3">
        <div className="col-4">
          <div className="card border-0 shadow-sm text-center">
            <div className="card-body py-3">
              <h5 className="mb-1">8</h5>
              <small className="text-muted">Entregas hoy</small>
            </div>
          </div>
        </div>
        <div className="col-4">
          <div className="card border-0 shadow-sm text-center">
            <div className="card-body py-3">
              <h5 className="mb-1 text-warning">2</h5>
              <small className="text-muted">Pendientes</small>
            </div>
          </div>
        </div>
        <div className="col-4">
          <div className="card border-0 shadow-sm text-center">
            <div className="card-body py-3">
              <h5 className="mb-1 text-success">$2,400</h5>
              <small className="text-muted">Ganado hoy</small>
            </div>
          </div>
        </div>
      </div>

      {/* Pedidos pendientes */}
      <div className="mb-3">
        <h5 className="mb-3">Pedidos Asignados</h5>
        
        {mockDeliveryOrders.map((order) => (
          <div key={order.id} className="card border-0 shadow-sm mb-3">
            <div className="card-body">
              {order.urgent && (
                <div className="mb-2">
                  <span className="badge bg-danger">
                    <i className="bi bi-exclamation-triangle me-1"></i>
                    URGENTE
                  </span>
                </div>
              )}
              
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div>
                  <h6 className="mb-1">{order.client}</h6>
                  <small className="text-muted">Pedido {order.id}</small>
                </div>
                <span className="badge bg-secondary">{order.category}</span>
              </div>

              <div className="mb-3">
                <div className="d-flex align-items-start mb-2">
                  <i className="bi bi-geo-alt me-2 text-muted mt-1"></i>
                  <small>{order.address}</small>
                </div>
                <div className="d-flex align-items-center mb-2">
                  <i className="bi bi-telephone me-2 text-muted"></i>
                  <small>
                    <a href={`tel:${order.clientPhone}`} className="text-decoration-none">
                      {order.clientPhone}
                    </a>
                  </small>
                </div>
                <div className="d-flex align-items-center justify-content-between text-muted">
                  <div className="d-flex align-items-center">
                    <i className="bi bi-clock me-1"></i>
                    <small>{order.estimatedTime}</small>
                  </div>
                  <div className="d-flex align-items-center">
                    <i className="bi bi-signpost me-1"></i>
                    <small>{order.distance}</small>
                  </div>
                </div>
              </div>

              {order.notes && (
                <div className="alert alert-light py-2 mb-3">
                  <div className="d-flex align-items-start">
                    <i className="bi bi-chat-square-text me-2 text-muted mt-1"></i>
                    <small>{order.notes}</small>
                  </div>
                </div>
              )}

              <div className="d-grid gap-2">
                <div className="row g-2">
                  <div className="col-6">
                    <button 
                      className="btn btn-outline-primary w-100"
                      onClick={() => handleOrderStart(order.id)}
                    >
                      <i className="bi bi-navigation me-2"></i>
                      Iniciar
                    </button>
                  </div>
                  <div className="col-6">
                    <button 
                      className="btn btn-success w-100"
                      onClick={() => openCompleteModal(order)}
                    >
                      <i className="bi bi-check-circle me-2"></i>
                      Entregar
                    </button>
                  </div>
                </div>
                <button className="btn btn-sm btn-outline-secondary">
                  <i className="bi bi-geo-alt me-2"></i>
                  Ver en mapa
                </button>
              </div>
            </div>
          </div>
        ))}

        {mockDeliveryOrders.length === 0 && (
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center py-4">
              <i className="bi bi-inbox text-muted mb-3" style={{ fontSize: '3rem' }}></i>
              <p className="text-muted mb-2">No hay pedidos asignados</p>
              <small className="text-muted">
                Mantente disponible para recibir nuevos pedidos
              </small>
            </div>
          </div>
        )}
      </div>

      {/* Control de estado */}
      <div className="card border-0 shadow-sm">
        <div className="card-body">
          <div className="d-flex align-items-center justify-content-between">
            <div>
              <h6 className="mb-1">Estado del chofer</h6>
              <small className="text-muted">Cambiar disponibilidad</small>
            </div>
            <button 
              className={`btn ${driverStatus === "online" ? "btn-outline-danger" : "btn-outline-success"}`}
              onClick={toggleDriverStatus}
            >
              {driverStatus === "online" ? "Ir offline" : "Ir online"}
            </button>
          </div>
        </div>
      </div>

      {/* Modal para completar entrega */}
      <div className="modal fade" id="completeDeliveryModal" tabIndex={-1}>
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Completar Entrega</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body">
              {selectedOrder && (
                <div className="mb-3">
                  <p><strong>Pedido:</strong> {selectedOrder.id}</p>
                  <p><strong>Cliente:</strong> {selectedOrder.client}</p>
                </div>
              )}
              <div className="mb-3">
                <label className="form-label">Nota de ubicación</label>
                <textarea
                  className="form-control"
                  rows={3}
                  placeholder="Ej: Portería del edificio, timbre 4B..."
                  value={locationNotes}
                  onChange={(e) => setLocationNotes(e.target.value)}
                ></textarea>
              </div>
              <div className="mb-3">
                <label className="form-label">Nota de entrega</label>
                <textarea
                  className="form-control"
                  rows={3}
                  placeholder="Ej: Entregado a la cliente, recibió conforme..."
                  value={deliveryNotes}
                  onChange={(e) => setDeliveryNotes(e.target.value)}
                ></textarea>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                Cancelar
              </button>
              <button
                type="button"
                className="btn btn-success"
                onClick={() => selectedOrder && handleOrderComplete(selectedOrder.id)}
              >
                <i className="bi bi-check-circle me-2"></i>
                Completar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}