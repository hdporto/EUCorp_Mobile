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

const DepartmentOpportunities = () => {
  const pieData = [
    { value: 70, color: "green" },
    { value: 30, color: "lightgray" },
  ];

  const optData = [
    { id: "1", message: "OPPORTUNITY STATEMENT 1", status: "ACHIEVED" },
    { id: "2", message: "OPPORTUNITY STATEMENT 2", status: "ACHIEVED" },
    { id: "3", message: "OPPORTUNITY STATEMENT 3", status: "ACHIEVED" },
    { id: "4", message: "OPPORTUNITY STATEMENT 4", status: "NOT ACHIEVED" },
    { id: "5", message: "OPPORTUNITY STATEMENT 5", status: "NOT ACHIEVED" },
    { id: "6", message: "OPPORTUNITY STATEMENT 6", status: "NOT ACHIEVED" },
  ];

  const [filter, setFilter] = useState("all");

  const filteredOptStatements = optData.filter((opt) => {
    if (filter === "ACHIEVED") {
      return opt.status === "ACHIEVED";
    } else if (filter === "NOT ACHIEVED") {
      return opt.status === "NOT ACHIEVED";
    }
    return true;
  });

  const renderOptStatement = ({ item }) => {
    return (
      <View>
        <Text style={styles.uploadedText}>{item.message}</Text>
        <Text style={styles.optText}>{item.status}</Text>
        <View style={styles.separator} />
      </View>
    );
  };

  return (
    <View>
      <Animatable.View
        animation="zoomIn"
        duration={1000}
        easing={Easing.bounce}
        style={styles.pieChartContainer}
      >
        <Text style={styles.title}>Opportunities</Text>
        <PieChart
          donut
          data={pieData}
          sectionAutoFocus
          radius={120}
          innerRadius={80}
          innerCircleColor={"white"}
          centerLabelComponent={() => (
            <>
              <Text style={styles.centerLabel}>70%</Text>
              <Text style={styles.centerSubtitle}>Completed Tasks</Text>
            </>
          )}
        />
      </Animatable.View>

      <View style={styles.filterContainer}>
        {["ALL", "ACHIEVED", "NOT ACHIEVED"].map((item) => (
          <Animatable.View
            key={item}
            animation="bounceIn"
            duration={800}
            delay={item === "ALL" ? 0 : item === "ACHIEVED" ? 200 : 400}
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

      <View style={styles.listCard}>
        <Text style={styles.optTitle}>Opportunities Report</Text>
        <FlatList
          data={filteredOptStatements}
          renderItem={renderOptStatement}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      </View>
    </View>
  );
};

export default DepartmentOpportunities;

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
    borderRadius: 20,
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
  listCard: {
    margin: 20,
    padding: 20,
    borderRadius: 14,
    backgroundColor: "white",
    height: 280,
  },
  uploadedText: {
    color: "black",
    paddingVertical: 10,
  },
  optText: {
    color: "blue",
    fontWeight: "bold",
    paddingVertical: 5,
  },
  separator: {
    height: 1,
    backgroundColor: "#e0e0e0",
    marginVertical: 5,
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
    marginHorizontal: 5,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "#007bff",
    borderRadius: 8,
  },
  filterButtonText: {
    color: "#fff",
    fontWeight: "bold",
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
