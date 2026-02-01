import React, { useState } from 'react';
import { io } from 'socket.io-client';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import axios from 'axios';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Calendar as CalendarIcon, Clock } from 'lucide-react';

interface ScheduleMeetingProps {
    investorId: string;
    investorName: string;
    onClose?: () => void;
}

export const ScheduleMeeting: React.FC<ScheduleMeetingProps> = ({
    investorId,
    investorName,
    onClose
}) => {
    // Existing state (DO NOT MODIFY)
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [title, setTitle] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    // ADDED: Calendar onChange handler - Line 27-33
    // Handle calendar date selection (value can be Date, Date[], Range, or null)
    const handleDateChange = (value: Date | Date[] | null | [Date | null, Date | null]) => {
        // Only update if value is a single Date (not array, not null, not range)
        if (value instanceof Date) {
            setSelectedDate(value);
        }
    };

    // ADDED: Booking function with Axios POST - Line 31-56
    const handleBooking = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            const token = localStorage.getItem('token');

            // In handleBooking function, inside try block, after successful axios post:
            const response = await axios.post(
                'http://localhost:5000/api/meetings/request',
                {
                    investorId,
                    title: title || `Meeting with ${investorName}`,
                    scheduledDate: selectedDate.toISOString()
                },
                {
                    headers: { 'x-auth-token': token }
                }
            );

            // Emit real-time notification
            const socket = io('http://localhost:5000');
            socket.emit('send-notification', {
                investorId,
                meetingData: response.data
            });
            // Disconnect socket after a short delay to ensure message is sent
            setTimeout(() => socket.disconnect(), 1000);

            setSuccess(true);
            setTimeout(() => {
                onClose?.();
            }, 2000);
        } catch (err) {
            const errorMessage = axios.isAxiosError(err)
                ? err.response?.data?.message
                : 'Failed to schedule meeting';
            setError(errorMessage || 'Failed to schedule meeting');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
            <div className="flex items-center mb-6">
                <CalendarIcon className="text-primary-600 mr-3" size={24} />
                <h2 className="text-2xl font-bold text-gray-900">Schedule Meeting</h2>
            </div>

            {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md">
                    {error}
                </div>
            )}

            {success && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-md">
                    Meeting request sent successfully!
                </div>
            )}

            <form onSubmit={handleBooking} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Meeting with: <span className="font-semibold">{investorName}</span>
                    </label>
                </div>

                <Input
                    label="Meeting Title (Optional)"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder={`Meeting with ${investorName}`}
                    fullWidth
                />

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Select Date & Time
                    </label>
                    {/* ADDED: Calendar component with onChange handler - Line 105-110 */}
                    <Calendar
                        onChange={handleDateChange}
                        value={selectedDate}
                        minDate={new Date()}
                        className="border rounded-lg shadow-sm"
                    />
                </div>

                <div className="flex items-center text-sm text-gray-600 mt-4">
                    <Clock size={16} className="mr-2" />
                    <span>
                        Selected: {selectedDate.toLocaleDateString()} at {selectedDate.toLocaleTimeString()}
                    </span>
                </div>

                <div className="flex space-x-3 pt-4">
                    <Button
                        type="submit"
                        fullWidth
                        isLoading={isLoading}
                        disabled={success}
                    >
                        {success ? 'Meeting Requested!' : 'Send Meeting Request'}
                    </Button>

                    {onClose && (
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            disabled={isLoading}
                        >
                            Cancel
                        </Button>
                    )}
                </div>
            </form>
        </div>
    );
};
