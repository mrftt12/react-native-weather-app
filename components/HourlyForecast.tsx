import React from "react";
import { FlatList } from "react-native";
import styled from "styled-components/native";
import moment from "moment";
import type { DailyWeather, HourlyWeather } from "../types/weather";
import { LineChart } from "./charts/line-chart";

type HourlyForecastProps = {
  day: DailyWeather;
  hourly: HourlyWeather[];
  onBack: () => void;
};

const HourlyForecast: React.FC<HourlyForecastProps> = ({
  day,
  hourly,
  onBack,
}) => {
  const temps = hourly.map((h) => h.temp);
  const minTemp = 0;
  const maxTemp = temps.length ? Math.max(...temps) + 10 : 120;
  return (
    <Container>
      <Header>
        <BackButton onPress={onBack}>
          <BackText>← Back</BackText>
        </BackButton>
        <Title>{moment(day.date).format("dddd, MMM D")}</Title>
        <SubTitle>{moment(day.date).format("YYYY")}</SubTitle>
      </Header>

      <LineChart
        data={hourly.map((h, idx) => ({
          x: idx,
          y: h.temp,
          label: moment(h.date).format("ha"),
        }))}
        config={{
          height: 220,
          showGrid: true,
          showLabels: true,
          showYLabels: true,
          yAxisWidth: 30,
          minY: minTemp,
          maxY: maxTemp,
          animated: true,
        }}
        style={{ marginBottom: 12, width: "100%" }}
      />

      <FlatList
        data={hourly}
        keyExtractor={(item) => item.date.toISOString()}
        contentContainerStyle={{ paddingBottom: 24 }}
        ItemSeparatorComponent={() => <Separator />}
        renderItem={({ item }) => (
          <HourRow>
            <Hour>{moment(item.date).format("ha")}</Hour>
            <MetricGroup>
              <Label>Temp</Label>
              <Value>{Math.round(item.temp)}°F</Value>
            </MetricGroup>
            <MetricGroup>
              <Label>Humidity</Label>
              <Value>{Math.round(item.humidity)}%</Value>
            </MetricGroup>
            <MetricGroup>
              <Label>Wind</Label>
              <Value>{item.wind_speed.toFixed(1)} mph</Value>
            </MetricGroup>
            <MetricGroup>
              <Label>Rain</Label>
              <Value>{item.precipitation.toFixed(2)} in</Value>
            </MetricGroup>
          </HourRow>
        )}
      />
    </Container>
  );
};

const Container = styled.View`
  flex: 1;
  padding: 16px;
  background-color: rgba(255, 255, 255, 0.7);
  margin: 10px;
  border-radius: 16px;
  width: 95%;
  max-width: 520px;
  align-self: center;
`;

const Header = styled.View`
  margin-bottom: 12px;
  align-items: center;
`;

const BackButton = styled.TouchableOpacity`
  align-self: flex-start;
  padding: 6px 10px;
  border-radius: 8px;
  background-color: rgba(0, 0, 0, 0.1);
`;

const BackText = styled.Text`
  font-size: 16px;
`;

const Title = styled.Text`
  font-size: 22px;
  font-weight: bold;
  margin-top: 8px;
`;

const SubTitle = styled.Text`
  font-size: 14px;
  color: #444;
`;

const HourRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 12px 6px;
`;

const Hour = styled.Text`
  width: 60px;
  font-size: 16px;
  font-weight: 600;
`;

const MetricGroup = styled.View`
  align-items: center;
  min-width: 70px;
`;

const Label = styled.Text`
  font-size: 12px;
  color: #444;
`;

const Value = styled.Text`
  font-size: 16px;
  font-weight: 600;
`;

const Separator = styled.View`
  height: 1px;
  background-color: rgba(0, 0, 0, 0.1);
`;

export default HourlyForecast;
