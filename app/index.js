import { StyleSheet, View, Text } from "react-native";
import {
  SessionContextProvider,
  useSession,
  useUser,
} from "@supabase/auth-helpers-react";
import { supabase } from "../supabaseClient";
import { useEffect, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialIcons, Feather } from "@expo/vector-icons";
import CustomHeader from "./pages/components/CustomHeader";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { Login } from "./auth/login";

import AdminDashboard from "./pages/admin/home";
import AdminPlans from "./pages/admin/plans";
import AdminRisks from "./pages/admin/risks";
import AdminOpportunities from "./pages/admin/opportunities";
import AdminDetails from "./pages/admin/details";

import { DepartmentDashboard } from "./pages/department/home";
import DepartmentPlans from "./pages/department/plans";
import DepartmentRisks from "./pages/department/risks";
import DepartmentOpportunities from "./pages/department/opportunities";
import DepartmentDetails from "./pages/department/details";

import Notifications from "./pages/components/Notifications";

const Tab = createBottomTabNavigator();

const Main = () => {
  const session = useSession();
  const user = useUser();
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAndInsertUser = async () => {
      if (user) {
        try {
          const { data, error } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", user.id)
            .single();

          if (error && error.code === "PGRST116") {
            const { error: insertError } = await supabase
              .from("profiles")
              .insert([{ id: user.id, email: user.email, role: "user" }]);

            if (insertError) {
              alert("Error adding to profiles table: " + insertError.message);
            } else {
              alert("User added to profiles table");
              setRole("user");
            }
          } else if (data) {
            setRole(data.role);
          }
        } catch (error) {
          console.error("Error fetching user role:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    checkAndInsertUser();
  }, [user]);

  useEffect(() => {
    const saveSession = async () => {
      if (session) {
        try {
          await AsyncStorage.setItem("session", JSON.stringify(session));
        } catch (error) {
          console.log("Error saving session", error);
        }
      }
    };

    saveSession();
  }, [session]);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!session) {
    return <Login />;
  }

  return role ? (
    <Tab.Navigator
      screenOptions={{
        headerShown: true,
        tabBarShowLabel: true,
        tabBarActiveTintColor: "#e91e63",
        tabBarInactiveTintColor: "#ccc",
        tabBarStyle: {
          backgroundColor: "#ffffff",
          paddingBottom: 10,
          height: 60,
        },
        headerShown: true,

        header: () => <CustomHeader />, // Custom header for the tab navigator
      }}
    >
      {role === "admin" ? (
        <>
          <Tab.Screen
            name="home"
            component={AdminDashboard}
            options={{
              title: "Home",
              tabBarIcon: ({ color, size }) => (
                <MaterialIcons name="home" size={size} color={color} />
              ),
            }}
          />
          <Tab.Screen
            name="plans"
            component={AdminPlans}
            options={{
              title: "Plans",
              tabBarIcon: ({ color, size }) => (
                <Feather name="clipboard" size={size} color={color} />
              ),
            }}
          />
          <Tab.Screen
            name="risks"
            component={AdminRisks}
            options={{
              title: "Risks",
              tabBarIcon: ({ color, size }) => (
                <Feather name="alert-triangle" size={size} color={color} />
              ),
            }}
          />
          <Tab.Screen
            name="opportunities"
            component={AdminOpportunities}
            options={{
              title: "Opportunities",
              tabBarIcon: ({ color, size }) => (
                <Feather name="trending-up" size={size} color={color} />
              ),
            }}
          />
          <Tab.Screen
            name="details"
            component={AdminDetails}
            options={{
              title: "Profile",
              tabBarIcon: ({ color, size }) => (
                <Feather name="user" size={size} color={color} />
              ),
            }}
          />

          <Tab.Screen
            name="Notifications"
            component={Notifications}
            options={{
              title: "Notifications",
              tabBarIcon: ({ color, size }) => (
                <Feather name="user" size={size} color={color} />
              ),
            }}
          />
        </>
      ) : (
        <>
          <Tab.Screen
            name="home"
            component={DepartmentDashboard}
            options={{
              title: "Home",
              tabBarIcon: ({ color, size }) => (
                <MaterialIcons name="home" size={size} color={color} />
              ),
            }}
          />
          <Tab.Screen
            name="risks"
            component={DepartmentRisks}
            options={{
              title: "Risks",
              tabBarIcon: ({ color, size }) => (
                <Feather name="alert-triangle" size={size} color={color} />
              ),
            }}
          />
          <Tab.Screen
            name="plans"
            component={DepartmentPlans}
            options={{
              title: "Plans",
              tabBarIcon: ({ color, size }) => (
                <Feather name="clipboard" size={size} color={color} />
              ),
            }}
          />
          <Tab.Screen
            name="opportunities"
            component={DepartmentOpportunities}
            options={{
              title: "Opportunities",
              tabBarIcon: ({ color, size }) => (
                <Feather name="trending-up" size={size} color={color} />
              ),
            }}
          />
          <Tab.Screen
            name="details"
            component={DepartmentDetails}
            options={{
              title: "Profile",
              tabBarIcon: ({ color, size }) => (
                <Feather name="user" size={size} color={color} />
              ),
            }}
          />
          <Tab.Screen
            name="Notifications"
            component={Notifications}
            options={{
              title: "Notifications",
              tabBarIcon: ({ color, size }) => (
                <Feather name="bell" size={size} color={color} />
              ),
            }}
          />
        </>
      )}
    </Tab.Navigator>
  ) : null;
};

export default function Page() {
  const [initialSession, setInitialSession] = useState(null);
  const [loadingSession, setLoadingSession] = useState(true);

  useEffect(() => {
    const loadSession = async () => {
      try {
        const sessionData = await AsyncStorage.getItem("session");
        if (sessionData) {
          const session = JSON.parse(sessionData);
          setInitialSession(session);
        }
      } catch (error) {
        console.log("Error loading session", error);
      } finally {
        setLoadingSession(false);
      }
    };

    loadSession();
  }, []);

  if (loadingSession) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SessionContextProvider
        supabaseClient={supabase}
        initialSession={initialSession}
      >
        <Main />
      </SessionContextProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
});
