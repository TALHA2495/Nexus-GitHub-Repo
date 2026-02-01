import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, PieChart, Filter, Search, PlusCircle, Check, X, Video } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Button } from '../../components/ui/Button';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { EntrepreneurCard } from '../../components/entrepreneur/EntrepreneurCard';
import { useAuth } from '../../context/AuthContext';
import { Meeting } from '../../types';
import { entrepreneurs } from '../../data/users';
import { getRequestsFromInvestor } from '../../data/collaborationRequests';

export const InvestorDashboard: React.FC = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  const [meetings, setMeetings] = useState<Meeting[]>([]);

  // Fetch meetings
  useEffect(() => {
    const fetchMeetings = async () => {
      if (!user) return;
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`http://localhost:5000/api/meetings/investor/${user.id}`, {
          headers: { 'x-auth-token': token }
        });
        setMeetings(res.data);
      } catch (err) {
        console.error('Error fetching meetings:', err);
      }
    };
    fetchMeetings();
  }, [user]);

  const handleAcceptMeeting = async (meetingId: string) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`http://localhost:5000/api/meetings/${meetingId}/status`,
        { status: 'confirmed' },
        { headers: { 'x-auth-token': token } }
      );
      toast.success('Meeting accepted');
      // Update local state
      setMeetings(prev => prev.map(m => m._id === meetingId ? { ...m, status: 'confirmed' } : m));
    } catch (error) {
      console.error('Error accepting meeting:', error);
      toast.error('Failed to accept meeting');
    }
  };

  const handleDeclineMeeting = async (meetingId: string) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`http://localhost:5000/api/meetings/${meetingId}/status`,
        { status: 'rejected' },
        { headers: { 'x-auth-token': token } }
      );
      toast.success('Meeting declined');
      // Update local state
      setMeetings(prev => prev.map(m => m._id === meetingId ? { ...m, status: 'rejected' } : m));
    } catch (error) {
      console.error('Error declining meeting:', error);
      toast.error('Failed to decline meeting');
    }
  };

  if (!user) return null;

  // Get collaboration requests sent by this investor
  const sentRequests = getRequestsFromInvestor(user.id);

  // Filter entrepreneurs based on search and industry filters
  const filteredEntrepreneurs = entrepreneurs.filter(entrepreneur => {
    // Search filter
    const matchesSearch = searchQuery === '' ||
      entrepreneur.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entrepreneur.startupName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entrepreneur.industry.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entrepreneur.pitchSummary.toLowerCase().includes(searchQuery.toLowerCase());

    // Industry filter
    const matchesIndustry = selectedIndustries.length === 0 ||
      selectedIndustries.includes(entrepreneur.industry);

    return matchesSearch && matchesIndustry;
  });

  // Get unique industries for filter
  const industries = Array.from(new Set(entrepreneurs.map(e => e.industry)));

  // Toggle industry selection
  const toggleIndustry = (industry: string) => {
    setSelectedIndustries(prevSelected =>
      prevSelected.includes(industry)
        ? prevSelected.filter(i => i !== industry)
        : [...prevSelected, industry]
    );
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Discover Startups</h1>
          <p className="text-gray-600">Find and connect with promising entrepreneurs</p>
        </div>

        <Link to="/entrepreneurs">
          <Button
            leftIcon={<PlusCircle size={18} />}
          >
            View All Startups
          </Button>
        </Link>
      </div>

      {/* Filters and search */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-2/3">
          <Input
            placeholder="Search startups, industries, or keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            fullWidth
            startAdornment={<Search size={18} />}
          />
        </div>

        <div className="w-full md:w-1/3">
          <div className="flex items-center space-x-2">
            <Filter size={18} className="text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Filter by:</span>

            <div className="flex flex-wrap gap-2">
              {industries.map(industry => (
                <div key={industry} onClick={() => toggleIndustry(industry)} className="cursor-pointer">
                  <Badge
                    variant={selectedIndustries.includes(industry) ? 'primary' : 'gray'}
                  >
                    {industry}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Stats summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-primary-50 border border-primary-100">
          <CardBody>
            <div className="flex items-center">
              <div className="p-3 bg-primary-100 rounded-full mr-4">
                <Users size={20} className="text-primary-700" />
              </div>
              <div>
                <p className="text-sm font-medium text-primary-700">Total Startups</p>
                <h3 className="text-xl font-semibold text-primary-900">{entrepreneurs.length}</h3>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="bg-secondary-50 border border-secondary-100">
          <CardBody>
            <div className="flex items-center">
              <div className="p-3 bg-secondary-100 rounded-full mr-4">
                <PieChart size={20} className="text-secondary-700" />
              </div>
              <div>
                <p className="text-sm font-medium text-secondary-700">Industries</p>
                <h3 className="text-xl font-semibold text-secondary-900">{industries.length}</h3>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="bg-accent-50 border border-accent-100">
          <CardBody>
            <div className="flex items-center">
              <div className="p-3 bg-accent-100 rounded-full mr-4">
                <Users size={20} className="text-accent-700" />
              </div>
              <div>
                <p className="text-sm font-medium text-accent-700">Your Connections</p>
                <h3 className="text-xl font-semibold text-accent-900">
                  {sentRequests.filter(req => req.status === 'accepted').length}
                </h3>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Meeting Requests */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-medium text-gray-900">Meeting Requests</h2>
        </CardHeader>
        <CardBody>
          {meetings.length === 0 ? (
            <p className="text-gray-500">No meetings scheduled.</p>
          ) : (
            <div className="space-y-4">
              {meetings.map((meeting) => (
                <div key={meeting._id} className="flex justify-between items-center bg-gray-50 p-4 rounded-lg">
                  <div>
                    <h3 className="font-semibold text-gray-900">{meeting.title}</h3>
                    <p className="text-sm text-gray-600">
                      With: {typeof meeting.entrepreneur === 'object' ? meeting.entrepreneur.name : 'Entrepreneur'}
                    </p>
                    <p className="text-sm text-gray-500">
                      Date: {new Date(meeting.scheduledDate).toLocaleString()}
                    </p>
                    <Badge variant={
                      meeting.status === 'confirmed' ? 'success' :
                        meeting.status === 'pending' ? 'warning' : 'gray'
                    }>
                      {meeting.status}
                    </Badge>
                  </div>
                  <div className="flex space-x-2">
                    {meeting.status === 'pending' && (
                      <>
                        <Button
                          size="sm"
                          variant="secondary"
                          leftIcon={<Check size={16} />}
                          onClick={() => handleAcceptMeeting(meeting._id)}
                        >
                          Accept
                        </Button>
                        <Button
                          size="sm"
                          variant="error"
                          leftIcon={<X size={16} />}
                          onClick={() => handleDeclineMeeting(meeting._id)}
                        >
                          Decline
                        </Button>
                      </>
                    )}
                    <Link to={`/meeting/${meeting._id}`}>
                      <Button
                        size="sm"
                        disabled={meeting.status !== 'confirmed'}
                        leftIcon={<Video size={16} />}
                      >
                        Join Meeting
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardBody>
      </Card>

      {/* Entrepreneurs grid */}
      <div>
        <Card>
          <CardHeader>
            <h2 className="text-lg font-medium text-gray-900">Featured Startups</h2>
          </CardHeader>

          <CardBody>
            {filteredEntrepreneurs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEntrepreneurs.map(entrepreneur => (
                  <EntrepreneurCard
                    key={entrepreneur.id}
                    entrepreneur={entrepreneur}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600">No startups match your filters</p>
                <Button
                  variant="outline"
                  className="mt-2"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedIndustries([]);
                  }}
                >
                  Clear filters
                </Button>
              </div>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
};