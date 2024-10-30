import React, { useEffect, useRef, useState, useCallback } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Platform, StatusBar, Animated } from "react-native";
import { PieChart } from "react-native-gifted-charts";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Link } from "expo-router";
import Feather from "@expo/vector-icons/Feather";
import * as Animatable from "react-native-animatable";
import { useUser } from "@supabase/auth-helpers-react";  // Import useUser to get user details
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
  FINANCIAL: 10,
  ENVIRONMENTAL: 3,
  SAFETY: 4,
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

const departmentsData = [
  { name: "CCMS", plans: 36 },
  { name: "CENG", plans: 25 },
  { name: "CAFA", plans: 24 },
  { name: "CBA", plans: 22 },
  { name: "CNAHS", plans: 18 },
];

const AdminDashboard = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current; // Initial opacity for department rows
  const scaleAnim = useRef(new Animated.Value(0)).current; // Initial scale for pie chart

  const user = useUser();  // Get the current logged-in user
  const [notifications, setNotifications] = useState([]);  

  const scheduleNotification = useCallback(async (value) => {
    const message = `Risk level is ${value}`;
    
    // Send notification to the database
    await sendNotification(user.id, message); // Pass the user ID and the message

    // Schedule the local notification
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Risk Alert",
        body: message,
        data: { value },
      },
      trigger: null,
    });
  }, [user.id]);

  // Check values and send notification if any are above 60
  useEffect(() => {
    Object.values(VALUES).forEach((value) => {
      if (value > 60) {
        scheduleNotification(value);
      }
    });
  }, [scheduleNotification]);

  // Request notification permissions on mount
  useEffect(() => {
    const requestPermissions = async () => {
      const { status } = await Notifications.getPermissionsAsync();
      if (status !== "granted") {
        await Notifications.requestPermissionsAsync();
      }
    };

    requestPermissions();
  }, []);

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
      <View style={styles.legendContainer}>
        {Object.keys(COLORS).map((key) => (
          <View style={styles.legendRow} key={key}>
            {renderDot(COLORS[key])}
            <Text style={styles.legendText}>
              {key}: {VALUES[key]}%
            </Text>
          </View>
        ))}
      </View>
    );
  };

  const handleDepartmentPress = (departmentName) => {
    console.log(`Department ${departmentName} clicked`);
  };

  const handlePieSectionPress = (section) => {
    console.log(`${section.label} section clicked`);
  };

  const renderDepartmentPlans = () => {
    return departmentsData.map((department, index) => (
      <Animatable.View
        key={department.name}
        animation="fadeInUp"
        delay={index * 200} // Stagger animation for each department row
        duration={800}
      >
        <TouchableOpacity onPress={() => handleDepartmentPress(department.name)}>
          <View style={styles.departmentRow}>
            <Text style={styles.departmentName}>{department.name}</Text>
            <View style={styles.plansContainer}>
              <Text style={styles.departmentPlans}>{department.plans}</Text>
              <MaterialIcons name="arrow-right" size={28} color="black" />
            </View>
          </View>
        </TouchableOpacity>
      </Animatable.View>
    ));
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" hidden={false}></StatusBar>

      <View style={styles.headerContainer}>
        <Text style={styles.appName}>Admin Dashboard</Text>
        <Link href="pages/components/profile"></Link>
      </View>

      <ScrollView style={{ flex: 1 }}>
        <View style={styles.cardContainer}>
          <View style={styles.risksCard}>
            <Text style={styles.risksTitle}>Risks</Text>
            <View style={styles.pieChartContainer}>
              <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                <PieChart
                  donut
                  data={pieData.map((section) => ({
                    ...section,
                    onPress: () => handlePieSectionPress(section),
                  }))}
                  sectionAutoFocus
                  radius={120}
                  focusOnPress
                  innerRadius={60}
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
            </View>
            {renderLegendComponent()}
            <Link href="pages/admin/risks" style={styles.arrowContainer}>
              <MaterialIcons name="arrow-forward-ios" size={24} color="black" />
            </Link>
          </View>
        </View>

        <View style={styles.cardContainer}>
          <View style={styles.risksCard}>
            <Text style={styles.risksTitle}>Plans</Text>
            <Link href="pages/admin/plans" style={styles.arrowContainer}>
              <MaterialIcons name="arrow-forward-ios" size={24} color="black" />
            </Link>
            {renderDepartmentPlans()}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AdminDashboard;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight + 8 : 0,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  appName: {
    fontSize: 24,
    fontWeight: "bold",
  },
  cardContainer: {
    paddingHorizontal: 16,
    marginVertical: 10,
  },
  risksCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  risksTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  pieChartContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  legendContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  legendRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  legendText: {
    fontSize: 16,
  },
  departmentRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
  departmentName: {
    fontSize: 18,
  },
  plansContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  departmentPlans: {
    fontSize: 16,
    marginRight: 10,
  },
  arrowContainer: {
    alignSelf: "flex-end",
    marginTop: 10,
  },
});
