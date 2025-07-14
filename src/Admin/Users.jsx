import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Users() {
  const [users, setUsers] = useState([]);
  const [photographers, setPhotographers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;
  const [currentPagePhoto, setCurrentPagePhoto] = useState(1);
  const usersPerPagePhoto = 5;

useEffect(() => {
  const token = localStorage.getItem('token');
  axios.get('https://localhost:7037/api/Admin/users', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  .then(res => {
    if (res.data.success) {
      const allUsers = res.data.data;
      const customerUsers = allUsers.filter(user => user.role === 'Customer');
      const photographer = allUsers.filter(user => user.role === 'Photographer');
      setUsers(customerUsers);
      setPhotographers(photographer);
    } else {
      alert(res.data.message || "Something went wrong while fetching users.");
    }
  })
  .catch(err => {
    console.error('Error fetching users:', err);
    if (err.response && err.response.status === 401) {
      alert("Unauthorized. Please login again.");
    } else {
      alert("Server error. Please try again later.");
    }
  });
}, []); 



  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const indexOfLastUserPhoto = currentPagePhoto * usersPerPagePhoto;
  const indexOfFirstUserPhoto = indexOfLastUserPhoto - usersPerPagePhoto;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(users.length / usersPerPage);
  const currentPhotographer = photographers.slice(indexOfFirstUserPhoto, indexOfLastUserPhoto);
  const totalPagesPhotographer = Math.ceil(photographers.length / usersPerPagePhoto);

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(prev => prev - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
  };
  const handlePrevPagePhoto = () => {
    if (currentPagePhoto > 1) setCurrentPagePhoto(prev => prev - 1);
  };

  const handleNextPagePhoto = () => {
    if (currentPagePhoto < totalPagesPhotographer) setCurrentPagePhoto(prev => prev + 1);
  };

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white">
      <h1 className="text-2xl font-bold mb-4">Customer Users</h1>

      <div className="overflow-x-auto rounded-lg shadow-md border border-gray-700">
        <table className="min-w-full bg-gray-800 text-sm text-left">
          <thead className="bg-gray-700 text-gray-300 uppercase text-xs">
            <tr>
              <th className="px-6 py-3">#</th>
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Email</th>
              <th className="px-6 py-3">Role</th>
              <th className="px-6 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {currentUsers.length > 0 ? (
              currentUsers.map((user, index) => (
                <tr key={user.id} className="hover:bg-gray-700/40">
                  <td className="px-6 py-4">{indexOfFirstUser + index + 1}</td>
                  <td className="px-6 py-4">{user.name}</td>
                  <td className="px-6 py-4">{user.email}</td>
                  <td className="px-6 py-4">{user.role}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      user.status === 'Active' ? 'bg-green-500/20 text-green-400' :
                      user.status === 'Pending' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-gray-400">
                  No customer users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>


      <div className="flex justify-between items-center mt-4">
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded disabled:opacity-50"
        >
          Previous
        </button>

        <span className="text-sm text-gray-300">
          Page {currentPage} of {totalPages}
        </span>

        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>


      <h1 className="text-2xl font-bold mb-4 mt-10">Photographers</h1>
      <div className="overflow-x-auto rounded-lg  shadow-md border border-gray-700">
        <table className="min-w-full bg-gray-800 text-sm text-left">
          <thead className="bg-gray-700 text-gray-300 uppercase text-xs">
            <tr>
              <th className="px-6 py-3">#</th>
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Email</th>
              <th className="px-6 py-3">Role</th>
              <th className="px-6 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {currentPhotographer.length > 0 ? (
              currentPhotographer.map((user, index) => (
                <tr key={user.id} className="hover:bg-gray-700/40">
                  <td className="px-6 py-4">{indexOfFirstUserPhoto + index + 1}</td>
                  <td className="px-6 py-4">{user.name}</td>
                  <td className="px-6 py-4">{user.email}</td>
                  <td className="px-6 py-4">{user.role}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      user.status === 'Active' ? 'bg-green-500/20 text-green-400' :
                      user.status === 'Pending' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-gray-400">
                  No customer users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>


      <div className="flex justify-between items-center mt-4">
        <button
          onClick={handlePrevPagePhoto}
          disabled={currentPagePhoto === 1}
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded disabled:opacity-50"
        >
          Previous
        </button>

        <span className="text-sm text-gray-300">
          Page {currentPagePhoto} of {totalPagesPhotographer}
        </span>

        <button
          onClick={handleNextPagePhoto}
          disabled={currentPagePhoto === totalPagesPhotographer}
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
  }

export default Users;
