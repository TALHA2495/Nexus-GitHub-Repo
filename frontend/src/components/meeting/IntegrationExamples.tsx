import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Video } from 'lucide-react';
import { Button } from '../ui/Button';

/**
 * Example component showing how to integrate meeting scheduling
 * and video calling into your investor/entrepreneur pages
 */

interface InvestorCardExampleProps {
    investor: {
        id: string;
        name: string;
        company?: string;
        avatarUrl?: string;
    };
}

export const InvestorCardExample: React.FC<InvestorCardExampleProps> = ({ investor }) => {
    const navigate = useNavigate();

    // Navigate to meeting scheduling page
    const handleScheduleMeeting = () => {
        navigate(`/meeting/schedule/${investor.id}`);
    };

    // Navigate to video call (use meeting ID or investor ID as room)
    const handleStartVideoCall = () => {
        // Option 1: Use investor ID as room (quick call)
        navigate(`/meeting/video/${investor.id}`);

        // Option 2: Use specific meeting ID (scheduled meeting)
        // navigate(`/meeting/video/${meetingId}`);
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center mb-4">
                {investor.avatarUrl && (
                    <img
                        src={investor.avatarUrl}
                        alt={investor.name}
                        className="w-16 h-16 rounded-full mr-4"
                    />
                )}
                <div>
                    <h3 className="text-xl font-semibold text-gray-900">{investor.name}</h3>
                    {investor.company && (
                        <p className="text-sm text-gray-600">{investor.company}</p>
                    )}
                </div>
            </div>

            <div className="flex space-x-3">
                {/* Schedule Meeting Button */}
                <Button
                    onClick={handleScheduleMeeting}
                    variant="primary"
                    size="sm"
                    leftIcon={<Calendar size={16} />}
                    fullWidth
                >
                    Schedule Meeting
                </Button>

                {/* Quick Video Call Button */}
                <Button
                    onClick={handleStartVideoCall}
                    variant="secondary"
                    size="sm"
                    leftIcon={<Video size={16} />}
                    fullWidth
                >
                    Video Call
                </Button>
            </div>
        </div>
    );
};

/**
 * Example: How to add video call button to existing ChatPage
 * 
 * In your ChatPage.tsx, update the video button:
 */

export const ChatPageVideoButtonExample = () => {
    const navigate = useNavigate();
    const userId = 'example-user-id'; // Get from useParams or props

    return (
        <Button
            variant="ghost"
            size="sm"
            className="rounded-full p-2"
            aria-label="Video call"
            onClick={() => navigate(`/meeting/video/${userId}`)}
        >
            <Video size={18} />
        </Button>
    );
};

/**
 * Example: Display scheduled meetings list
 */

interface Meeting {
    _id: string;
    title: string;
    scheduledDate: string;
    status: 'pending' | 'confirmed' | 'rejected' | 'completed';
    investor: {
        name: string;
    };
}

interface MeetingsListExampleProps {
    meetings: Meeting[];
}

export const MeetingsListExample: React.FC<MeetingsListExampleProps> = ({ meetings }) => {
    const navigate = useNavigate();

    const handleJoinMeeting = (meetingId: string) => {
        navigate(`/meeting/video/${meetingId}`);
    };

    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">Scheduled Meetings</h2>

            {meetings.length === 0 ? (
                <p className="text-gray-500">No scheduled meetings</p>
            ) : (
                meetings.map((meeting) => (
                    <div
                        key={meeting._id}
                        className="bg-white rounded-lg shadow p-4 flex justify-between items-center"
                    >
                        <div>
                            <h3 className="font-semibold text-gray-900">{meeting.title}</h3>
                            <p className="text-sm text-gray-600">
                                {new Date(meeting.scheduledDate).toLocaleString()}
                            </p>
                            <span className={`text-xs px-2 py-1 rounded-full ${meeting.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                                    meeting.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                        'bg-gray-100 text-gray-800'
                                }`}>
                                {meeting.status}
                            </span>
                        </div>

                        {meeting.status === 'confirmed' && (
                            <Button
                                onClick={() => handleJoinMeeting(meeting._id)}
                                variant="primary"
                                size="sm"
                                leftIcon={<Video size={16} />}
                            >
                                Join Call
                            </Button>
                        )}
                    </div>
                ))
            )}
        </div>
    );
};
