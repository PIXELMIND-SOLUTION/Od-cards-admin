// Orders.jsx
const Orders = () => {
  const mockOrders = [
    { id: 101, customer: "John", amount: 299, date: "2025-07-10" },
    { id: 102, customer: "Jane", amount: 499, date: "2025-07-09" },
  ];
  return (
    <div className="container-fluid">
      <h2>Orders</h2>
      <div className="table-responsive">
        <table className="table table-bordered">
          <thead className="table-dark">
            <tr><th>Order ID</th><th>Customer</th><th>Amount</th><th>Date</th></tr>
          </thead>
          <tbody>
            {mockOrders.map(o => (
              <tr key={o.id}>
                <td>{o.id}</td><td>{o.customer}</td><td>${o.amount}</td><td>{o.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Orders;