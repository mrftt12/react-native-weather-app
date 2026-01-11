import React from "react";
import { Text } from "react-native";
import styled from "styled-components/native";
import moment from "moment";
import type { DailyWeather } from "../types/weather";
import { codeToEmoji, weatherCodeDescription } from "../types/weather";

type DailyForecastProps = {
  day: DailyWeather;
  index: number;
  onPress?: () => void;
};

const DailyForecast: React.FC<DailyForecastProps> = ({ day, onPress }) => {
  return (
    <DayContainer activeOpacity={0.8} onPress={onPress}>
      <DateContainer>
        <WeekDay>{moment(day.date).format("ddd")}</WeekDay>
      </DateContainer>
      <IconTempView>
        <Emoji>{codeToEmoji[day.weather_code] ?? "🌡"}</Emoji>
        <Text>{weatherCodeDescription[day.weather_code] ?? ""}</Text>
      </IconTempView>
      <DegreeView>
        <Degree>{Math.round(day.temp_max)}°F</Degree>
        <FeelsLike>
          E.T. {Math.round(day.effective_temp_day ?? day.apparent_temp_day)}°F
        </FeelsLike>
      </DegreeView>
    </DayContainer>
  );
};

const DayContainer = styled.TouchableOpacity`
  padding: 10px;
  background-color: rgba(255, 255, 255, 0.6);
  border-radius: 10px;
  margin: 10px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-evenly;
  width: 95%;
  max-width: 478px;
`;

const DateContainer = styled.View`
  text-align: right;
  flex: 1;
`;

const WeekDay = styled.Text`
  font-size: 24px;
  text-align: center;
  margin: 3px;
`;

const IconTempView = styled.View`
  text-align: center;
  display: flex;
  flex-direction: row;
  align-items: center;
  text-align: left;
  flex: 2;
`;

const Emoji = styled.Text`
  font-size: 36px;
  margin-right: 8px;
`;

const DegreeView = styled.View`
  text-align: center;
  flex: 1;
`;

const Degree = styled.Text`
  font-size: 24px;
`;

const FeelsLike = styled.Text`
  font-size: 14px;
`;

export default DailyForecast;
