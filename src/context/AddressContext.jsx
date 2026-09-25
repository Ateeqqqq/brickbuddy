import React, { createContext, useContext, useMemo, useState } from 'react';

const AddressContext = createContext(null);

const demoAddresses = [
  {
    id: 'address-home',
    fullName: 'BrickBuddy Customer',
    phone: '+91 98765 43210',
    addressLine1: '24 Lake View Road',
    addressLine2: 'Near Central Park',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560001',
    landmark: 'Opposite Lake View Park',
    addressType: 'Home',
    isDefault: true,
  },
];

export function AddressProvider({ children }) {
  const [addresses, setAddresses] = useState(demoAddresses);

  const addAddress = (address) => {
    setAddresses((currentAddresses) => {
      const isFirstAddress = currentAddresses.length === 0;
      const shouldBeDefault = isFirstAddress || address.isDefault;
      return [
        ...currentAddresses.map((item) => (
          shouldBeDefault ? { ...item, isDefault: false } : item
        )),
        {
          ...address,
          id: `address-${Date.now()}`,
          isDefault: shouldBeDefault,
        },
      ];
    });
  };

  const updateAddress = (addressId, updates) => {
    setAddresses((currentAddresses) => {
      const shouldBeDefault = updates.isDefault === true;
      return currentAddresses.map((item) => {
        if (item.id === addressId) return { ...item, ...updates, isDefault: shouldBeDefault || (updates.isDefault === undefined && item.isDefault) };
        return shouldBeDefault ? { ...item, isDefault: false } : item;
      });
    });
  };

  const deleteAddress = (addressId) => {
    setAddresses((currentAddresses) => {
      const deletedAddress = currentAddresses.find((item) => item.id === addressId);
      const remainingAddresses = currentAddresses.filter((item) => item.id !== addressId);
      if (deletedAddress?.isDefault && remainingAddresses.length > 0) {
        return remainingAddresses.map((item, index) => ({ ...item, isDefault: index === 0 }));
      }
      return remainingAddresses;
    });
  };

  const setDefaultAddress = (addressId) => {
    setAddresses((currentAddresses) => currentAddresses.map((item) => ({
      ...item,
      isDefault: item.id === addressId,
    })));
  };

  const defaultAddress = useMemo(
    () => addresses.find((address) => address.isDefault) || null,
    [addresses],
  );

  return (
    <AddressContext.Provider value={{ addresses, addAddress, updateAddress, deleteAddress, setDefaultAddress, defaultAddress }}>
      {children}
    </AddressContext.Provider>
  );
}

export function useAddresses() {
  const context = useContext(AddressContext);
  if (!context) throw new Error('useAddresses must be used within an AddressProvider');
  return context;
}
