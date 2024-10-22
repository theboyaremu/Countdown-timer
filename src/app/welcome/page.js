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

  // Extract userId from the URL when component mounts
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const userIdFromURL = urlParams.get("userId");

    if (userIdFromURL) {
      setUserId(userIdFromURL);
    }
  }, []); // Run this effect once on mount

  // Fetch user details when userId is available
  useEffect(() => {
    async function fetchUser() {
      console.log(userId); // Log the userId for debugging
      if (!userId) return; // Ensure userId is available before making the request

      try {
        const res = await fetch(`http://localhost:3005/api/v1/user/${userId}`, {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();
        setUserName(data.username);
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    }

    fetchUser();
  }, [userId]);

  // Fetch events when userId is available
  useEffect(() => {
    if (userId) {
      fetchEvents(userId);
    }
  }, [userId]);

  // Function to fetch events for the user
  const fetchEvents = async (userId) => {
    try {
      const res = await fetch(`http://localhost:3005/api/v1/events/${userId}`);
      const data = await res.json();
      setEvents(data.events || []); // Fallback to empty array if events are undefined
    } catch (err) {
      console.error("Error fetching events:", err);
    }
  };

  // Function to create a new event with validation
  const createEvent = async () => {
    if (!eventTime) {
      alert("Please select a time for the event.");
      return;
    }

    setLoading(true);
    console.log("Creating event with time:", eventTime); // Log eventTime for debugging

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
          userId: parseInt(userId), // Ensure userId is a valid integer
        }),
      });

      if (res.ok) {
        const newEvent = await res.json();
        setEvents((prevEvents) => [...prevEvents, newEvent.event]);
        setEventName("");
        setEventDate("");
        setEventTime(""); // Clear input fields after successful creation
      } else {
        console.error("Failed to create event");
      }
    } catch (err) {
      console.error("Error creating event:", err);
    } finally {
      setLoading(false);
    }
  };

  // Function to handle clicking on an event
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
          onChange={(e) => setEventName(e.target.value)}
          required
        />
        <input
          type="date"
          value={eventDate}
          onChange={(e) => setEventDate(e.target.value)}
          required
        />
        <input
          type="time"
          value={eventTime}
          onChange={(e) => {
            console.log("Event Time Selected:", e.target.value); // Log the time to ensure it's captured
            setEventTime(e.target.value);
          }}
          required
        />
        <button onClick={createEvent} disabled={loading} className="create-event-btn">
          {loading ? "Creating..." : "Create Event"}
        </button>
      </div>

      <h2 className="events-header">Your Events</h2>
      <ul className="events-list">
        {events && events.length > 0 ? (
          events.map((event) => (
            <li key={event.id} onClick={() => handleEventClick(event.id)} className="event-item">
              <div className="event-title">{event.eventName}</div>
              <div className="event-details">
                {event.eventDate} at {event.eventTime}
              </div>
            </li>
          ))
        ) : (
          <p>No events available. Please create one!</p>
        )}
      </ul>
    </div>
  );
}
