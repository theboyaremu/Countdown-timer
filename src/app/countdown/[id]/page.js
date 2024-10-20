"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import './styles.css'; // Import the external CSS file

const Countdown = ({ date }) => {
    const [days, setDays] = useState(0);
    const [hours, setHours] = useState(0);
    const [min, setMin] = useState(0);
    const [sec, setSec] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            const diff = (Date.parse(new Date(date)) - Date.parse(new Date())) / 1000;
            if (diff <= 0) {
                clearInterval(interval);
                return;
            }
            const newDays = Math.floor(diff / 86400);
            const newHours = Math.floor((diff % 86400) / 3600);
            const newMin = Math.floor((diff % 3600) / 60);
            const newSec = Math.floor(diff % 60);

            setDays(newDays);
            setHours(newHours);
            setMin(newMin);
            setSec(newSec);
        }, 1000);
        return () => clearInterval(interval);
    }, [date]);

    const addLeadingZeros = (value) => {
        return String(value).padStart(2, '0');
    };

    return (
        <div className="countdown-container">
            <div className="countdown-item">
                <div className="countdown-value">{addLeadingZeros(days)}</div>
                <div className="countdown-label">Days</div>
            </div>
            <div className="countdown-item">
                <div className="countdown-value">{addLeadingZeros(hours)}</div>
                <div className="countdown-label">Hours</div>
            </div>
            <div className="countdown-item">
                <div className="countdown-value">{addLeadingZeros(min)}</div>
                <div className="countdown-label">Min</div>
            </div>
            <div className="countdown-item">
                <div className="countdown-value">{addLeadingZeros(sec)}</div>
                <div className="countdown-label">Sec</div>
            </div>
        </div>
    );
};

const CountdownPage = () => {
    const params = useParams();
    const id = params.id; // This will get the ID from the URL path
    const [eventDate, setEventDate] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (id) {
            const fetchEvent = async () => {
                try {
                    const res = await fetch(`http://localhost:3005/api/v1/event/${id}`);
                    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
                    const data = await res.json();
                    setEventDate(data.event.eventDate);
                } catch (error) {
                    console.error("Error fetching event:", error);
                    setError("Failed to load event data.");
                } finally {
                    setLoading(false);
                }
            };
            fetchEvent();
        } else {
            setError("No event ID provided.");
            setLoading(false);
        }
    }, [id]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center p-4 text-red-600">
                <p>{error}</p>
            </div>
        );
    }

    if (!eventDate) {
        return (
            <div className="text-center p-4">
                <p>No event date found.</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-8 text-center">Countdown to Event</h1>
            <Countdown date={eventDate} />
        </div>
    );
};

export default CountdownPage;
