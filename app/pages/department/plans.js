import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { PieChart } from "react-native-gifted-charts";

const DepartmentPlans = () => {
  const pieData = [
    { value: 80, color: "green" },
    { value: 20, color: "lightgray" },
  ];

  const plansData = [
    { id: "1", message: "STRAT. OBJ 1", status: "ACHIEVED" },
    { id: "2", message: "STRAT. OBJ 2", status: "ACHIEVED" },
    { id: "3", message: "STRAT. OBJ 3", status: "ACHIEVED" },
    { id: "4", message: "STRAT. OBJ 4", status: "NOT ACHIEVED" },
    { id: "5", message: "STRAT. OBJ 5", status: "NOT ACHIEVED" },
    { id: "6", message: "STRAT. OBJ 6", status: "NOT ACHIEVED" },
  ];

  const [filter, setFilter] = useState("all");

  const filteredPlans = plansData.filter((plan) => {
    if (filter === "ACHIEVED") {
      return plan.status === "ACHIEVED";
    } else if (filter === "NOT ACHIEVED") {
      return plan.status === "NOT ACHIEVED";
    }
    return true;
  });

  const renderPlansStatement = ({ item }) => {
    return (
      <View>
        <Text style={styles.uploadedText}>{item.message}</Text>
        <Text style={styles.plansText}>{item.status}</Text>
        <View style={styles.separator} />
      </View>
    );
  };

  return (
    <View>
      <View style={styles.pieChartContainer}>
        <Text style={styles.title}>Plans</Text>
        <PieChart
          donut
          data={pieData}
          sectionAutoFocus
          radius={120}
          innerRadius={80}
          innerCircleColor={"white"}
          centerLabelComponent={() => (
            <>
              <Text style={styles.centerLabel}>80%</Text>
              <Text style={styles.centerSubtitle}>Completed Plans</Text>
            </>
          )}
        />
      </View>

      <View style={styles.filterContainer}>
        <TouchableOpacity
          onPress={() => setFilter("ALL")}
          style={[styles.filterButton, filter === "ALL" && styles.activeFilter]}
        >
          <Text style={styles.filterText}>ALL</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setFilter("ACHIEVED")}
          style={[
            styles.filterButton,
            filter === "ACHIEVED" && styles.activeFilter,
          ]}
        >
          <Text style={styles.filterText}>ACHIEVED</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setFilter("NOT ACHIEVED")}
          style={[
            styles.filterButton,
            filter === "NOT ACHIEVED" && styles.activeFilter,
          ]}
        >
          <Text style={styles.filterText}>NOT ACHIEVED</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.listCard}>
        <Text style={styles.risksTitle}>Plans Report</Text>
        <FlatList
          data={filteredPlans}
          renderItem={renderPlansStatement}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      </View>
    </View>
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
  centerSubtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
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
  plansText: {
    color: "blue",
    fontWeight: "bold",
    paddingVertical: 5,
  },
  separator: {
    height: 1,
    backgroundColor: "#e0e0e0",
    marginVertical: 5,
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
  activeFilter: {
    backgroundColor: "#0056b3",
  },
  filterText: {
    color: "#fff",
    fontWeight: "bold",
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

export default DepartmentPlans;
