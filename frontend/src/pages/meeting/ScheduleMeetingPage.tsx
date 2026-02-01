import { useParams } from 'react-router-dom';
import { ScheduleMeeting } from '../../components/meeting/ScheduleMeeting';
import { useNavigate } from 'react-router-dom';

export const ScheduleMeetingPage = () => {
    const { investorId } = useParams<{ investorId: string }>();
    const navigate = useNavigate();

    // You can fetch investor details from your backend here
    // For now, using a placeholder name
    const investorName = 'Investor'; // Replace with actual fetch logic

    const handleClose = () => {
        navigate('/dashboard');
    };

    if (!investorId) {
        return <div>Invalid investor ID</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <ScheduleMeeting
                investorId={investorId}
                investorName={investorName}
                onClose={handleClose}
            />
        </div>
    );
};
