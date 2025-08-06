'use client'

const Cards = () => {
  const cardData = [
    { title: 'Total Revenue', value: '$12,345', change: '+12%', icon: '💰', color: 'var(--primary)' },
    { title: 'Total Orders', value: '1,234', change: '+8%', icon: '🛒', color: 'var(--secondary)' },
    { title: 'Total Customers', value: '567', change: '+5%', icon: '👥', color: 'var(--success)' },
    { title: 'Transactions', value: '2,345', change: '+3%', icon: '💳', color: 'var(--warning)' },
  ];

  return (
    <div 
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '1rem',
        marginBottom: '2rem',
      }}
    >
      {cardData.map((card, index) => (
        <div 
          key={index}
          style={{
            backgroundColor: 'var(--card-bg)',
            padding: '1.5rem',
            borderRadius: '0.5rem',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            transition: 'transform 0.3s ease',
          }}
          className="hover:transform hover:scale-105"
        >
          <div className="flex justify-between items-start">
            <div>
              <p style={{ color: 'var(--text-color)', opacity: 0.8, fontSize: '0.9rem' }}>{card.title}</p>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: '0.5rem 0' }}>{card.value}</h3>
              <p style={{ color: card.change.startsWith('+') ? 'green' : 'red', fontSize: '0.9rem' }}>
                {card.change} from last month
              </p>
            </div>
            <div 
              style={{
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                backgroundColor: `${card.color}20`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
                color: card.color,
              }}
            >
              {card.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Cards;