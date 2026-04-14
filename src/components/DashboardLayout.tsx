import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import AIAssistant from '@/components/AIAssistant';
import {
  LayoutDashboard, Calendar, Ticket, Users, BarChart3, MapPin, Tag,
  LogOut, Menu, MessageSquare, User, X, Settings, Plus, ChevronLeft,
} from 'lucide-react';
import { useState } from 'react';

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const { role, user, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['admin', 'organizer', 'participant'] },
    { path: '/events', label: 'Events', icon: Calendar, roles: ['admin', 'organizer', 'participant'] },
    { path: '/bookings', label: 'My Bookings', icon: Ticket, roles: ['participant'] },
    { path: '/my-events', label: 'My Events', icon: Calendar, roles: ['organizer'] },
    { path: '/users', label: 'Users', icon: Users, roles: ['admin'] },
    { path: '/venues', label: 'Venues', icon: MapPin, roles: ['admin'] },
    { path: '/categories', label: 'Categories', icon: Tag, roles: ['admin'] },
    { path: '/analytics', label: 'Analytics', icon: BarChart3, roles: ['admin'] },
    { path: '/feedback', label: 'Feedback', icon: MessageSquare, roles: ['participant'] },
    { path: '/profile', label: 'My Profile', icon: User, roles: ['admin', 'organizer', 'participant'] },
  ];

  const filtered = navItems.filter(n => n.roles.includes(role || ''));

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  return (
    <div className="min-h-screen bg-background flex">
      {sidebarOpen && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 ${collapsed ? 'w-[68px]' : 'w-64'} glass-strong border-r border-border/50 transform transition-all duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} flex flex-col`}>
        {/* Logo */}
        <div className={`p-4 border-b border-border/50 ${collapsed ? 'px-3' : 'px-5'}`}>
          <Link to="/dashboard" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-primary flex items-center justify-center shadow-lg shadow-primary/20 flex-shrink-0">
              <Calendar className="w-5 h-5 text-primary-foreground" />
            </div>
            {!collapsed && <span className="text-lg font-heading font-bold text-gradient">EventHub</span>}
          </Link>
          {!collapsed && (
            <p className="text-[10px] text-muted-foreground mt-1.5 uppercase tracking-wider font-medium px-0.5">{role} Dashboard</p>
          )}
        </div>

        {/* Nav */}
        <nav className={`flex-1 ${collapsed ? 'p-2' : 'p-3'} space-y-0.5 overflow-y-auto`}>
          {filtered.map(item => {
            const isActive = location.pathname === item.path;
            return (
              <Link key={item.path} to={item.path}
                onClick={() => setSidebarOpen(false)}
                title={collapsed ? item.label : undefined}
                className={`flex items-center gap-3 ${collapsed ? 'justify-center px-2' : 'px-3'} py-2.5 rounded-xl text-sm transition-premium group relative ${
                  isActive
                    ? 'bg-primary/10 text-primary glow-border'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                }`}>
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-gradient-primary rounded-r-full" />
                )}
                <item.icon className={`w-[18px] h-[18px] flex-shrink-0 ${isActive ? 'text-primary' : 'group-hover:text-foreground'}`} />
                {!collapsed && <span className="font-medium">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Collapse toggle (desktop) */}
        <div className="hidden lg:block px-3 py-2 border-t border-border/50">
          <button onClick={() => setCollapsed(!collapsed)}
            className="w-full flex items-center justify-center py-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-premium">
            <ChevronLeft className={`w-4 h-4 transition-transform duration-300 ${collapsed ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* User */}
        <div className={`${collapsed ? 'p-2' : 'p-3'} border-t border-border/50`}>
          {!collapsed ? (
            <>
              <div className="flex items-center gap-3 mb-3 px-2">
                <div className="w-9 h-9 rounded-xl bg-gradient-primary flex items-center justify-center text-primary-foreground text-sm font-bold flex-shrink-0">
                  {user?.email?.[0].toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{user?.email}</p>
                  <p className="text-[10px] text-muted-foreground capitalize">{role}</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" className="w-full justify-start text-muted-foreground hover:text-foreground" onClick={handleSignOut}>
                <LogOut className="w-4 h-4 mr-2" /> Sign Out
              </Button>
            </>
          ) : (
            <button onClick={handleSignOut} title="Sign Out"
              className="w-full flex items-center justify-center py-2.5 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-premium">
              <LogOut className="w-[18px] h-[18px]" />
            </button>
          )}
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 min-w-0 flex flex-col">
        <header className="sticky top-0 z-30 glass-strong border-b border-border/50 px-6 py-3 flex items-center gap-4">
          <button className="lg:hidden text-foreground hover:text-primary transition-premium" onClick={() => setSidebarOpen(true)}>
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex-1" />
          <div className="flex items-center gap-2">
            {(role === 'organizer' || role === 'admin') && (
              <Button size="sm" className="bg-gradient-primary hover:opacity-90 gap-1.5 shadow-md shadow-primary/20 transition-premium" onClick={() => navigate('/events')}>
                <Plus className="w-4 h-4" /> New Event
              </Button>
            )}
          </div>
        </header>
        <div className="flex-1 p-6">
          {children}
        </div>
      </main>

      {/* AI Assistant */}
      <AIAssistant />
    </div>
  );
};

export default DashboardLayout;
