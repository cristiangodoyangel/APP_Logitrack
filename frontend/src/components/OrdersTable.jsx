import { useEffect, useRef } from "react";
import "datatables.net-bs5";
import "datatables.net-bs5/css/dataTables.bootstrap5.min.css";


export function OrdersTable({ data }) {
  const tableRef = useRef(null);

  useEffect(() => {
    if (tableRef.current) {
      $(tableRef.current).DataTable();
    }
  }, []);

  return (
    <div className="card border-0 shadow-sm mt-4">
      <div className="card-body">
        <h5>Historial de Pedidos</h5>
        <table ref={tableRef} className="table table-striped table-bordered">
          <thead>
            <tr>
              <th>ID</th>
              <th>Cliente</th>
              <th>Dirección</th>
              <th>Categoría</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {data.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.client}</td>
                <td>{order.address}</td>
                <td>{order.category}</td>
                <td>{order.urgent ? "Urgente" : "Normal"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
