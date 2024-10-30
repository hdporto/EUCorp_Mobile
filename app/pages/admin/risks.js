import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { PieChart } from "react-native-gifted-charts";
import Feather from "@expo/vector-icons/Feather";
import RNPickerSelect from "react-native-picker-select";

const COLORS = {
  MANPOWER: "#999999",
  FINANCIAL: "#777777",
  ENVIRONMENTAL: "#555555",
  SAFETY: "#111111",
};

const VALUES = {
  MANPOWER: 53,
  FINANCIAL: 21,
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

const riskStatements = [
  { department: "CCMS", text: "Risk Statement 1, RRN-CCMS-01" },
  { department: "CENG", text: "Risk Statement 1, RRN-CENG-02" },
  { department: "CBA", text: "Risk Statement 1, RRN-CBA-03" },
  { department: "CAFA", text: "Risk Statement 1, RRN-CAFA-04" },
  { department: "CNAHS", text: "Risk Statement 1, RRN-CNAHS-05" },
  { department: "CCMS", text: "Risk Statement 2, RRN-CCMS-02" },
  { department: "CENG", text: "Risk Statement 2, RRN-CENG-02" },
];

const departments = [
  { label: "All", value: "All" },
  { label: "CCMS", value: "CCMS" },
  { label: "CENG", value: "CENG" },
  { label: "CBA", value: "CBA" },
  { label: "CAFA", value: "CAFA" },
  { label: "CNAHS", value: "CNAHS" },
];

const AdminRisks = () => {
  const [selectedDepartment, setSelectedDepartment] = useState("All");

  const filteredRisks =
    selectedDepartment === "All"
      ? riskStatements
      : riskStatements.filter((risk) => risk.department === selectedDepartment);

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


  const renderRiskStatement = ({ item }) => {
    return (
      <View>
        <Text style={styles.riskText}>{item.text}</Text>
        <View style={styles.separator} />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" hidden={false}></StatusBar>
      <View style={styles.cardContainer}>
        <View style={styles.risksCard}>
          <Text style={styles.risksTitle}>Risks</Text>
          <View style={styles.pieChartContainer}>
            <PieChart
              donut
              data={pieData.map((section) => ({
                ...section,
              }))}
              sectionAutoFocus
              radius={120}
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
          </View>
          {renderLegendComponent()}
        </View>

        {/* Dropdown Filter by Department */}
        <View style={styles.dropdownContainer}>
          <RNPickerSelect
            onValueChange={(value) => setSelectedDepartment(value)}
            items={departments.map((dept) => ({
              label: dept.label,
              value: dept.value,
            }))}
            placeholder={{ label: "Select Department", value: "All" }}
            style={pickerSelectStyles}
            value={selectedDepartment}
          />
        </View>

        {/* Card for the risk statements */}
        <View style={styles.listCard}>
          <FlatList
            data={filteredRisks}
            renderItem={renderRiskStatement}
            keyExtractor={(item, index) => index.toString()}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default AdminRisks;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f2f3f4",
  },
  cardContainer: {
    position: "relative",
  },
  risksCard: {
    margin: 20,
    padding: 20,
    borderRadius: 14,
    backgroundColor: "white",
  },
  risksTitle: {
    color: "black",
    fontSize: 24,
    fontWeight: "bold",
  },
  pieChartContainer: {
    padding: 20,
    alignItems: "center",
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
    marginHorizontal: 20, // Only horizontal margin, to avoid excess space vertically
    paddingVertical: 30, // Increase vertical padding inside the list card
    paddingHorizontal: 20,
    borderRadius: 14,
    backgroundColor: "white",
    height: 330,
  },
  riskText: {
    color: "black",
    paddingVertical: 10,
  },
  separator: {
    height: 1,
    backgroundColor: "#e0e0e0",
    marginVertical: 5,
  },
  dropdownContainer: {
    marginHorizontal: 20, // Adjust margin so it's the same as the list card
    marginBottom: 10, // Reduce the margin to lessen space between dropdown and list
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 4,
    color: "black",
    paddingRight: 30,
    backgroundColor: "#fff",
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 8,
    color: "black",
    paddingRight: 30,
    backgroundColor: "#fff",
  },
});

