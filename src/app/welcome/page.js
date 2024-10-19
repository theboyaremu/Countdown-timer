"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import './welcomeStyles.css'; // Assuming styles are in the same folder

export default function WelcomePage() {
  const [userName, setUserName] = useState("");
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch("/api/v1/user");
        const data = await res.json();
        setUserName(data.name);
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    }

    fetchUser();
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await fetch("/api/v1/events");
      const data = await res.json();
      setEvents(data.events);
    } catch (err) {
      console.error("Error fetching events:", err);
    }
  };

  const createEvent = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/v1/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: "New Event" }),
      });

      if (res.ok) {
        const newEvent = await res.json();
        setEvents((prevEvents) => [...prevEvents, newEvent]);
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

      <button onClick={createEvent} disabled={loading} className="create-event-btn">
        {loading ? "Creating..." : "Create Event"}
      </button>

      <h2 className="events-header">Your Events</h2>
      <ul className="events-list">
        {events.map((event) => (
          <li key={event.id} onClick={() => handleEventClick(event.id)} className="event-item">
            {event.title}
          </li>
        ))}
      </ul>
    </div>
  );
}
