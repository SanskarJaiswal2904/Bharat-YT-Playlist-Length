import React from 'react';

// List of holidays with dates and names
const holidays = [
    { date: '2025-01-01', name: "New Year's Day" },
    { date: '2025-01-02', name: 'Last day of Hanukkah' },
    { date: '2025-01-06', name: 'Guru Govind Singh Jayanti' },
    { date: '2025-01-13', name: 'Lohri' },
    { date: '2025-01-14', name: 'Pongal' },
    { date: '2025-01-14', name: 'Makar Sankranti' },
    { date: '2025-01-14', name: "Hazarat Ali's Birthday" },
    { date: '2025-01-26', name: 'Republic Day' },
    { date: '2025-01-29', name: 'Lunar New Year' },
    { date: '2025-02-02', name: 'Vasant Panchami' },
    { date: '2025-02-12', name: 'Guru Ravidas Jayanti' },
    { date: '2025-02-14', name: "Valentine's Day" },
    { date: '2025-02-19', name: 'Shivaji Jayanti' },
    { date: '2025-02-23', name: 'Maharishi Dayanand Saraswati Jayanti' },
    { date: '2025-02-26', name: 'Maha Shivaratri/Shivaratri' },
    { date: '2025-03-02', name: 'Ramadan Start (Tentative Date)' },
    { date: '2025-03-13', name: 'Holika Dahana' },
    { date: '2025-03-14', name: 'Holi' },
    { date: '2025-03-14', name: 'Dolyatra' },
    { date: '2025-03-20', name: 'March Equinox' },
    { date: '2025-03-28', name: 'Jamat Ul-Vida (Tentative Date)' },
    { date: '2025-03-30', name: 'Chaitra Sukhladi' },
    { date: '2025-03-30', name: 'Ugadi' },
    { date: '2025-03-30', name: 'Gudi Padwa' },
    { date: '2025-03-31', name: 'Ramzan Id/Eid-ul-Fitar (Tentative Date)' },
  ];
  

const IndiaGlobal = () => {
  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().slice(0, 10);

  // Check if today's date matches any holiday
  const todayHoliday = holidays.find(holiday => holiday.date === today);

  return (
    <div>
      {todayHoliday ? (
        <h1
          style={{
            background: 'linear-gradient(to right, #FF9933, #ffffff, #138808)',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
          }}
        >
          Happy {todayHoliday.name}!
        </h1>
      ) : (
        <h1
          style={{
            background: 'linear-gradient(to right, #FF9933, #ffffff, #138808)',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
          }}
        >
          Welcome,
        </h1>
      )}
    </div>
  );
};

export default IndiaGlobal;
