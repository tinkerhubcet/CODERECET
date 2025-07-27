import React, { useState, useEffect } from 'react';
import { useUser } from '@/context/authProvider';
import api from '@/services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const AppointmentsComponent = () => {
  const { auth } = useUser();
  const [appointments, setAppointments] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [bookingNotes, setBookingNotes] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch user appointments
  const fetchAppointments = async () => {
    if (!auth?.userId) return;
    
    try {
      setLoading(true);
      const response = await api.post('/appointment/my-appointments', {
        limit: 20,
        offset: 0
      });
      
      if (response.data.success) {
        setAppointments(response.data.data.appointments);
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
      setError('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  // Fetch available slots for a specific date
  const fetchAvailableSlots = async (date) => {
    try {
      setLoadingSlots(true);
      const response = await api.post('/appointment/available-slots', {
        date: date
      });
      
      if (response.data.success) {
        setAvailableSlots(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching available slots:', error);
      setError('Failed to load available slots');
    } finally {
      setLoadingSlots(false);
    }
  };

  // Book an appointment
  const bookAppointment = async () => {
    if (!selectedSlot || !auth?.userId) return;

    try {
      setLoading(true);
      const response = await api.post('/appointment/book', {
        doctorId: selectedSlot.doctorId,
        appointmentTime: selectedSlot.datetime,
        notes: bookingNotes
      });

      if (response.data.success) {
        setSuccess('Appointment booked successfully!');
        setShowBookingForm(false);
        setSelectedSlot(null);
        setBookingNotes('');
        setSelectedDate('');
        fetchAppointments(); // Refresh appointments
      }
    } catch (error) {
      console.error('Error booking appointment:', error);
      setError(error.response?.data?.message || 'Failed to book appointment');
    } finally {
      setLoading(false);
    }
  };

  // Cancel an appointment
  const cancelAppointment = async (appointmentId) => {
    if (!auth?.userId) return;

    try {
      setLoading(true);
      const response = await api.post('/appointment/cancel', {
        appointmentId: appointmentId
      });

      if (response.data.success) {
        setSuccess('Appointment cancelled successfully!');
        fetchAppointments(); // Refresh appointments
      }
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      setError(error.response?.data?.message || 'Failed to cancel appointment');
    } finally {
      setLoading(false);
    }
  };

  // Handle date selection for slot search
  const handleDateChange = (date) => {
    setSelectedDate(date);
    if (date) {
      fetchAvailableSlots(date);
    }
  };

  // Format date for display
  const formatDateTime = (dateTime) => {
    return new Date(dateTime).toLocaleString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  // Format time from 24-hour to 12-hour format
  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const minute = minutes;
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour}:${minute} ${ampm}`;
  };

  // Extract time from ISO datetime and format it
  const formatTimeFromDatetime = (datetime) => {
    // Extract time portion from ISO string (e.g., "2025-07-29T09:00:00.000Z" -> "09:00:00")
    const timeString = datetime.split('T')[1].split('.')[0]; // Gets "09:00:00"
    return formatTime(timeString);
  };

  // Format date without time
  const formatDateOnly = (datetime) => {
    return new Date(datetime).toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Get status badge styling
  const getStatusBadge = (status) => {
    const styles = {
      SCHEDULED: 'bg-blue-100 text-blue-800',
      CONFIRMED: 'bg-green-100 text-green-800',
      COMPLETED: 'bg-gray-100 text-gray-800',
      CANCELLED: 'bg-red-100 text-red-800'
    };
    return styles[status] || 'bg-gray-100 text-gray-800';
  };

  useEffect(() => {
    fetchAppointments();
  }, [auth]);

  // Clear messages after 5 seconds
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError('');
        setSuccess('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  return (
    <div className="space-y-6">
      {/* Alert Messages */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
          {success}
        </div>
      )}

      {/* Appointments List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">My Appointments</h2>
          <Button 
            onClick={() => setShowBookingForm(true)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Schedule New Appointment
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : appointments.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No appointments scheduled. Book your first appointment!
          </div>
        ) : (
          <div className="space-y-4">
            {appointments.map((appointment) => (
              <div key={appointment.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">
                      {appointment.doctor.name} - {appointment.doctor.specialization}
                    </h3>
                    <p className="text-gray-600">
                      {formatDateOnly(appointment.appointment_time)}
                    </p>
                    <p className="text-gray-600 font-medium">
                      {formatTimeFromDatetime(appointment.appointment_time)}
                    </p>
                    <p className="text-sm text-gray-500">{appointment.doctor.hospital}</p>
                    {appointment.notes && (
                      <p className="text-sm text-gray-600 mt-2">
                        <span className="font-medium">Notes:</span> {appointment.notes}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-sm ${getStatusBadge(appointment.status)}`}>
                      {appointment.status}
                    </span>
                    {appointment.status === 'SCHEDULED' && (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => cancelAppointment(appointment.id)}
                        disabled={loading}
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Booking Form Modal */}
      {showBookingForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">Schedule New Appointment</h3>
                <Button
                  variant="ghost"
                  onClick={() => {
                    setShowBookingForm(false);
                    setSelectedSlot(null);
                    setSelectedDate('');
                    setBookingNotes('');
                  }}
                >
                  ×
                </Button>
              </div>

              {/* Date Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Date
                </label>
                <Input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => handleDateChange(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full"
                />
              </div>

              {/* Available Slots */}
              {selectedDate && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Available Time Slots
                  </label>
                  {loadingSlots ? (
                    <div className="flex justify-center py-4">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                    </div>
                  ) : availableSlots.length === 0 ? (
                    <p className="text-gray-500 py-4">No available slots for this date</p>
                  ) : (
                    <div className="space-y-4">
                      {availableSlots.map((doctor) => (
                        <div key={doctor.doctorId} className="border border-gray-200 rounded-lg p-4">
                          <h4 className="font-semibold text-gray-900 mb-2">
                            {doctor.doctorName} - {doctor.specialization}
                          </h4>
                          <p className="text-sm text-gray-600 mb-3">{doctor.hospital}</p>
                          <div className="grid grid-cols-3 gap-2">
                            {doctor.availableSlots.map((slot, index) => (
                              <Button
                                key={index}
                                variant={selectedSlot?.datetime === slot.datetime ? "default" : "outline"}
                                size="sm"
                                onClick={() => setSelectedSlot({
                                  ...slot,
                                  doctorId: doctor.doctorId,
                                  doctorName: doctor.doctorName,
                                  specialization: doctor.specialization,
                                  hospital: doctor.hospital
                                })}
                                className="text-xs"
                              >
                                {formatTime(slot.time)}
                              </Button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Notes */}
              {selectedSlot && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notes (Optional)
                  </label>
                  <textarea
                    value={bookingNotes}
                    onChange={(e) => setBookingNotes(e.target.value)}
                    placeholder="Any additional notes for the appointment..."
                    className="w-full p-3 border border-gray-300 rounded-lg resize-none h-20"
                  />
                </div>
              )}

              {/* Selected Appointment Summary */}
              {selectedSlot && (
                <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">Appointment Summary</h4>
                  <p className="text-blue-800">
                    <span className="font-medium">Doctor:</span> {selectedSlot.doctorName} ({selectedSlot.specialization})
                  </p>
                  <p className="text-blue-800">
                    <span className="font-medium">Hospital:</span> {selectedSlot.hospital}
                  </p>
                  <p className="text-blue-800">
                    <span className="font-medium">Date:</span> {new Date(selectedSlot.datetime).toLocaleDateString('en-IN', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                  <p className="text-blue-800">
                    <span className="font-medium">Time:</span> {formatTime(selectedSlot.time)}
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button
                  onClick={bookAppointment}
                  disabled={!selectedSlot || loading}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  {loading ? 'Booking...' : 'Book Appointment'}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowBookingForm(false);
                    setSelectedSlot(null);
                    setSelectedDate('');
                    setBookingNotes('');
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentsComponent;
