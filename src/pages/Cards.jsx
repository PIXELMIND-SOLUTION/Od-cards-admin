const Cards = () => {
  const mockCards = [
    { id: 1, title: "Premium Card", type: "Gold", status: "Active" },
    { id: 2, title: "Standard Card", type: "Silver", status: "Inactive" },
  ];
  return (
    <div className="container-fluid">
      <h2>Cards</h2>
      <div className="table-responsive">
        <table className="table table-bordered">
          <thead className="table-dark">
            <tr><th>ID</th><th>Title</th><th>Type</th><th>Status</th></tr>
          </thead>
          <tbody>
            {mockCards.map(card => (
              <tr key={card.id}>
                <td>{card.id}</td><td>{card.title}</td><td>{card.type}</td><td>{card.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export  default Cards;