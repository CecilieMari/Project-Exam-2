import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import Style from './BookingCalendar.module.css';

function BookingCalendar({ venue, onDateSelect }) {
    const [selectedDates, setSelectedDates] = useState([null, null]);
    const [bookedDates, setBookedDates] = useState([]);

    useEffect(() => {
        if (venue?.bookings) {
            // Konverter bookings til array av opptatte datoer
            const occupied = [];
            venue.bookings.forEach(booking => {
                const start = new Date(booking.dateFrom);
                const end = new Date(booking.dateTo);
                
                for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
                    occupied.push(new Date(date));
                }
            });
            setBookedDates(occupied);
            console.log('Booked dates:', occupied);
        }
    }, [venue]);

    const isDateBooked = (date) => {
        return bookedDates.some(bookedDate => 
            bookedDate.toDateString() === date.toDateString()
        );
    };

    const isDateDisabled = (date) => {
        // Deaktiver tidligere datoer og opptatte datoer
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return date < today || isDateBooked(date);
    };

    const handleDateChange = (value) => {
        setSelectedDates(value);
        onDateSelect(value);
        console.log('Selected dates:', value);
    };

    const getTileClassName = ({ date, view }) => {
        if (view === 'month') {
            if (isDateBooked(date)) {
                return Style.bookedDate;
            }
            if (selectedDates[0] && selectedDates[1]) {
                if (date >= selectedDates[0] && date <= selectedDates[1]) {
                    return Style.selectedRange;
                }
            }
        }
        return null;
    };

    const calculateNights = () => {
        if (selectedDates[0] && selectedDates[1]) {
            const timeDiff = selectedDates[1] - selectedDates[0];
            return Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
        }
        return 0;
    };

    return (
        <div className={Style.bookingCalendar}>
            <h3>Select your dates</h3>
            
            <Calendar
                onChange={handleDateChange}
                value={selectedDates}
                selectRange={true}
                tileDisabled={({ date }) => isDateDisabled(date)}
                tileClassName={getTileClassName}
                minDate={new Date()}
                className={Style.calendar}
            />
            
            {selectedDates[0] && selectedDates[1] && (
                <div className={Style.selectionSummary}>
                    <p>Check-in: {selectedDates[0].toLocaleDateString()}</p>
                    <p>Check-out: {selectedDates[1].toLocaleDateString()}</p>
                    <p>Nights: {calculateNights()}</p>
                    <p>Total: ${venue.price * calculateNights()}</p>
                </div>
            )}

            <div className={Style.legend}>
                <div className={Style.legendItem}>
                    <div className={Style.availableColor}></div>
                    <span>Available</span>
                </div>
                <div className={Style.legendItem}>
                    <div className={Style.bookedColor}></div>
                    <span>Booked</span>
                </div>
                <div className={Style.legendItem}>
                    <div className={Style.selectedColor}></div>
                    <span>Selected</span>
                </div>
            </div>
        </div>
    );
}

export default BookingCalendar;