import React from 'react';
import axios from 'axios';

const SERVER_URL = process.env.REACT_APP_SERVER_URL; // Ensure this is set in your .env

const PledgeModal = ({ isOpen, onClose,setToast }) => {
  const [formData, setFormData] = React.useState({
    name: '',
    phoneNumber: '',
    purpose: '',
    amount: '',
  });

  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await axios.post(`${SERVER_URL}/api/pledges`, formData);
      setToast({
        type: 'success',
        message: res.data.message || 'Pledge submitted successfully!',
      });
      setFormData({ name: '', phoneNumber: '', purpose: '', amount: '' });
      onClose();
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
  <>
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
     
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-red-600 text-xl font-bold"
        >
          ×
        </button>
        <h2 className="text-2xl font-bold mb-4 text-center text-green-700">Make a Pledge</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Contributor Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded"
          />
          <input
            type="tel"
            name="phoneNumber"
            placeholder="Phone Number"
            value={formData.phoneNumber}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded"
          />
          <input
            type="text"
            name="purpose"
            placeholder="Pledge Purpose (e.g. Church Renovation)"
            value={formData.purpose}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded"
          />
          <input
            type="number"
            name="amount"
            placeholder="Pledge Amount"
            value={formData.amount}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-700 text-white py-2 rounded hover:bg-green-800 transition"
          >
            {loading ? 'Submitting...' : 'Submit Pledge'}
          </button>

          {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
        </form>
      </div>
    </div>
    </>
  );
};

export default PledgeModal;
