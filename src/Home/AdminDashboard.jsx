  import React, { useState } from 'react';
  import { useNavigate } from 'react-router-dom'; 
  import { 
    Users, 
    Camera, 
    Calendar, 
    Image, 
    Settings, 
    BarChart3, 
    DollarSign, 
    FileText, 
    Mail, 
    Shield, 
    Activity,
    Plus,
    Edit,
    Trash2,
    Search,
    Filter,
    Download,
    Upload,
    Eye,
    MessageSquare,
    Bell,
    Menu,
    X,
    LogOut 
  } from 'lucide-react';

  const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('Dashboard');
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const navigate = useNavigate(); 


    const handleLogout = () => {
   
      navigate('/'); 
    };

    const sidebarItems = [
      { name: 'Dashboard', icon: <BarChart3 className="w-5 h-5" />, badge: null },
      { name: 'Users', icon: <Users className="w-5 h-5" />, badge: '1,234' },
      { name: 'Photographers', icon: <Camera className="w-5 h-5" />, badge: '56' },
      { name: 'Events', icon: <Calendar className="w-5 h-5" />, badge: '23' },
      { name: 'Media', icon: <Image className="w-5 h-5" />, badge: '8.2k' },
      { name: 'Bookings', icon: <FileText className="w-5 h-5" />, badge: '89' },
      { name: 'Messages', icon: <MessageSquare className="w-5 h-5" />, badge: '12' },
      { name: 'Analytics', icon: <Activity className="w-5 h-5" />, badge: null },
      { name: 'Settings', icon: <Settings className="w-5 h-5" />, badge: null },
    ];

    const stats = [
      { title: 'Total Users', value: '1,234', change: '+12%', icon: <Users className="w-6 h-6" />, color: 'bg-blue-500' },
      { title: 'Active Photographers', value: '56', change: '+8%', icon: <Camera className="w-6 h-6" />, color: 'bg-green-500' },
      { title: 'Monthly Revenue', value: '$24,890', change: '+23%', icon: <DollarSign className="w-6 h-6" />, color: 'bg-purple-500' },
      { title: 'Completed Events', value: '189', change: '+15%', icon: <Calendar className="w-6 h-6" />, color: 'bg-orange-500' },
    ];

   
    const recentEvents = [
      { title: 'Wedding Photography', client: 'Jennifer & Mark', date: '2024-07-15', status: 'Completed', price: '$2,500' },
      { title: 'Corporate Event', client: 'Tech Corp', date: '2024-07-18', status: 'Ongoing', price: '$1,800' },
      { title: 'Birthday Party', client: 'Smith Family', date: '2024-07-20', status: 'Scheduled', price: '$800' },
      { title: 'Fashion Shoot', client: 'Style Magazine', date: '2024-07-22', status: 'Scheduled', price: '$3,200' },
    ];

    const renderDashboard = () => (
      <div className="space-y-6">
     
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div key={index} className="bg-gray-800/50 backdrop-blur-md rounded-xl p-6 border border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">{stat.title}</p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                  <p className="text-green-400 text-sm mt-1">{stat.change}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg text-white`}>
                  {stat.icon}
                </div>
              </div>
            </div>
          ))}
        </div>


        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-gray-800/50 backdrop-blur-md rounded-xl p-6 border border-gray-700">
            <h3 className="text-xl font-semibold mb-4">Revenue Overview</h3>
            <div className="h-64 bg-gray-700/30 rounded-lg flex items-center justify-center">
              <p className="text-gray-400">Revenue Chart Placeholder</p>
            </div>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-md rounded-xl p-6 border border-gray-700">
            <h3 className="text-xl font-semibold mb-4">User Growth</h3>
            <div className="h-64 bg-gray-700/30 rounded-lg flex items-center justify-center">
              <p className="text-gray-400">Growth Chart Placeholder</p>
            </div>
          </div>
        </div>

  
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-gray-800/50 backdrop-blur-md rounded-xl p-6 border border-gray-700">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Recent Users</h3>
              <button className="text-purple-400 hover:text-purple-300">View All</button>
            </div>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-md rounded-xl p-6 border border-gray-700">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Recent Events</h3>
              <button className="text-purple-400 hover:text-purple-300">View All</button>
            </div>
            <div className="space-y-3">
              {recentEvents.map((event, index) => (
                <div key={index} className="p-3 bg-gray-700/30 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium">{event.title}</h4>
                    <span className="text-green-400 font-semibold">{event.price}</span>
                  </div>
                  <p className="text-sm text-gray-400 mb-1">{event.client}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">{event.date}</span>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      event.status === 'Completed' ? 'bg-green-500/20 text-green-400' :
                      event.status === 'Ongoing' ? 'bg-blue-500/20 text-blue-400' :
                      'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {event.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );

    const renderUsers = () => (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">User Management</h2>
          <button className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-2 rounded-lg font-semibold hover:scale-105 transition-transform flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add User
          </button>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-md rounded-xl border border-gray-700">
          <div className="p-6 border-b border-gray-700">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input 
                  type="text" 
                  placeholder="Search users..." 
                  className="w-full pl-10 pr-4 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  Filter
                </button>
                <button className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Export
                </button>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-700/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Joined</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
            </table>
          </div>
        </div>
      </div>
    );

    const renderContent = () => {
      switch (activeTab) {
        case 'Dashboard':
          return renderDashboard();
        case 'Users':
          return renderUsers();
        case 'Photographers':
          return <div className="text-center py-20"><p className="text-gray-400">Photographers management coming soon...</p></div>;
        case 'Events':
          return <div className="text-center py-20"><p className="text-gray-400">Events management coming soon...</p></div>;
        case 'Media':
          return <div className="text-center py-20"><p className="text-gray-400">Media management coming soon...</p></div>;
        case 'Bookings':
          return <div className="text-center py-20"><p className="text-gray-400">Bookings management coming soon...</p></div>;
        case 'Messages':
          return <div className="text-center py-20"><p className="text-gray-400">Messages management coming soon...</p></div>;
        case 'Analytics':
          return <div className="text-center py-20"><p className="text-gray-400">Analytics coming soon...</p></div>;
        case 'Settings':
          return <div className="text-center py-20"><p className="text-gray-400">Settings coming soon...</p></div>;
        default:
          return renderDashboard();
      }
    };

    return (
      <div className="min-h-screen bg-gray-900 text-white">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
          <div className="absolute top-40 right-20 w-48 h-48 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
          <div className="absolute bottom-20 left-20 w-32 h-32 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
        </div>

       
        <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-800/80 backdrop-blur-md border-r border-gray-700 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:translate-x-0`}>
          <div className="flex items-center justify-between p-4 border-b border-gray-700">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">Admin Panel</span>
            </div>
            <button 
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-gray-400 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <nav className="p-4">
            <div className="space-y-2">
              {sidebarItems.map((item) => (
               <button
  key={item.name}
  onClick={() => {
    if (item.name === 'Users') {
      navigate('/users'); 
    } else {
      setActiveTab(item.name); 
    }
  }}
  className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${
    activeTab === item.name
      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
      : 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
  }`}
>
  <div className="flex items-center space-x-3">
    {item.icon}
    <span>{item.name}</span>
  </div>
  {item.badge && (
    <span className="bg-gray-600 text-xs px-2 py-1 rounded-full">
      {item.badge}
    </span>
  )}
</button>

              ))}
            </div>
          </nav>
        </div>

    
        <div className="lg:ml-64">

          <header className="bg-gray-800/50 backdrop-blur-md border-b border-gray-700 sticky top-0 z-40">
            <div className="px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-16">
                <div className="flex items-center">
                  <button
                    onClick={() => setSidebarOpen(true)}
                    className="lg:hidden text-gray-400 hover:text-white"
                  >
                    <Menu className="w-6 h-6" />
                  </button>
                  <h1 className="ml-4 lg:ml-0 text-2xl font-bold">{activeTab}</h1>
                </div>
                
                <div className="flex items-center space-x-4">
                  <button className="relative p-2 text-gray-400 hover:text-white">
                    <Bell className="w-6 h-6" />
                    <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
                  </button>
                  <button className="p-2 text-gray-400 hover:text-white">
                    <Mail className="w-6 h-6" />
                  </button>
                  
     
                  <button 
                    onClick={handleLogout}
                    className="p-2 text-gray-400 hover:text-white flex items-center gap-1"
                    title="Log out"
                  >
                    <LogOut className="w-5 h-5" />
                    <span className="hidden sm:inline">Logout</span>
                  </button>
                  
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-sm font-semibold">AD</span>
                    </div>
                    <span className="hidden sm:block">Admin User</span>
                  </div>
                </div>
              </div>
            </div>
          </header>


          <main className="p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
              {renderContent()}
            </div>
          </main>
        </div>


        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          ></div>
        )}
      </div>
    );
  };

  export default AdminDashboard;