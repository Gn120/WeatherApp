import { StatusBar } from "expo-status-bar";
import * as Location from "expo-location";
import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  Dimensions,
  View,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Fontisto } from "@expo/vector-icons";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const API_KEY = "날씨 Token";

const icons = {
  Clouds: "cloudy",
  Clear: "day-sunny",
  Atomosphere: "cloudy-gusts",
  Snow: "snow",
  Rain: "rains",
  Drizzle: "rain",
  Thunderstrom: "lightning",
};

export default function App() {
  const [region, setRegion] = useState("Loading...");
  const [days, setDays] = useState([]);
  const [ok, setOk] = useState(true);
  const getWeather = async () => {
    const { granted } = await Location.requestForegroundPermissionsAsync();
    if (!granted) {
      setOk(false);
    }
    const {
      coords: { latitude, longitude },
    } = await Location.getCurrentPositionAsync({ accuracy: 5 });
    const location = await Location.reverseGeocodeAsync(
      {
        latitude,
        longitude,
      },
      { useGoogleMaps: false }
    );
    setRegion(location[0].region);
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
    );
    const json = await response.json();

    const weatherData = json.list.map((item) => ({
      temp: item.main.temp,
      main: item.weather[0].main,
      description: item.weather[0].description,
      txt: item.dt_txt,
    }));
    setDays(weatherData);
  };
  useEffect(() => {
    getWeather();
  }, []);
  return (
    <View style={styles.container}>
      <View style={styles.region}>
        <Text style={styles.regionName}>{region}</Text>
      </View>
      <ScrollView
        pagingEnabled
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.weather}
      >
        {days.length === 0 ? (
          <View style={{ ...styles.day, alignItems: "center" }}>
            <ActivityIndicator
              color="white"
              style={{ marginTop: 10 }}
              size="large"
            />
          </View>
        ) : (
          days.map((day, index) => (
            <View key={index} style={styles.day}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  width: "100%",
                  justifyContent: "space-between",
                }}
              >
                <Text style={styles.temp}>
                  {parseFloat(day.temp).toFixed(1)}
                </Text>
                <Fontisto name={icons[day.main]} size={68} color="white" />
              </View>
              <Text style={styles.main_description}>{day.main}</Text>
              <Text style={styles.tinyText}>{day.description}</Text>
              <Text style={styles.tinyText}>{day.txt}</Text>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "tomato",
  },
  region: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  regionName: {
    color: "white",
    fontSize: 60,
    fontWeight: "500",
  },
  weather: {},
  day: {
    width: SCREEN_WIDTH,
    alignItems: "flex-start",
    paddingHorizontal: 20,
  },
  temp: {
    color: "white",
    fontWeight: "600",
    marginTop: 50,
    fontSize: 110,
  },
  main_description: {
    color: "white",
    marginTop: -15,
    fontSize: 30,
    fontWeight: "500",
  },
  tinyText: {
    color: "white",
    fontSize: 15,
    fontWeight: "500",
  },
});
