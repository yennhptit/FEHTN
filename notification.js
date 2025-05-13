// // Format timestamp to readable format
// function formatTimestamp(timestamp) {
//   const date = new Date(timestamp);

//   const hours = String(date.getHours()).padStart(2, "0");
//   const minutes = String(date.getMinutes()).padStart(2, "0");
//   const seconds = String(date.getSeconds()).padStart(2, "0");
//   const day = String(date.getDate()).padStart(2, "0");
//   const month = String(date.getMonth() + 1).padStart(2, "0");
//   const year = date.getFullYear();

//   return `${hours}:${minutes}:${seconds} ${day}/${month}/${year}`;
// }

// // Get thumbnail URL from Google Drive link
// function getThumbnailUrl(originalUrl) {
//   const idMatch = originalUrl.match(/id=([^&]+)/);
//   if (!idMatch) return originalUrl;
//   const fileId = idMatch[1];
//   return `https://drive.google.com/thumbnail?id=${fileId}&sz=w50`;
// }

// // Mark a single notification as read
// function markAsRead(notificationId) {
//   fetch(`http://localhost:8080/api/violations/${notificationId}/mark-as-read`, {
//     method: 'PATCH',
//     headers: {
//       'Authorization': 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbiIsImV4cCI6MTc0OTczOTY0MiwiYXV0aCI6IlJPTEVfQURNSU4gUk9MRV9VU0VSIiwiaWF0IjoxNzQ3MTQ3NjQyfQ.BN2XTQYoI8ud10u3fzbymFMaaL8na33JW83ic_8Trh0Mo4lcZ5UJOH61pb_fchDBtDp72YzQeITMwSRuRQEzfg'
//     }
//   })
//   .then(response => {
//     if (response.ok) {
//       // Find the notification item
//       const notificationItem = document.querySelector(`.mark-read-btn[data-id="${notificationId}"]`).closest('.notification-item');
      
//       // Add fade-out animation
//       notificationItem.style.transition = 'all 0.5s ease';
//       notificationItem.style.opacity = '0';
//       notificationItem.style.transform = 'translateX(100%)';
      
//       // Remove the element after animation completes
//       setTimeout(() => {
//         notificationItem.parentElement.remove();
//       }, 500);
//     } else {
//       console.error('Failed to mark violation as read');
//     }
//   })
//   .catch(error => console.error('Error marking violation as read:', error));
// }

// // Initialize notification functionality
// function initializeNotifications() {
//   document.addEventListener("notiDataLoaded", function () {
//     console.log("Data loaded:", window.notiData);

//     const notificationList = document.querySelector(
//       ".dropdown-menu.notification-dropdown"
//     );

//     // Clear old notifications
//     notificationList.innerHTML = "";

//     // Loop over notiData and generate HTML
//     window.notiData.forEach((item) => {
//       let content = "";

//       if (item.type === "ALCOHOL") {
//         content = `Alcohol value: ${item.value}`;
//       } else if (item.type === "DROWSINESS") {
//         content = "Driver drowsiness detected.";
//       } else {
//         content = item.type;
//       }

//       const li = document.createElement("li");
//       li.innerHTML = `
//         <div class="notification-item unread">
//           <div class="d-flex justify-content-between align-items-center">
//             <div class="d-flex">
//               <div class="image">
//                 <img
//                   src="${getThumbnailUrl(item.driver.faceData)}"
//                   alt=""
//                 />
//               </div>
//               <div class="content">
//                 <h6>${item.driver.name}</h6>
//                 <p>${content}</p>
//                 <span>${formatTimestamp(item.timestamp) || "Just now"}</span>
//               </div>
//             </div>
//             <i class="lni lni-checkmark-circle mark-read-btn" style="cursor: pointer; color: #4A6CF7; font-size: 24px; padding: 8px; transition: all 0.3s ease;" data-id="${item.id}"></i>
//           </div>
//         </div>
//       `;
//       notificationList.appendChild(li);

//       // Add click handler for the mark as read icon
//       const markReadBtn = li.querySelector('.mark-read-btn');
//       markReadBtn.addEventListener('click', function(e) {
//         e.stopPropagation(); // Prevent event bubbling
//         const notificationId = this.getAttribute('data-id');
//         markAsRead(notificationId);
//         // Add click animation
//         this.style.transform = 'scale(1.2)';
//         this.style.color = '#2ecc71'; // Change to green color
        
//         // Reset animation after 300ms
//         setTimeout(() => {
//           this.style.transform = 'scale(1)';
//         }, 300);
//       });
//     });
//   });
// }

// // Export functions
// window.initializeNotifications = initializeNotifications; 