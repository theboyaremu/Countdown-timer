"use client"; 
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import './styles.css'; // Assuming styles are in the same folder

export default function WelcomePage() {
  const [userName, setUserName] = useState("");
  const [userId, setUserId] = useState(""); // State to store the user ID
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [eventName, setEventName] = useState(""); // State for event name
  const [eventDate, setEventDate] = useState(""); // State for event date
  const [eventTime, setEventTime] = useState(""); // State for event time
  const router = useRouter();

  useEffect(() => {
    async function fetchUser() {
      if (!userId) return; // Ensure userId is available before making the request
  
      try {
        // Include userId in the URL
        const res = await fetch(`http://localhost:3005/api/v1/user/${userId}`, {
          headers: {
            'userId': userId.toString() // Ensure userId is a string
          }
        });
  
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
  
        const data = await res.json();
        setUserName(data.username);
        setUserId(data.userId.toString()); // Ensure userId is set as a string
        console.log("Fetched user:", data.username);
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    }
  
    fetchUser();
  }, [userId]); 
  
  useEffect(() => {
    if (userId) {
      fetchEvents(userId); // Fetch events when userId is available
    }
  }, [userId]);

  const fetchEvents = async (userId) => {
    try {
      const res = await fetch(`http://localhost:3005/api/v1/events?userId=${userId}`); // Include userId in the request
      const data = await res.json();
      setEvents(data.events);
    } catch (err) {
      console.error("Error fetching events:", err);
    }
  };

  const createEvent = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3005/api/v1/create-event", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          eventName, 
          eventDate, 
          eventTime, 
          userId: userId.toString() // Ensure userId is sent as a string
        }), // Include userId and other fields in the request body
      });

      if (res.ok) {
        const newEvent = await res.json();
        setEvents((prevEvents) => [...prevEvents, newEvent]);
        // Clear the input fields after event creation
        setEventName("");
        setEventDate("");
        setEventTime("");
      } else {
        console.error("Failed to create event");
      }
    } catch (err) {
      console.error("Error creating event:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleEventClick = (eventId) => {
    router.push(`/countdown/${eventId}`);
  };

  return (
    <div className="welcome-container">
      <h1 className="welcome-header">Welcome, {userName}</h1>

      {/* Input fields for creating an event */}
      <div className="event-form">
        <input
          type="text"
          placeholder="Event Name"
          value={eventName}
          onChange={(e) => setEventName(e.target.value)} // Update state on input change
          required
        />
        <input
          type="date"
          value={eventDate}
          onChange={(e) => setEventDate(e.target.value)} // Update state on input change
          required
        />
        <input
          type="time"
          value={eventTime}
          onChange={(e) => setEventTime(e.target.value)} // Update state on input change
          required
        />
        <button onClick={createEvent} disabled={loading} className="create-event-btn">
          {loading ? "Creating..." : "Create Event"}
        </button>
      </div>

      <h2 className="events-header">Your Events</h2>
      <ul className="events-list">
        {events.map((event) => (
          <li key={event.id} onClick={() => handleEventClick(event.id)} className="event-item">
            <div className="event-title">{event.title}</div>
            <div className="event-details">
              {event.date} at {event.time} {/* Assuming event object has date and time properties */}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
