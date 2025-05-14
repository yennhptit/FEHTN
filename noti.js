console.log("🚀 Script loaded successfully!");

// MQTT connection
const brokerUrl =
  "wss://0610ea90c79f47308af595e1d8fd47eb.s1.eu.hivemq.cloud:8884/mqtt";
const username = "nguyenhaiyen";
const password = "B21dccn129@";

const client = mqtt.connect(brokerUrl, {
  username: username,
  password: password,
  clientId: "js_client_" + Math.random().toString(16).substr(2, 8),
  clean: true,
  reconnectPeriod: 1000,
});

client.on("connect", () => {
  console.log("✅ Connected to MQTT broker");
  client.subscribe(["alcohol", "drowsiness"], (err) => {
    if (!err) {
      console.log("✅ Subscribed to topics: alcohol, drowsiness");
    } else {
      console.error("❌ Subscription error:", err);
    }
  });
});

client.on("message", (topic, message) => {
  fetchNotiData();
  console.log(
    `📩 Message received | Topic: ${topic} | Message: ${message.toString()}`
  );

  const spanElement = document.querySelector("#notification span");
  const modalElement = document.querySelector(
    ".dropdown-menu.notification-dropdown"
  );
  const isModalOpen = modalElement && modalElement.classList.contains("show");

  // Hiển thị <span> khi nhận được MQTT message
  if (spanElement) {
    if (!isModalOpen) {
      spanElement.style.display = "inline"; // Hiển thị <span> ngay lập tức khi có tin nhắn MQTT
      // spanElement.style.backgroundColor = "red"; // Màu nền đỏ nếu modal không mở
    } else {
      spanElement.style.display = "none"; // Hiển thị <span> ngay lập tức khi có tin nhắn MQTT

      // spanElement.style.backgroundColor = ""; // Trả về màu nền mặc định nếu modal mở
    }
  }
});

// ===================== Fetch dữ liệu cảnh báo ===================
let previousNotiCount = 0;

function fetchNotiData() {
  fetch("http://localhost:8080/api/violations/unread", {
    method: "GET",
    mode: "cors",
    headers: {
      accept: "*/*",
      Authorization:
        "Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbiIsImV4cCI6MTc0OTczOTY0MiwiYXV0aCI6IlJPTEVfQURNSU4gUk9MRV9VU0VSIiwiaWF0IjoxNzQ3MTQ3NjQyfQ.BN2XTQYoI8ud10u3fzbymFMaaL8na33JW83ic_8Trh0Mo4lcZ5UJOH61pb_fchDBtDp72YzQeITMwSRuRQEzfg",
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch notification data");
      }
      return response.json();
    })
    .then((data) => {
      console.log("Notification data:", data);

      // Sắp xếp theo timestamp
      const sortedData = data.sort(
        (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
      );

      // Lấy 5 mục đầu
      // const top5Data = sortedData.slice(0, 5);

      // Lưu vào window
      window.notiData = sortedData;
      document.dispatchEvent(new CustomEvent("notiDataLoaded"));

      const currentNotiCount = sortedData.length;
      const spanElement = document.querySelector("#notification span");
      const modalElement = document.querySelector(
        ".dropdown-menu.notification-dropdown"
      );

      const isModalOpen =
        modalElement && modalElement.classList.contains("show");

      // Kiểm tra số lượng thông báo và thay đổi trạng thái <span>
      // if (currentNotiCount > previousNotiCount) {
      //   if (spanElement) {
      //     spanElement.style.display = "inline"; // Hiển thị <span> khi có thông báo mới
      //     if (!isModalOpen) {
      //       spanElement.style.backgroundColor = "red"; // Nếu modal không mở thì hiển thị màu đỏ
      //     } else {
      //       spanElement.style.backgroundColor = ""; // Trở về màu mặc định nếu modal mở
      //     }
      //   }
      // } else {
      //   if (spanElement) {
      //     spanElement.style.display = "none"; // Ẩn <span> nếu không có thông báo mới
      //   }
      // }

      previousNotiCount = currentNotiCount;
    })
    .catch((error) => {
      console.error("Error fetching notification data:", error);
    });
}

// document.addEventListener("DOMContentLoaded", () => {
//   // Ẩn span khi trang được tải
//   const spanElement = document.querySelector("#notification span");
//   if (spanElement) {
//     spanElement.style.display = "none";
//   }
//   fetchNotiData();

//   setInterval(fetchNotiData, 1000); // Gọi fetchNotiData mỗi giây để lấy thông tin
// });
document.addEventListener("DOMContentLoaded", () => {
  // Ẩn span khi trang được tải
  const spanElement = document.querySelector("#notification span");
  if (spanElement) {
    spanElement.style.display = "none";
  }

  // Gọi fetch lần đầu
  fetchNotiData();

  // // Gọi fetch định kỳ
  // setInterval(fetchNotiData, 1000);

  // Gắn sự kiện click để gọi lại fetchNotiData
  const notiButton = document.getElementById("notification");
  if (notiButton) {
    notiButton.addEventListener("click", () => {
      console.log("🔄 Notification clicked, fetching data...");
      fetchNotiData();
    });
  }
});
