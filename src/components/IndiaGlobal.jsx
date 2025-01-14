import React from 'react';

// List of holidays with dates and names
const holidays = [
  { date: '01-01', name: "New Year's Day" },
  { date: '01-02', name: 'Last day of Hanukkah' },
  { date: '01-06', name: 'Guru Govind Singh Jayanti' },
  { date: '01-13', name: 'Lohri' },
  { date: '01-14', name: 'Pongal' },
  { date: '01-14', name: 'Makar Sankranti' },
  { date: '01-14', name: "Hazarat Ali's Birthday" },
  { date: '01-26', name: 'Republic Day' },
  { date: '01-29', name: 'Lunar New Year' },
  { date: '02-02', name: 'Vasant Panchami' },
  { date: '02-12', name: 'Guru Ravidas Jayanti' },
  { date: '02-14', name: "Valentine's Day" },
  { date: '02-19', name: 'Shivaji Jayanti' },
  { date: '02-23', name: 'Maharishi Dayanand Saraswati Jayanti' },
  { date: '02-26', name: 'Maha Shivaratri/Shivaratri' },
  { date: '03-02', name: 'Ramadan Start (Tentative Date)' },
  { date: '03-13', name: 'Holika Dahana' },
  { date: '03-14', name: 'Holi' },
  { date: '03-14', name: 'Dolyatra' },
  { date: '03-20', name: 'March Equinox' },
  { date: '03-28', name: 'Jamat Ul-Vida (Tentative Date)' },
  { date: '03-30', name: 'Chaitra Sukhladi' },
  { date: '03-30', name: 'Ugadi' },
  { date: '03-30', name: 'Gudi Padwa' },
  { date: '03-31', name: 'Ramzan Id/Eid-ul-Fitar (Tentative Date)' },
  { date: '01-12', name: 'Swami Vivekanand Jayanti' },
  { date: '01-23', name: 'Netaji Subhash Chandra Bose Jayanti' },
  { date: '02-01', name: 'Saraswati Puja' },
  { date: '03-31', name: 'Eid al-fitr' },
  { date: '04-10', name: 'Mahavir Janma Kalyanak' },
  { date: '04-14', name: 'Ambedkar Jayanti' },
  { date: '04-15', name: 'Pohela Boishakh and West Bengal Day' },
  { date: '05-01', name: 'Labour Day' },
  { date: '05-08', name: 'Rabindra Jayanti' },
  { date: '05-12', name: 'Pandit Raghunath Murmu Jayanti and Vesak' },
  { date: '06-06', name: 'Eid al-Adha' },
  { date: '06-07', name: 'Eid al-Adha' },
  { date: '08-15', name: 'Independence Day' },
  { date: '09-04', name: 'Mawlid' },
  { date: '09-30', name: 'Durga Ashtami' },
  { date: '10-01', name: 'Maha Navami' },
  { date: '10-02', name: 'Gandhi Jayanti' },
  { date: '10-06', name: 'Lakshmi Puja' },
  { date: '10-20', name: 'Diwali' },
  { date: '11-05', name: 'Guru Nanak Gurpurab' },
  { date: '12-25', name: 'Christmas Day' },
  { date: '12-31', name: 'Last Day of the Year' },
];
  

const IndiaGlobal = () => {
  const today = new Date().toISOString().slice(5, 10); // Get MM-DD format
  const todayHoliday = holidays.find(holiday => holiday.date === today);

  return (
    <div>
      {todayHoliday ? (
        <h1
          style={{
            background: 'linear-gradient(to right, #FF9933, #0000FF, #ffffff, #138808)',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
          }}
        >
          Happy {todayHoliday.name}!
        </h1>
      ) : (
        <h1
          style={{
            background: 'linear-gradient(to right, #FF9933, #ffffff, #0000FF, #ffffff, #138808)',
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