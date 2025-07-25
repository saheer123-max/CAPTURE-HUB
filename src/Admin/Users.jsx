import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Users() {
  const [users, setUsers] = useState([]);
  const [photographers, setPhotographers] = useState([]);
  const [unapprovedUsers, setUnapprovedUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPagePhoto, setCurrentPagePhoto] = useState(1);
  const [currentPageUnapproved, setCurrentPageUnapproved] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const usersPerPage = 5;
  const usersPerPagePhoto = 5;
  const usersPerPageUnapproved = 5;

const normalizeStatus = (status) => {
  if (status == null) return 'unknown';


  if (typeof status === 'string') return status.toLowerCase();

  if (typeof status === 'number') {
    switch (status) {
      case 1:
        return 'approved';
      case 0:
        return 'pending';
      case 2:
        return 'rejected';
      default:
        return 'unknown';
    }
  }


  if (typeof status === 'boolean') {
    return status ? 'approved' : 'pending';
  }

  return 'unknown';
};



  const getStatusBadge = (status) => {
    const normalizedStatus = normalizeStatus(status);
    switch (normalizedStatus) {
      case 'approved':
        return <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-500/20 text-green-400">Approved</span>;
      case 'pending':
        return <span className="px-2 py-1 rounded-full text-xs font-semibold bg-yellow-500/20 text-yellow-400">Pending</span>;
      case 'rejected':
        return <span className="px-2 py-1 rounded-full text-xs font-semibold bg-red-500/20 text-red-400">Rejected</span>;
      default:
        return <span className="px-2 py-1 rounded-full text-xs font-semibold bg-gray-500/20 text-gray-400">Unknown</span>;
    }
  };

  useEffect(() => {
    setIsLoading(true);
    const token = localStorage.getItem('token');

    Promise.all([
      axios.get('https://localhost:7037/api/Admin/users', {
        headers: { Authorization: `Bearer ${token}` },
      }),
      axios.get('https://localhost:7037/api/Admin/unapproved', {
        headers: { Authorization: `Bearer ${token}` },
      }),
    ])
      .then(([usersRes, unapprovedRes]) => {
        console.log('Approved Users Response:', usersRes.data);
        console.log('Unapproved Users Response:', unapprovedRes.data);

    
        if (usersRes.data.success) {
          const allUsers = usersRes.data.data;
          const customerUsers = allUsers.filter((user) => user.role.toLowerCase() === 'customer');
          const photographer = allUsers.filter((user) => user.role.toLowerCase() === 'photographer');
          setUsers(customerUsers);
          setPhotographers(photographer);
        } else {
          alert(usersRes.data.message || 'Something went wrong while fetching users.');
        }

       
        if (unapprovedRes.data.success) {
          const unapproved = unapprovedRes.data.data;
          setUnapprovedUsers(unapproved);
        } else {
          alert(unapprovedRes.data.message || 'Something went wrong while fetching unapproved users.');
        }
      })
      .catch((err) => {
        console.error('Error fetching data:', err);
        if (err.response && err.response.status === 401) {
          alert('Unauthorized. Please login again.');
        } else {
          alert('Server error. Please try again later.');
        }
      })
      .finally(() => setIsLoading(false));
  }, []);


  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const indexOfLastUserPhoto = currentPagePhoto * usersPerPagePhoto;
  const indexOfFirstUserPhoto = indexOfLastUserPhoto - usersPerPagePhoto;
  const indexOfLastUserUnapproved = currentPageUnapproved * usersPerPageUnapproved;
  const indexOfFirstUserUnapproved = indexOfLastUserUnapproved - usersPerPageUnapproved;

  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(users.length / usersPerPage);
  const currentPhotographer = photographers.slice(indexOfFirstUserPhoto, indexOfLastUserPhoto);
  const totalPagesPhotographer = Math.ceil(photographers.length / usersPerPagePhoto);
  const currentUnapproved = unapprovedUsers.slice(indexOfFirstUserUnapproved, indexOfLastUserUnapproved);
  const totalPagesUnapproved = Math.ceil(unapprovedUsers.length / usersPerPageUnapproved);

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const handlePrevPagePhoto = () => {
    if (currentPagePhoto > 1) setCurrentPagePhoto((prev) => prev - 1);
  };

  const handleNextPagePhoto = () => {
    if (currentPagePhoto < totalPagesPhotographer) setCurrentPagePhoto((prev) => prev + 1);
  };

  const handlePrevPageUnapproved = () => {
    if (currentPageUnapproved > 1) setCurrentPageUnapproved((prev) => prev - 1);
  };

  const handleNextPageUnapproved = () => {
    if (currentPageUnapproved < totalPagesUnapproved) setCurrentPageUnapproved((prev) => prev + 1);
  };

  const handleApproveUser = (userId) => {
    const token = localStorage.getItem('token');
    axios
      .put(
        `https://localhost:7037/api/Admin/approve/${userId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        console.log('Approve response:', res.data);
        if (res.data.success || res.status === 200) {
          alert('User approved successfully!');
          setUnapprovedUsers((prev) => prev.filter((user) => user.id !== userId));

          axios
            .get('https://localhost:7037/api/Admin/users', {
              headers: { Authorization: `Bearer ${token}` },
            })
            .then((res) => {
              if (res.data.success) {
                const allUsers = res.data.data;
                const customerUsers = allUsers.filter((user) => user.role.toLowerCase() === 'customer');
                const photographer = allUsers.filter((user) => user.role.toLowerCase() === 'photographer');
                setUsers(customerUsers);
                setPhotographers(photographer);
              } else {
                alert(res.data.message || 'Something went wrong while fetching users.');
              }
            })
            .catch((err) => {
              console.error('Error refetching users:', err);
              alert('Error refetching users. Please refresh the page.');
            });
        } else {
          alert(res.data.message || 'Something went wrong while approving user.');
        }
      })
      .catch((err) => {
        console.error('Error approving user:', err);
        if (err.response && err.response.status === 401) {
          alert('Unauthorized. Please login again.');
        } else {
          alert('Server error. Please try again later.');
        }
      });
  };

  const handleRejectUser = (userId) => {
    const token = localStorage.getItem('token');
    axios
      .post(
        `https://localhost:7037/api/Admin/reject/${userId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        if (res.data.success) {
          alert('User rejected successfully!');
          setUnapprovedUsers((prev) => prev.filter((user) => user.id !== userId));
        } else {
          alert(res.data.message || 'Something went wrong while rejecting user.');
        }
      })
      .catch((err) => {
        console.error('Error rejecting user:', err);
        if (err.response && err.response.status === 401) {
          alert('Unauthorized. Please login again.');
        } else {
          alert('Server error. Please try again later.');
        }
      });
  };

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white">
      {isLoading ? (
        <div className="text-center text-gray-400">Loading...</div>
      ) : (
        <>
 
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
                      <td className="px-6 py-4">{getStatusBadge(user.isApproved)}</td>
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
                {currentPhotographer.length > 0 ? (
                  currentPhotographer.map((user, index) => (
                    <tr key={user.id} className="hover:bg-gray-700/40">
                      <td className="px-6 py-4">{indexOfFirstUserPhoto + index + 1}</td>
                      <td className="px-6 py-4">{user.name}</td>
                      <td className="px-6 py-4">{user.email}</td>
                      <td className="px-6 py-4">{user.role}</td>
                      <td className="px-6 py-4">{getStatusBadge(user.isApproved)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-4 text-center text-gray-400">
                      No photographers found.
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

     
          <h1 className="text-2xl font-bold mb-4 mt-10">Unapproved Users</h1>
          <div className="overflow-x-auto rounded-lg shadow-md border border-gray-700">
            <table className="min-w-full bg-gray-800 text-sm text-left">
              <thead className="bg-gray-700 text-gray-300 uppercase text-xs">
                <tr>
                  <th className="px-6 py-3">#</th>
                  <th className="px-6 py-3">Name</th>
                  <th className="px-6 py-3">Email</th>
                  <th className="px-6 py-3">Role</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {currentUnapproved.length > 0 ? (
                  currentUnapproved.map((user, index) => (
                    <tr key={user.id} className="hover:bg-gray-700/40">
                      <td className="px-6 py-4">{indexOfFirstUserUnapproved + index + 1}</td>
                      <td className="px-6 py-4">{user.name}</td>
                      <td className="px-6 py-4">{user.email}</td>
                      <td className="px-6 py-4">{user.role}</td>
                      <td className="px-6 py-4">
                        
                          {console.log("STATUS DEBUG:", user.isApproved, "Normalized:", normalizeStatus(user.isApproved))}
                        {getStatusBadge(user.isApproved)}</td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleApproveUser(user.id)}
                            className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-xs rounded"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleRejectUser(user.id)}
                            className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs rounded"
                          >
                            Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center text-gray-400">
                      No unapproved users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex justify-between items-center mt-4">
            <button
              onClick={handlePrevPageUnapproved}
              disabled={currentPageUnapproved === 1}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-sm text-gray-300">
              Page {currentPageUnapproved} of {totalPagesUnapproved}
            </span>
            <button
              onClick={handleNextPageUnapproved}
              disabled={currentPageUnapproved === totalPagesUnapproved}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default Users;