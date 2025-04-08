let use24Hour = false;

function updateDateTime() {
  try {
    const now = new Date();
    const dateElement = document.getElementById('date');
    const timeElement = document.getElementById('time');

    if (!dateElement || !timeElement) {
      console.error("Date or time elements are missing in HTML.");
      return;
    }

    const date = now.toLocaleDateString(undefined, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    const time = now.toLocaleTimeString(undefined, {
      hour12: !use24Hour,
    });

    dateElement.textContent = date;
    timeElement.textContent = time;
  } catch (error) {
    console.error("Error updating date and time: ", error);
  }
}

function detectLocation() {
  const locationElement = document.getElementById('location');

  if (!locationElement) {
    console.error("Location element is missing in HTML.");
    return;
  }

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`)
          .then((response) => response.json())
          .then((data) => {
            const city = data.address.city || data.address.town || data.address.village || "your area";
            const country = data.address.country || "";
            locationElement.textContent = `${city}, ${country}`;
          })
          .catch(() => {
            locationElement.textContent = "Location unavailable. Try again later.";
          });
      },
      (error) => {
        if (error.code === error.PERMISSION_DENIED) {
          locationElement.innerHTML = 'Permission denied. Please allow location access in your browser settings.';
        } else {
          locationElement.innerHTML = 'Unable to retrieve location. Please try again.';
        }
      }
    );
  } else {
    locationElement.textContent = "Geolocation not supported by your browser.";
  }
}

function setupButtons() {
  document.getElementById("homeBtn").addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  document.getElementById("settingsBtn").addEventListener("click", () => {
    use24Hour = !use24Hour;
    updateDateTime();
    alert(`Time format changed to ${use24Hour ? '24-hour' : '12-hour'} mode.`);
  });

  document.getElementById("worldBtn").addEventListener("click", () => {
    const worldTimes = document.getElementById("worldTimes");
    const cities = [
      { name: "New York", zone: "America/New_York" },
      { name: "London", zone: "Europe/London" },
      { name: "Tokyo", zone: "Asia/Tokyo" }
    ];

    worldTimes.innerHTML = '';
    cities.forEach(city => {
      const time = new Date().toLocaleTimeString(undefined, {
        timeZone: city.zone,
        hour12: !use24Hour
      });
      const li = document.createElement("li");
      li.textContent = `${city.name}: ${time}`;
      worldTimes.appendChild(li);
    });

    document.getElementById("worldModal").classList.remove("hidden");
  });
  
  document.querySelector(".close-btn").addEventListener("click", () => {
    document.getElementById("worldModal").classList.add("hidden");
  });
}

setInterval(updateDateTime, 1000);
updateDateTime();
detectLocation();
setupButtons();
