import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
  Image
} from "react-native";
import { makeRedirectUri } from "expo-auth-session";
import * as QueryParams from "expo-auth-session/build/QueryParams";
import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";
import { supabase } from "../../supabaseClient";
import { FontAwesome } from "@expo/vector-icons"; 

WebBrowser.maybeCompleteAuthSession(); 
const redirectTo = makeRedirectUri();

const createSessionFromUrl = async (url) => {
  const { params, errorCode } = QueryParams.getQueryParams(url);

  if (errorCode) throw new Error(errorCode);
  const { access_token, refresh_token } = params;

  if (!access_token) return;

  const { data, error } = await supabase.auth.setSession({
    access_token,
    refresh_token,
  });

  if (error) throw error;
  return data.session;
};

const sendMagicLink = async (email) => {
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: redirectTo,
    },
  });

  if (error) throw error; // Handle error if email sending fails
};

export const Login = () => {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const url = Linking.useURL(); // Get URL to handle deep links
  
    useEffect(() => {
  
      const checkSession = async () => {
        const storedSession = await AsyncStorage.getItem("session");
        if (storedSession) {
          const session = JSON.parse(storedSession);
          await supabase.auth.recoverSession(session.access_token);
        }
      }
  
  
  
      if (url) {
        createSessionFromUrl(url).catch((error) =>
          console.error("Session Error:", error)
        );
      }
    }, [url]);
  
    const handleMagicLink = async () => {
      setLoading(true);
      try {
        await sendMagicLink(email); // Send the magic link
        Alert.alert("Check your email", "Magic link sent!");
      } catch (error) {
        Alert.alert("Error", error.message);
      } finally {
        setLoading(false);
      }
    };
  
    return (
      <View style={styles.container}>
        <Image source={require('../../assets/login.png')} style={styles.logo} />
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>Welcome to Eucorp!</Text>
          <Text style={styles.subText}>Enter your email to log in</Text>
        </View>
  
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor="#aaa"
          />
        </View>
  
        <TouchableOpacity
          style={styles.loginButton}
          onPress={handleMagicLink}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#ffffff" />
          ) : (
            <Text style={styles.loginText}>Send Magic Link</Text>
          )}
        </TouchableOpacity>
      </View>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 20,
      backgroundColor: "#f7f7f7",
    },
    logo: {
      width: 300,
      height: 300,
      marginBottom: 30,
      borderRadius: 60,
    },
    logoContainer: {
      alignItems: "center",
      marginBottom: 40,
    },
    logoText: {
      fontSize: 28,
      fontWeight: "bold",
      color: "#333",
    },
    subText: {
      fontSize: 16,
      color: "#555",
      marginTop: 5,
    },
    inputContainer: {
      flexDirection: "row",
      alignItems: "center",
      borderWidth: 2,
      borderColor: "#ccc",
      paddingHorizontal: 10,
      marginBottom: 25,
      width: "80%",
    },
    icon: {
      marginRight: 10,
    },
    input: {
      height: 40,
      flex: 1,
      color: "#333",
      fontSize: 16,
    },
    loginButton: {
      backgroundColor: "#7600bc",
      width: "80%",
      paddingVertical: 12,
      borderRadius: 8,
      justifyContent: "center",
      alignItems: "center",
      marginTop: 20,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    loginText: {
      color: "#fff",
      fontSize: 18,
      fontWeight: "bold",
    },
  });