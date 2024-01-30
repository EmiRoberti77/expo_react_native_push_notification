import { useState, useEffect } from "react";
import { Text, View, Button, Platform } from "react-native";

import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function App() {
  const [expoPushNotification, setExpoPushNotification] = useState("");

  useEffect(() => {
    console.log("registering for notifications");
    registerForPushNotificationsAsync()
      .then((token) => {
        console.log("token", token);
        setExpoPushNotification(token);
      })
      .catch((err) => console.log(err));
  }, []);

  async function registerForPushNotificationsAsync() {
    let token;

    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }

    if (Device.isDevice) {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        alert("Failed to get push token for push notification!");
        return;
      }
      token = await Notifications.getExpoPushTokenAsync({
        projectId: "90f475e2-93bd-4cbb-aed8-cd7dbe78bd38",
      });
      console.log(token);
    } else {
      alert("Must use physical device for Push Notifications");
    }

    return token.data;
  }

  const sendNotification = async () => {
    const message = {
      to: expoPushNotification,
      title: "my first push yesh",
      body: "my first push notification with expo",
      sound: "default",
    };

    await fetch("https://expo.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        host: "exp.host",
        accept: "application/json",
        "accept-encoding": "gzip, deflate",
        "content-type": "application/json",
      },
      body: JSON.stringify(message),
    });
  };

  return (
    <View style={{ marginTop: 100 }}>
      <Text>Expo react natice notification</Text>
      <Button title="send push notification" onPress={sendNotification} />
    </View>
  );
}
