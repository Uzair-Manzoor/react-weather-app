import React from 'react';
import PropTypes from 'prop-types';
import {
  Accordion,
  AccordionItemHeading,
  AccordionItem,
  AccordionItemPanel,
  AccordionItemButton,
} from 'react-accessible-accordion';
import './forecast.css';

const WEEK_DAYS = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

const Forecast = ({ data }) => {
  const dayInAWeek = new Date().getDay();
  const forecastDays = WEEK_DAYS.slice(dayInAWeek, WEEK_DAYS.length).concat(
    WEEK_DAYS.slice(0, dayInAWeek),
  );

  // console.log(forecastDays);

  return (
    <>
      <h2 className="title">Daily</h2>
      <Accordion allowZeroExpanded>
        {data.list.slice(0, 7).map((item, idx) => (
          <AccordionItem key={item.dt}>
            <AccordionItemHeading>
              <AccordionItemButton>
                <div className="daily-item">
                  <img alt="weather" className="icon-small" src={`icons/${item.weather[0].icon}.png`} />
                  <h3 className="day">{forecastDays[idx]}</h3>
                  <p className="description">{item.weather[0].description}</p>
                  <p className="min-max">
                    {Math.round(item.main.temp_min)}
                    °C /
                    {Math.round(item.main.temp_max)}
                    °C
                  </p>
                </div>
              </AccordionItemButton>
            </AccordionItemHeading>
            <AccordionItemPanel>
              <div className="daily-detail-grid">
                <div className="daily-detail-grid-item">
                  <span>Pressure:</span>
                  <span>
                    {item.main.pressure}
                    {' '}
                    hPa
                  </span>
                </div>
                <div className="daily-detail-grid-item">
                  <span>Humidity:</span>
                  <span>
                    {item.main.humidity}
                    %
                  </span>
                </div>
                <div className="daily-detail-grid-item">
                  <span>Clouds:</span>
                  <span>
                    {item.clouds.all}
                    %
                  </span>
                </div>
                <div className="daily-detail-grid-item">
                  <span>Wind Speed:</span>
                  <span>
                    {item.wind.speed}
                    {' '}
                    m/s
                  </span>
                </div>
                <div className="daily-detail-grid-item">
                  <span>Sea Level:</span>
                  <span>
                    {item.main.sea_level}
                    {' '}
                    m
                  </span>
                </div>
                <div className="daily-detail-grid-item">
                  <span>Feels Like:</span>
                  <span>
                    {Math.round(item.main.feels_like)}
                    °C
                  </span>
                </div>
              </div>
            </AccordionItemPanel>
          </AccordionItem>
        ))}
      </Accordion>
    </>
  );
};

Forecast.propTypes = {
  data: PropTypes.shape({
    list: PropTypes.arrayOf(
      PropTypes.shape({
        dt: PropTypes.number.isRequired,
        weather: PropTypes.arrayOf(
          PropTypes.shape({
            description: PropTypes.string.isRequired,
            icon: PropTypes.string.isRequired,
          }),
        ).isRequired,
        main: PropTypes.shape({
          temp_min: PropTypes.number.isRequired,
          temp_max: PropTypes.number.isRequired,
          pressure: PropTypes.number.isRequired,
          humidity: PropTypes.number.isRequired,
          sea_level: PropTypes.number,
          feels_like: PropTypes.number.isRequired,
        }).isRequired,
        clouds: PropTypes.shape({
          all: PropTypes.number.isRequired,
        }).isRequired,
        wind: PropTypes.shape({
          speed: PropTypes.number.isRequired,
        }).isRequired,
      }),
    ).isRequired,
  }).isRequired,
};

export default Forecast;
