import React from "react";
import styled from "styled-components/native";
import {
  codeToEmoji,
  weatherCodeDescription,
} from "../types/weather";

type CurrentForecastProps = {
  currentWeather: {
    timezone?: string;
    current?: {
      temp: number;
      effective_temp: number;
      feels_like: number;
      humidity: number;
      wind_speed: number;
      weather_code: number;
    };
    daily?: Array<{
      temp_min: number;
      temp_max: number;
      precipitation_sum?: number;
    }>;
  };
};

const CurrentForecast: React.FC<CurrentForecastProps> = ({ currentWeather }) => {
  return (
    <CurrentView>
      <Timezone>{currentWeather.timezone}</Timezone>
      <MainInfoContainer>
        <CurrentTempView>
          <WeatherEmoji>
            {codeToEmoji[currentWeather.current?.weather_code ?? 0] ?? "🌡"}
          </WeatherEmoji>
          <CurrentDegrees>
            {Math.round(currentWeather.current?.temp ?? 0)}
            °F
          </CurrentDegrees>
        </CurrentTempView>
        <Description>
          {weatherCodeDescription[currentWeather.current?.weather_code ?? 0] ??
            ""}
        </Description>
      </MainInfoContainer>
      <SecondaryInfoContainer>
        <Row>
          <DetailsBox>
            <Label>E.T.</Label>
            <Details>
              {Math.round(currentWeather.current?.effective_temp ?? 0)}
              °F
            </Details>
          </DetailsBox>
          <DetailsBox>
            <Label>Low</Label>
            <Details>
              {Math.round(currentWeather.daily?.[0]?.temp_min ?? 0)}
              °F
            </Details>
          </DetailsBox>
          <DetailsBox>
            <Label>High</Label>
            <Details>
              {Math.round(currentWeather.daily?.[0]?.temp_max ?? 0)}
              °F
            </Details>
          </DetailsBox>
        </Row>
        <Row>
          <DetailsBox>
            <Label>Wind</Label>
            <Details>
              {(currentWeather.current?.wind_speed ?? 0).toFixed(1)} mph
            </Details>
          </DetailsBox>
          <DetailsBox>
            <Label>Humidity</Label>
            <Details>
              {currentWeather.current?.humidity ?? 0}%
            </Details>
          </DetailsBox>
          <DetailsBox>
            <Label>Rain</Label>
            <Details>
              {currentWeather.daily?.[0]?.precipitation_sum ?? 0} in
            </Details>
          </DetailsBox>
        </Row>
      </SecondaryInfoContainer>
    </CurrentView>
  );
};

const CurrentView = styled.View`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
`;

const CurrentTempView = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const MainInfoContainer = styled.View`
  display: flex;
  align-items: center;
`;

const Description = styled.Text`
  color: white;
  font-size: 15px;
  text-transform: capitalize;
`;

const SecondaryInfoContainer = styled.View`
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 20px 10px;
  width: 95%;
  max-width: 478px;
`;

const WeatherEmoji = styled.Text`
  font-size: 44px;
  margin-right: 10px;
`;

const Timezone = styled.Text`
  color: white;
  display: flex;
  justify-content: center;
  margin-top: 10px;
  font-size: 15px;
`;

const CurrentDegrees = styled.Text`
  color: white;
  display: flex;
  justify-content: center;
  margin-top: 10px;
  font-size: 60px;
`;

const Row = styled.View`
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: space-between;
  color: black;
  padding: 10px 30px;
`;

const DetailsBox = styled.View`
  display: flex;
`;

const Label = styled.Text`
  font-size: 18px;
`;

const Details = styled.Text`
  color: black;
  font-size: 15px;
  text-transform: capitalize;
`;

export default CurrentForecast;
