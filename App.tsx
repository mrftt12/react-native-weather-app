import React, { useEffect, useMemo, useState } from "react";
import { ScrollView, ImageBackground } from "react-native";
import styled from "styled-components/native";
import moment from "moment";
import ForecastSearch from "./components/ForecastSearch";
import CurrentForecast from "./components/CurrentForecast";
import DailyForecast from "./components/DailyForecast";
import HourlyForecast from "./components/HourlyForecast";
import config from "./config";
import bgImg from "./assets/4.png";
import type { WeatherResponse } from "./types/weather";
import { fetchLatLongByCity, fetchLatLongByPostal } from "./services/location";
import { fetchWeather } from "./services/weather";

const App = () => {
  const [toggleSearch, setToggleSearch] = useState<"city" | "postal">("city");
  const [city, setCity] = useState("Orange, CA");
  const [postalCode, setPostalCode] = useState("92867");
  const [lat, setLat] = useState(33.6532);
  const [long, setLong] = useState(-117.3832);
  const [weather, setWeather] = useState<WeatherResponse>({});
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);

  //fetch lat long by city
  const fetchLatLongHandler = () => {
    fetchLatLongByCity(city, config.API_KEY)
      .then(({ lat, lon }) => {
        setLat(lat);
        setLong(lon);
      })
      .catch((error) => console.warn("City lookup failed", error));
  };

  //fetch lat long by postal code/zip since OpenWeather Api only accepts zips
  const fetchByPostalHandler = () => {
    fetchLatLongByPostal(postalCode, config.GOOGLE_KEY)
      .then(({ lat, lon }) => {
        setLat(lat);
        setLong(lon);
      })
      .catch((error) => console.warn("Postal lookup failed", error));
  };

  //updates the weather when lat long changes
  useEffect(() => {
    const controller = new AbortController();

    fetchWeather(lat, long)
      .then((data: WeatherResponse) => setWeather(data))
      .catch((err) => {
        console.log("error", err);
      });
    return () => controller.abort();
  }, [lat, long]);

  const dailyWithoutToday = useMemo(
    () => weather.daily?.slice(1) ?? [],
    [weather.daily]
  );

  const selectedDayData = useMemo(
    () =>
      selectedDay && weather.daily
        ? weather.daily.find(
            (day) => moment(day.date).isSame(moment(selectedDay), "day")
          ) ?? null
        : null,
    [selectedDay, weather.daily]
  );

  const hourlyForSelectedDay = useMemo(() => {
    if (!selectedDay || !weather.hourly) return [];
    return weather.hourly.filter((hour) =>
      moment(hour.date).isSame(moment(selectedDay), "day")
    );
  }, [selectedDay, weather.hourly]);

  return (
    <Container>
      <ImageBackground source={bgImg} style={{ width: "100%", height: "100%" }}>
        <ForecastSearch
          city={city}
          setCity={setCity}
          fetchLatLongHandler={fetchLatLongHandler}
          toggleSearch={toggleSearch}
          setToggleSearch={setToggleSearch}
          fetchByPostalHandler={fetchByPostalHandler}
          setPostalCode={setPostalCode}
          postalCode={postalCode}
        />
        <CurrentForecast currentWeather={weather} />
        {selectedDayData ? (
          <ScrollView contentContainerStyle={{ flexGrow: 1 }} style={{ flex: 1 }}>
            <HourlyForecast
              day={selectedDayData}
              hourly={hourlyForSelectedDay}
              onBack={() => setSelectedDay(null)}
            />
          </ScrollView>
        ) : (
          <ScrollView contentContainerStyle={{ flexGrow: 1 }} style={{ flex: 1 }}>
            <FutureForecastContainer>
              {dailyWithoutToday.length ? (
                dailyWithoutToday.map((day, index) => (
                  <DailyForecast
                    key={day.date.toISOString()}
                    day={day}
                    index={index}
                    onPress={() => setSelectedDay(day.date)}
                  />
                ))
              ) : (
                <NoWeather>No Weather to show</NoWeather>
              )}
            </FutureForecastContainer>
          </ScrollView>
        )}
      </ImageBackground>
    </Container>
  );
};

const Container = styled.View`
  flex: 1;
  background-color: dodgerblue;
`;

const NoWeather = styled.Text`
  text-align: center;
  color: white;
`;

const FutureForecastContainer = styled.View`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export default App;
