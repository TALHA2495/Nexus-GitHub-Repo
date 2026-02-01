# Meeting & Video Call Implementation Guide

## Overview
This implementation provides a complete meeting scheduling and video calling system for your MERN investor platform using:
- **Backend**: Express.js, Socket.io, MongoDB
- **Frontend**: React, TypeScript, Socket.io-client, PeerJS, react-calendar

---

## 🎯 Features Implemented

### 1. Meeting Scheduling
- ✅ Calendar-based date/time selection using `react-calendar`
- ✅ Meeting request API endpoint
- ✅ JWT authentication for secure requests
- ✅ MongoDB storage for meeting data

### 2. Video Calling
- ✅ Real-time peer-to-peer video using WebRTC
- ✅ Socket.io for signaling
- ✅ PeerJS for simplified WebRTC implementation
- ✅ Mute/unmute audio
- ✅ Enable/disable video
- ✅ End call functionality

---

## 📁 Files Created/Modified

### Backend Files
1. **`backend/server.js`** - Added Socket.io server setup
2. **`backend/routes/meeting.js`** - Meeting request endpoint (already existed)
3. **`backend/models/Meeting.js`** - Meeting schema (should already exist)

### Frontend Files
1. **`frontend/src/components/meeting/ScheduleMeeting.tsx`** - Calendar component
2. **`frontend/src/components/meeting/VideoCall.tsx`** - Video call component
3. **`frontend/src/pages/meeting/ScheduleMeetingPage.tsx`** - Wrapper page
4. **`frontend/src/App.tsx`** - Added meeting routes

---

## 🚀 Setup Instructions

### Step 1: Install PeerJS Server (Required for Video Calls)

You need to run a PeerJS server on port 9000. Open a **new terminal** and run:

```bash
npx peerjs --port 9000
```

**Keep this terminal running** while testing video calls.

### Step 2: Start Backend Server

```bash
cd backend
npm start
```

The server will run on `http://localhost:5000` with Socket.io enabled.

### Step 3: Start Frontend

```bash
cd frontend
npm run dev
```

The frontend will run on `http://localhost:5173`.

---

## 📋 API Endpoints

### POST `/api/meetings/request`
Schedule a meeting request.

**Headers:**
```
x-auth-token: <JWT_TOKEN>
```

**Request Body:**
```json
{
  "investorId": "investor_user_id",
  "title": "Meeting with Investor Name",
  "scheduledDate": "2026-02-15T14:30:00.000Z"
}
```

**Response:**
```json
{
  "_id": "meeting_id",
  "entrepreneur": "entrepreneur_user_id",
  "investor": "investor_user_id",
  "title": "Meeting with Investor Name",
  "scheduledDate": "2026-02-15T14:30:00.000Z",
  "status": "pending"
}
```

---

## 🎨 Usage Examples

### 1. Schedule a Meeting

Navigate to:
```
/meeting/schedule/:investorId
```

Example:
```
http://localhost:5173/meeting/schedule/65abc123def456789
```

**What happens:**
1. User sees a calendar interface
2. Selects date and time
3. Optionally enters a meeting title
4. Clicks "Send Meeting Request"
5. Request is sent to backend with JWT token
6. Meeting is saved to MongoDB

### 2. Start a Video Call

Navigate to:
```
/meeting/video/:meetingId
```

Example:
```
http://localhost:5173/meeting/video/room-123
```

**What happens:**
1. User's camera/microphone are requested
2. Local video appears
3. User joins the meeting room via Socket.io
4. When another user joins the same room, WebRTC connection is established
5. Both users can see and hear each other

---

## 🔧 How It Works

### Meeting Scheduling Flow

```
User → ScheduleMeeting Component → Axios POST → Backend API → MongoDB
                ↓
        react-calendar (UI)
                ↓
        Date Selection → ISO String → Backend
```

### Video Call Flow

```
User A                          Socket.io Server                    User B
  |                                    |                               |
  |--join-room(meetingId, userA)----->|                               |
  |                                    |<---join-room(meetingId, userB)|
  |                                    |                               |
  |<--user-connected(userB)------------|                               |
  |                                    |------user-connected(userA)--->|
  |                                    |                               |
  |========== WebRTC Peer Connection (via PeerJS) ===================>|
  |                                    |                               |
  |<================= Video/Audio Stream =============================>|
```

**Key Components:**
1. **Socket.io**: Handles room management and user connection signaling
2. **PeerJS**: Simplifies WebRTC peer connection setup
3. **WebRTC**: Actual peer-to-peer video/audio transmission

---

## 🎯 Integration with Your App

### Add "Schedule Meeting" Button

In your investor profile or list component:

```tsx
import { useNavigate } from 'react-router-dom';

const InvestorCard = ({ investor }) => {
  const navigate = useNavigate();

  const handleScheduleMeeting = () => {
    navigate(`/meeting/schedule/${investor.id}`);
  };

  return (
    <div>
      <h3>{investor.name}</h3>
      <button onClick={handleScheduleMeeting}>
        Schedule Meeting
      </button>
    </div>
  );
};
```

### Add "Join Video Call" Button

In your dashboard or meetings list:

