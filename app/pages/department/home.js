import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
} from "react-native";
import { PieChart } from "react-native-gifted-charts";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Link } from "expo-router";
import Feather from "@expo/vector-icons/Feather";
import * as Animatable from "react-native-animatable";
import { useUser } from "@supabase/auth-helpers-react"; // Import useUser to get user details
import * as Notifications from "expo-notifications";
import { sendNotification } from "../../../supabaseClient";

const COLORS = {
  MANPOWER: "#999999",
  FINANCIAL: "#777777",
  ENVIRONMENTAL: "#555555",
  SAFETY: "#111111",
};

const VALUES = {
  MANPOWER: 73,
  FINANCIAL: 1,
  ENVIRONMENTAL: 13,
  SAFETY: 10,
};

const pieData = [
  {
    value: VALUES.MANPOWER,
    color: COLORS.MANPOWER,
    label: "Manpower",
  },
  {
    value: VALUES.FINANCIAL,
    color: COLORS.FINANCIAL,
    label: "Financial",
  },
  {
    value: VALUES.ENVIRONMENTAL,
    color: COLORS.ENVIRONMENTAL,
    label: "Environmental",
  },
  {
    value: VALUES.SAFETY,
    color: COLORS.SAFETY,
    label: "Safety",
  },
];

export const DepartmentDashboard = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current; // Initial opacity for department rows
  const scaleAnim = useRef(new Animated.Value(0)).current; // Initial scale for pie chart
  const user = useUser();
  const [notifications, setNotifications] = useState([]);

  // const scheduleNotification = useCallback(
  //   async (value) => {
  //     const message = `Risk level is ${value}`;

  //     // Send notification to the database
  //     await sendNotification(user.id, message); // Pass the user ID and the message

  //     // Schedule the local notification
  //     await Notifications.scheduleNotificationAsync({
  //       content: {
  //         title: "Risk Alert",
  //         body: message,
  //         data: { value },
  //       },
  //       trigger: null,
  //     });
  //   },
  //   [user.id]
  // );

  // // Check values and send notification if any are above 60
  // useEffect(() => {
  //   Object.values(VALUES).forEach((value) => {
  //     if (value > 60) {
  //       scheduleNotification(value);
  //     }
  //   });
  // }, [scheduleNotification]);

  // // Request notification permissions on mount
  // useEffect(() => {
  //   const requestPermissions = async () => {
  //     const { status } = await Notifications.getPermissionsAsync();
  //     if (status !== "granted") {
  //       await Notifications.requestPermissionsAsync();
  //     }
  //   };

  //   requestPermissions();
  // }, []);

  // Animations on mount
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1, // Fade to opacity 1 (fully visible)
      duration: 1000,
      useNativeDriver: true,
    }).start();

    Animated.spring(scaleAnim, {
      toValue: 1, // Scale up to original size
      friction: 5,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim, scaleAnim]);

  const renderDot = (color) => {
    return (
      <View
        style={{
          height: 10,
          width: 10,
          borderRadius: 5,
          backgroundColor: color,
          marginRight: 10,
        }}
      />
    );
  };

  const renderLegendComponent = () => {
    return (
      <>
        <View style={styles.legendContainer}>
          <View style={styles.legendRow}>
            {renderDot(COLORS.MANPOWER)}
            <Text style={styles.legendText}>Manpower: {VALUES.MANPOWER}%</Text>
          </View>
          <View style={styles.legendRow}>
            {renderDot(COLORS.ENVIRONMENTAL)}
            <Text style={styles.legendText}>
              Environmental: {VALUES.ENVIRONMENTAL}%
            </Text>
          </View>
        </View>
        <View style={styles.legendContainer}>
          <View style={styles.legendRow}>
            {renderDot(COLORS.FINANCIAL)}
            <Text style={styles.legendText}>
              Financial: {VALUES.FINANCIAL}%
            </Text>
          </View>
          <View style={styles.legendRow}>
            {renderDot(COLORS.SAFETY)}
            <Text style={styles.legendText}>Safety: {VALUES.SAFETY}%</Text>
          </View>
        </View>
      </>
    );
  };

  const handlePieSectionPress = (section) => {
    console.log(`${section.label} section clicked`);
  };

  return (
    <ScrollView style={{ flex: 1 }}>
      <View style={styles.mainContainer}>
        <View style={styles.pieChartContainer}>
          <Text style={styles.title}>Risks</Text>
          <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <PieChart
              donut
              data={pieData.map((section) => ({
                ...section,
                onPress: () => handlePieSectionPress(section),
              }))}
              sectionAutoFocus
              focusOnPress
              innerRadius={80}
              innerCircleColor={"white"}
              centerLabelComponent={() => {
                return (
                  <View>
                    <Feather
                      name="alert-triangle"
                      size={50}
                      color={"#F35454"}
                    />
                  </View>
                );
              }}
            />
          </Animated.View>
          {renderLegendComponent()}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f2f3f4",
  },
  pieChartContainer: {
    alignItems: "center",
    marginBottom: 20,
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  legendContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 10,
  },
  legendRow: {
    flexDirection: "row",
    alignItems: "center",
    width: 120,
    marginRight: 20,
  },
  legendText: {
    color: "black",
    fontSize: 11,
  },
});
