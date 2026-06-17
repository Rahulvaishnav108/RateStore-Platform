import Sidebar from './Sidebar';

const Layout = ({ children }) => (
  <div className="flex h-screen overflow-hidden">
    <Sidebar />
    <main className="flex-1 overflow-y-auto bg-surface-50">
      <div className="p-6 lg:p-8 max-w-7xl mx-auto pt-16 lg:pt-8">
        {children}
      </div>
    </main>
  </div>
);

export default Layout;
