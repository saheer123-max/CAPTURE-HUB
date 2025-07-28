import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useGlobalContext } from '../Globel/GlobalContext';

const CustomerList = ({ connection }) => {
  const [customers, setCustomers] = useState([]);
  const { setTargetUser } = useGlobalContext();

  // 🔁 SignalR listener: Customer list updated
  useEffect(() => {
    if (!connection) return;

    connection.on('CustomerListUpdated', async (customerIds) => {
      console.log('👥 CustomerListUpdated received:', customerIds);

      try {
        // API to get customer info by their IDs
        const response = await axios.post('https://localhost:7037/api/users/byIds', {
          ids: customerIds,
        });
        setCustomers(response.data);
      } catch (error) {
        console.error('❌ Failed to fetch customers:', error);
      }
    });
  }, [connection]);

  return (
    <div className="bg-gray-800 p-4 space-y-2 h-full overflow-y-auto">
      <h2 className="text-white font-bold mb-2">📋 Customers</h2>
      {customers.map((customer) => (
        <div
          key={customer.id}
          onClick={() => setTargetUser(customer)}
          className="cursor-pointer bg-gray-700 text-white p-3 rounded hover:bg-blue-600 transition"
        >
          {customer.name}
        </div>
      ))}
    </div>
  );
};

export default CustomerList;
