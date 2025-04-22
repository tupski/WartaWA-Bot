import React, { useState } from 'react';

const ContactsPage = () => {
  // Mock contacts data (in a real app, this would come from an API)
  const [contacts, setContacts] = useState([
    { id: 1, name: 'John Doe', phoneNumber: '1234567890' },
    { id: 2, name: 'Jane Smith', phoneNumber: '9876543210' },
    { id: 3, name: 'Alice Johnson', phoneNumber: '5551234567' },
  ]);
  
  const [newContact, setNewContact] = useState({ name: '', phoneNumber: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [currentContact, setCurrentContact] = useState(null);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewContact({ ...newContact, [name]: value });
  };

  const handleAddContact = (e) => {
    e.preventDefault();
    
    // Validate phone number
    const phoneRegex = /^\d{10,15}$/;
    if (!phoneRegex.test(newContact.phoneNumber.replace(/\D/g, ''))) {
      setError('Please enter a valid phone number (10-15 digits)');
      return;
    }
    
    if (!newContact.name) {
      setError('Please enter a name');
      return;
    }
    
    setError('');
    
    // Add new contact with a generated ID
    const newId = contacts.length > 0 ? Math.max(...contacts.map(c => c.id)) + 1 : 1;
    setContacts([...contacts, { ...newContact, id: newId }]);
    setNewContact({ name: '', phoneNumber: '' });
  };

  const handleEditClick = (contact) => {
    setIsEditing(true);
    setCurrentContact(contact);
    setNewContact({ name: contact.name, phoneNumber: contact.phoneNumber });
  };

  const handleUpdateContact = (e) => {
    e.preventDefault();
    
    // Validate phone number
    const phoneRegex = /^\d{10,15}$/;
    if (!phoneRegex.test(newContact.phoneNumber.replace(/\D/g, ''))) {
      setError('Please enter a valid phone number (10-15 digits)');
      return;
    }
    
    if (!newContact.name) {
      setError('Please enter a name');
      return;
    }
    
    setError('');
    
    // Update contact
    setContacts(
      contacts.map((contact) =>
        contact.id === currentContact.id
          ? { ...contact, name: newContact.name, phoneNumber: newContact.phoneNumber }
          : contact
      )
    );
    
    setIsEditing(false);
    setCurrentContact(null);
    setNewContact({ name: '', phoneNumber: '' });
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setCurrentContact(null);
    setNewContact({ name: '', phoneNumber: '' });
    setError('');
  };

  const handleDeleteContact = (id) => {
    if (window.confirm('Are you sure you want to delete this contact?')) {
      setContacts(contacts.filter((contact) => contact.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          {isEditing ? 'Edit Contact' : 'Add New Contact'}
        </h2>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        
        <form onSubmit={isEditing ? handleUpdateContact : handleAddContact} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={newContact.name}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Enter contact name"
              required
            />
          </div>
          
          <div>
            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <input
              type="text"
              id="phoneNumber"
              name="phoneNumber"
              value={newContact.phoneNumber}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="e.g., 1234567890"
              required
            />
          </div>
          
          <div className="flex space-x-2">
            <button
              type="submit"
              className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {isEditing ? 'Update Contact' : 'Add Contact'}
            </button>
            
            {isEditing && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>
      
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Contacts</h2>
        
        {contacts.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No contacts yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Phone Number
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {contacts.map((contact) => (
                  <tr key={contact.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {contact.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {contact.phoneNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEditClick(contact)}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteContact(contact.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactsPage;
