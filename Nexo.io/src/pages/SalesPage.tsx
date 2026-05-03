const SalesPage = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">💰 Ventas</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow p-6">
          <p className="text-gray-500 text-sm">Total ventas</p>
          <p className="text-3xl font-bold text-green-600">$0</p>
        </div>
        <div className="bg-white rounded-xl shadow p-6">
          <p className="text-gray-500 text-sm">Órdenes hoy</p>
          <p className="text-3xl font-bold text-blue-600">0</p>
        </div>
        <div className="bg-white rounded-xl shadow p-6">
          <p className="text-gray-500 text-sm">Promedio por orden</p>
          <p className="text-3xl font-bold text-purple-600">$0</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Órdenes recientes</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 border-b">
              <th className="pb-3">ID</th>
              <th className="pb-3">Cliente</th>
              <th className="pb-3">Productos</th>
              <th className="pb-3">Total</th>
              <th className="pb-3">Estado</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={5} className="text-center py-8 text-gray-400">
                No hay órdenes aún
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SalesPage;