```tsx
import { useNavigate } from 'react-router-dom';

const MeetingItem = ({ meeting }) => {
  const navigate = useNavigate();

  const handleJoinCall = () => {
    navigate(`/meeting/video/${meeting._id}`);
  };

  return (
    <div>
      <h3>{meeting.title}</h3>
      <p>{new Date(meeting.scheduledDate).toLocaleString()}</p>
      <button onClick={handleJoinCall}>
        Join Video Call
      </button>
    </div>
  );
};
```

### Update ChatPage Video Button

In `ChatPage.tsx`, update the video button (line 104-111):

```tsx
import { useNavigate } from 'react-router-dom';

// Inside ChatPage component:
const navigate = useNavigate();

// Update the video button:
<Button
  variant="ghost"
  size="sm"
  className="rounded-full p-2"
  aria-label="Video call"
  onClick={() => navigate(`/meeting/video/${userId}`)}
>
  <Video size={18} />
</Button>
```

---

## 🐛 Troubleshooting

### Issue: "Could not access camera/microphone"
**Solution:** 
- Grant browser permissions for camera/microphone
- Use HTTPS in production (WebRTC requires secure context)
- Check if another app is using the camera

### Issue: "Waiting for other participant..." never ends
**Solution:**
- Ensure PeerJS server is running on port 9000
- Check that both users are in the same meeting room
- Verify Socket.io connection in browser console
- Check backend logs for connection messages

### Issue: Meeting request fails with 401
**Solution:**
- Ensure JWT token is stored in localStorage
- Check that user is logged in
- Verify `x-auth-token` header is being sent

### Issue: Calendar not showing
**Solution:**
- Import calendar CSS: `import 'react-calendar/dist/Calendar.css'`
- Check that `react-calendar` is installed

---

## 🔐 Security Considerations

1. **JWT Authentication**: All meeting requests require valid JWT token
2. **Meeting Room Access**: Consider adding authorization checks to verify users can join specific meetings
3. **HTTPS**: Use HTTPS in production for WebRTC
4. **TURN Server**: For production, add TURN server for NAT traversal

### Adding TURN Server (Production)

Update `VideoCall.tsx`:

```tsx
peer = new Peer('', {
  host: '/',
  port: 9000,
  path: '/peerjs',
  config: {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      {
        urls: 'turn:your-turn-server.com:3478',
        username: 'username',
        credential: 'password'
      }
    ]
  }
});
```

---

## 📦 Dependencies Added

### Frontend
```json
{
  "react-calendar": "^latest",
  "socket.io-client": "^latest",
  "peerjs": "^latest",
  "axios": "^latest"
}
```

### Backend
```json
{
  "socket.io": "^latest"
}
```

---

## 🎨 Customization

### Change Calendar Theme

Add custom CSS in `ScheduleMeeting.tsx`:

```tsx
<style>{`
  .react-calendar {
    border: 2px solid #3b82f6;
    border-radius: 12px;
  }
  .react-calendar__tile--active {
    background: #3b82f6 !important;
  }
`}</style>
```

### Add Screen Sharing

In `VideoCall.tsx`, add:

```tsx
const shareScreen = async () => {
  try {
    const screenStream = await navigator.mediaDevices.getDisplayMedia({
      video: true
    });
    
    // Replace video track with screen track
    const videoTrack = screenStream.getVideoTracks()[0];
    // Send to peer...
  } catch (err) {
    console.error('Screen sharing failed:', err);
  }
};
```

---

## 🚀 Next Steps

1. **Create Meeting Model** (if not exists):
   ```javascript
   // backend/models/Meeting.js
   const mongoose = require('mongoose');

   const MeetingSchema = new mongoose.Schema({
     entrepreneur: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
     investor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
     title: { type: String, required: true },
     scheduledDate: { type: Date, required: true },
     status: { type: String, enum: ['pending', 'accepted', 'rejected', 'completed'], default: 'pending' },
     createdAt: { type: Date, default: Date.now }
   });

   module.exports = mongoose.model('Meeting', MeetingSchema);
   ```

2. **Add Meeting List Page**: Display all scheduled meetings
3. **Add Meeting Notifications**: Notify users of meeting requests
4. **Add Meeting Status Updates**: Accept/reject meeting requests
5. **Add Calendar View**: Show all meetings in a monthly calendar

---

## 📞 Support

If you encounter issues:
1. Check browser console for errors
2. Check backend terminal for Socket.io connection logs
3. Verify PeerJS server is running
4. Ensure all dependencies are installed

---

## ✅ Testing Checklist

- [ ] PeerJS server running on port 9000
- [ ] Backend server running on port 5000
- [ ] Frontend running on port 5173
- [ ] User can log in and get JWT token
- [ ] Calendar loads and allows date selection
- [ ] Meeting request sends successfully
- [ ] Video call page loads
- [ ] Camera/microphone permissions granted
- [ ] Local video appears
- [ ] Second user can join the same room
- [ ] Both users can see/hear each other
- [ ] Mute/unmute works
- [ ] Video on/off works
- [ ] End call works

---

**Implementation Complete! 🎉**

Your meeting scheduling and video calling system is now ready to use. Follow the setup instructions and integration examples to connect it with your existing UI components.
