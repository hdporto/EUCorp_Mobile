import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { PieChart } from "react-native-gifted-charts";
import Feather from "@expo/vector-icons/Feather";

const COLORS = {
  All: "#007bff",
  Manpower: "#999999",
  Financial: "#777777",
  Environmental: "#555555",
  Safety: "#111111",
};

const VALUES = {
  MANPOWER: 53,
  FINANCIAL: 21,
  ENVIRONMENTAL: 13,
  SAFETY: 10,
};

const pieData = [
  { value: VALUES.MANPOWER, color: COLORS.Manpower, label: "Manpower" },
  { value: VALUES.FINANCIAL, color: COLORS.Financial, label: "Financial" },
  {
    value: VALUES.ENVIRONMENTAL,
    color: COLORS.Environmental,
    label: "Environmental",
  },
  { value: VALUES.SAFETY, color: COLORS.Safety, label: "Safety" },
];

const riskStatements = [
  { id: "1", statement: "RRN-CCMS-01", category: "Manpower" },
  { id: "2", statement: "RRN-CCMS-02", category: "Financial" },
  { id: "3", statement: "RRN-CCMS-03", category: "Environmental" },
  { id: "4", statement: "RRN-CCMS-04", category: "Safety" },
  { id: "5", statement: "RRN-CCMS-05", category: "Manpower" },
];

const DepartmentRisks = () => {
  const [filter, setFilter] = useState("All");

  const filteredRiskStatements = riskStatements.filter((item) => {
    if (filter === "All") return true;
    return item.category === filter;
  });

  const renderRiskStatement = ({ item }) => (
    <View>
      <Text style={styles.uploadedText}>
        College of Computing and Multimedia Studies uploaded:
      </Text>
      <Text style={styles.riskStatementText}>{item.statement}</Text>
      <View style={styles.separator} />
    </View>
  );

  return (
    <View>
      <View style={styles.pieChartContainer}>
        <Text style={styles.title}>Risks</Text>
        <PieChart
          donut
          data={pieData}
          sectionAutoFocus
          radius={120}
          innerRadius={80}
          innerCircleColor={"white"}
          centerLabelComponent={() => (
            <View>
              <Feather name="alert-triangle" size={50} color={"#F35454"} />
            </View>
          )}
        />
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterContainer}
      >
        {Object.keys(COLORS).map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.filterButton,
              { backgroundColor: COLORS[category] },
              filter === category && styles.activeFilterButton,
            ]}
            onPress={() => setFilter(category)}
          >
            <Text style={styles.filterButtonText}>{category}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.listCard}>
        <Text style={styles.risksTitle}>Risk Report</Text>
        <FlatList
          data={filteredRiskStatements}
          renderItem={renderRiskStatement}
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
  riskStatementText: {
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
    justifyContent: "center",
    marginVertical: 10,
    paddingHorizontal: 10,
  },
  filterButton: {
    marginHorizontal: 5,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  activeFilterButton: {
    borderColor: "#fff",
    borderWidth: 2,
  },
  filterButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default DepartmentRisks;
