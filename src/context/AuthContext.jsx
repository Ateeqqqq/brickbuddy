import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

const demoUser = {
  id: 'demo-customer',
  name: 'BrickBuddy Customer',
  email: 'demo@brickbuddy.in',
  phone: '',
  role: 'customer',
};

const demoVendor = {
  id: 'demo-vendor',
  name: 'Demo Vendor',
  email: 'vendor@brickbuddy.in',
  phone: '+91 98765 43210',
  role: 'vendor',
  businessName: 'Hyderabad BuildMart',
  location: 'Hyderabad, Telangana',
};

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [registeredUsers, setRegisteredUsers] = useState([]);

  const login = async (email, password) => {
    await new Promise((resolve) => setTimeout(resolve, 450));
    const normalizedEmail = email.trim().toLowerCase();
    const registeredUser = registeredUsers.find((user) => user.email === normalizedEmail && user.password === password);
    const isDemoLogin = normalizedEmail === demoUser.email && password === 'BrickBuddy123!';
    const isDemoVendorLogin = normalizedEmail === demoVendor.email && password === 'BrickBuddyVendor123!';

    if (!registeredUser && !isDemoLogin && !isDemoVendorLogin) {
      throw new Error('Unable to sign in with those details. Try registering or use the demo account.');
    }

    if (registeredUser) {
      const safeUser = { ...registeredUser };
      delete safeUser.password;
      setCurrentUser(safeUser);
    } else if (isDemoLogin) {
      setCurrentUser(demoUser);
    } else {
      setCurrentUser(demoVendor);
    }
  };

  const register = async ({ name, email, phone, password }) => {
    await new Promise((resolve) => setTimeout(resolve, 550));
    const normalizedEmail = email.trim().toLowerCase();
    if ([demoUser.email, demoVendor.email].includes(normalizedEmail) || registeredUsers.some((user) => user.email === normalizedEmail)) {
      throw new Error('An account with this email already exists. Please log in.');
    }

    const user = {
      id: `customer-${Date.now()}`,
      name: name.trim(),
      email: normalizedEmail,
      phone: phone.trim(),
      role: 'customer',
    };

    setRegisteredUsers((users) => [...users, { ...user, password }]);
    setCurrentUser(user);
  };

  const logout = () => setCurrentUser(null);
  const updateProfile = (updates) => {
    setCurrentUser((user) => (user ? { ...user, ...updates } : user));
    setRegisteredUsers((users) => users.map((user) => (
      currentUser && user.id === currentUser.id ? { ...user, ...updates } : user
    )));
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: Boolean(currentUser),
        login,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
