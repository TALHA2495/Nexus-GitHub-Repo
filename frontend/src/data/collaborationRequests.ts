import { CollaborationRequest } from '../types';

export const collaborationRequests: CollaborationRequest[] = [
  {
    id: 'req1',
    investorId: 'i1',
    entrepreneurId: 'e1',
    message: 'Id like to explore potential investment in TechWave AI. Your AI-driven financial analytics platform aligns well with my investment thesis.',
    status: 'pending',
    createdAt: '2023-08-10T15:30:00Z'
  },
  {
    id: 'req2',
    investorId: 'i2',
    entrepreneurId: 'e1',
    message: 'Interested in discussing how TechWave AI can incorporate sustainable practices. Lets connect to explore potential collaboration.',
    status: 'accepted',
    createdAt: '2023-08-05T11:45:00Z'
  },
  {
    id: 'req3',
    investorId: 'i3',
    entrepreneurId: 'e3',
    message: 'Your HealthPulse platform addresses a critical need in mental healthcare. Id like to learn more about your traction and roadmap.',
    status: 'pending',
    createdAt: '2023-08-12T09:20:00Z'
  },
  {
    id: 'req4',
    investorId: 'i2',
    entrepreneurId: 'e2',
    message: 'GreenLifes biodegradable packaging solutions align with my focus on sustainable investments. Lets discuss scaling possibilities.',
    status: 'accepted',
    createdAt: '2023-07-28T14:15:00Z'
  },
  {
    id: 'req5',
    investorId: 'i1',
    entrepreneurId: 'e4',
    message: 'Your UrbanFarm concept is fascinating. Im interested in learning more about your IoT implementation and market validation.',
    status: 'rejected',
    createdAt: '2023-08-03T16:50:00Z'
  }
];

// Helper function to get collaboration requests for an entrepreneur
export const getRequestsForEntrepreneur = (entrepreneurId: string): CollaborationRequest[] => {
  return collaborationRequests
    .filter(request => request.entrepreneurId === entrepreneurId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

// Helper function to get collaboration requests sent by an investor
export const getRequestsFromInvestor = (investorId: string): CollaborationRequest[] => {
  return collaborationRequests
    .filter(request => request.investorId === investorId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

// Helper function to update a collaboration request status
export const updateRequestStatus = (requestId: string, newStatus: 'pending' | 'accepted' | 'rejected'): CollaborationRequest | null => {
  const requestIndex = collaborationRequests.findIndex(req => req.id === requestId);
  if (requestIndex === -1) return null;
  
  collaborationRequests[requestIndex] = {
    ...collaborationRequests[requestIndex],
    status: newStatus
  };
  
  return collaborationRequests[requestIndex];
};

// Helper function to create a new collaboration request
export const createCollaborationRequest = (
  investorId: string,
  entrepreneurId: string,
  message: string
): CollaborationRequest => {
  const newRequest: CollaborationRequest = {
    id: `req${collaborationRequests.length + 1}`,
    investorId,
    entrepreneurId,
    message,
    status: 'pending',
    createdAt: new Date().toISOString()
  };
  
  collaborationRequests.push(newRequest);
  return newRequest;
};