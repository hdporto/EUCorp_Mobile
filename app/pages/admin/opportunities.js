import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
} from "react-native";
import React, { useState, useEffect } from "react";
import { PieChart } from "react-native-gifted-charts";
import * as Animatable from "react-native-animatable";
import { Easing } from "react-native-reanimated";

const AdminOpportunities = () => {
  const pieData = [
    { value: 70, color: "green" },
    { value: 30, color: "lightgray" },
  ];

  const plansData = [
    { id: "1", message: "Strat Obj 1", status: "achieved" },
    { id: "2", message: "Strat Obj 2", status: "achieved" },
    { id: "3", message: "Strat Obj 3", status: "achieved" },
    { id: "4", message: "Strat Obj 4", status: "not achieved" },
    { id: "5", message: "Strat Obj 5", status: "not achieved" },
    { id: "6", message: "Strat Obj 6", status: "not achieved" },
  ];

  const [filter, setFilter] = useState("all");

  const filteredPlans = plansData.filter((plan) => {
    if (filter === "achieved") {
      return plan.status === "achieved";
    } else if (filter === "not achieved") {
      return plan.status === "not achieved";
    }
    return true;
  });

  const PlansItem = ({ message, status, index }) => (
    <Animatable.View
      animation="fadeInUp"
      duration={500}
      delay={index * 200}
      style={styles.notificationItem}
    >
      <View style={styles.messageContainer}>
        <Text style={styles.notificationMessage}>{message}</Text>
        <Text style={styles.notificationStatus}>{status}</Text>
      </View>
    </Animatable.View>
  );

  return (
    <View style={styles.mainContainer}>
      {/* Pie chart with scaling animation */}
      <Animatable.View
        animation="zoomIn"
        duration={1000}
        easing={Easing.bounce}
        style={styles.pieChartContainer}
      >
        <Text style={styles.title}>Opportunities Overview</Text>
        <PieChart
          data={pieData}
          donut
          innerRadius={80}
          centerLabelComponent={() => (
            <>
              <Text style={styles.centerLabel}>70%</Text>
              <Text style={styles.centerSubtitle}>Completed Tasks</Text>
            </>
          )}
        />
      </Animatable.View>

      {/* Filter buttons with scaling effect */}
      <View style={styles.filterContainer}>
        {["all", "achieved", "not achieved"].map((item) => (
          <Animatable.View
            key={item}
            animation="bounceIn"
            duration={800}
            delay={item === "all" ? 0 : item === "achieved" ? 200 : 400}
          >
            <TouchableOpacity
              onPress={() => setFilter(item)}
              style={[
                styles.filterButton,
                filter === item && styles.activeFilter,
              ]}
            >
              <Text style={styles.filterText}>{item}</Text>
            </TouchableOpacity>
          </Animatable.View>
        ))}
      </View>

      {/* List with staggered fade-in animation */}
      <View style={styles.container}>
        <Text style={styles.title}>All Opportunities</Text>
        <FlatList
          data={filteredPlans}
          renderItem={({ item, index }) => (
            <PlansItem message={item.message} status={item.status} index={index} />
          )}
          keyExtractor={(item) => item.id}
        />
      </View>
    </View>
  );
};

export default AdminOpportunities;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f8f9fa",
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
  centerLabel: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#007bff", 
  },
  centerSubtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 10,
  },
  filterButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#007bff",
    borderRadius: 8,
  },
  activeFilter: {
    backgroundColor: "#0056b3",
  },
  filterText: {
    color: "#fff",
    fontWeight: "bold",
  },
  container: {
    flex: 1,
    marginBottom: 20,
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
  },
  notificationItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  messageContainer: {
    flex: 1,
  },
  notificationMessage: {
    fontSize: 16,
    color: "#333",
  },
  notificationStatus: {
    fontSize: 12,
    color: "#007bff", 
  },
});
