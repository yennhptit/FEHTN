const mqtt = require("mqtt");

// Thông tin kết nối
const brokerUrl =
  "wss://0610ea90c79f47308af595e1d8fd47eb.s1.eu.hivemq.cloud:8884/mqtt";
const username = "nguyenhaiyen";
const password = "B21dccn129@";

// Tạo client
const client = mqtt.connect(brokerUrl, {
  username: username,
  password: password,
  clientId: "js_client_" + Math.random().toString(16).substr(2, 8),
  clean: true,
  reconnectPeriod: 1000, // reconnect mỗi 1s nếu mất kết nối
});

// Khi kết nối thành công
client.on("connect", () => {
  console.log("✅ Connected to MQTT broker");

  // Subscribe vào 2 topic
  client.subscribe(["alcohol", "drowsiness"], (err) => {
    if (!err) {
      console.log("✅ Subscribed to topics: alcohol, drowsiness");
    } else {
      console.error("❌ Subscription error:", err);
    }
  });
});

// Khi nhận được message
client.on("message", (topic, message) => {
  console.log(
    `📩 Message received | Topic: ${topic} | Message: ${message.toString()}`
  );

  // Xử lý riêng từng topic nếu cần
  if (topic === "alcohol") {
    console.log("⚠️ Alcohol alert!");
  } else if (topic === "drowsiness") {
    console.log("😴 Drowsiness detected!");
  }
  // Tìm phần tử <span id="mqtt-alert"> trên HTML
  const span = document.getElementById("mqtt-alert");
  if (span) {
    span.style.display = "inline"; // hiện span
  }

  // Xử lý riêng từng topic nếu cần
  if (topic === "alcohol") {
    console.log("⚠️ Alcohol alert!");
  } else if (topic === "drowsiness") {
    console.log("😴 Drowsiness detected!");
  }
});

// Khi lỗi kết nối
client.on("error", (err) => {
  console.error("❌ Connection error:", err);
});
