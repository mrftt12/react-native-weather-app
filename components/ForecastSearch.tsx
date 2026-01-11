import React from "react";
import styled from "styled-components/native";

type ForecastSearchProps = {
  toggleSearch: "city" | "postal";
  setToggleSearch: (value: "city" | "postal") => void;
  city: string;
  setCity: (value: string) => void;
  fetchLatLongHandler: () => void;
  fetchByPostalHandler: () => void;
  setPostalCode: (value: string) => void;
  postalCode: string;
};

const ForecastSearch: React.FC<ForecastSearchProps> = ({
  toggleSearch,
  setToggleSearch,
  city,
  setCity,
  fetchLatLongHandler,
  fetchByPostalHandler,
  setPostalCode,
  postalCode,
}) => {
  const handleSubmit = () => {
    if (toggleSearch === "city") {
      fetchLatLongHandler();
    }
    if (toggleSearch === "postal") {
      fetchByPostalHandler();
    }
  };

  return (
    <Container>
      <SearchBy>
        <ButtonLabel>Search By</ButtonLabel>
        <OptionButton
          accessibilityLabel="Search Weather By City"
          onPress={() => setToggleSearch("city")}
          $active={toggleSearch === "city"}
        >
          <OptionText>City</OptionText>
        </OptionButton>
        <OptionButton
          accessibilityLabel="Search Weather By ZIP/Postal Code"
          onPress={() => setToggleSearch("postal")}
          $active={toggleSearch === "postal"}
        >
          <OptionText>Postal Code/Zip</OptionText>
        </OptionButton>
      </SearchBy>

      <SearchInput
        onChangeText={toggleSearch === "city" ? setCity : setPostalCode}
        value={toggleSearch === "city" ? city : postalCode}
        placeholder={
          toggleSearch === "city" ? "Search By City" : "Search By Postal Code"
        }
        onSubmitEditing={handleSubmit}
        placeholderTextColor="rgba(0,0,0,0.5)"
      />
    </Container>
  );
};

const Container = styled.View`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 35px;
`;

const SearchBy = styled.View`
  display: flex;
  flex-direction: row;
  color: white;
  margin-top: 10px;
  align-items: center;
  justify-content: flex-start;
  width: 95%;
  max-width: 700px;
`;

const ButtonLabel = styled.Text`
  color: white;
  margin-right: 10px;
`;

const OptionButton = styled.Pressable<{ $active: boolean }>`
  padding: 10px 14px;
  border-radius: 10px;
  background-color: ${(props) =>
    props.$active ? "white" : "rgba(255, 255, 255, 0.2)"};
  margin-right: 10px;
  border: 1px solid rgba(255, 255, 255, 0.5);
`;

const OptionText = styled.Text`
  color: #1f2933;
  font-weight: 600;
`;

const SearchInput = styled.TextInput`
  height: 50px;
  margin: 12px;
  background-color: white;
  padding: 15px;
  border-radius: 10px;
  width: 95%;
  max-width: 700px;
`;

export default ForecastSearch;
