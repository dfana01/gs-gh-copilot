document.addEventListener("DOMContentLoaded", () => {
  const activitiesList = document.getElementById("activities-list");
  const activitySelect = document.getElementById("activity");
  const signupForm = document.getElementById("signup-form");
  const messageDiv = document.getElementById("message");

  // Fetch activities from the API
  fetch("/activities")
    .then((res) => res.json())
    .then((data) => {
      activitiesList.innerHTML = "";
      activitySelect.innerHTML = '<option value="">-- Select an activity --</option>';
      Object.entries(data).forEach(([name, activity]) => {
        // Render activity card with participants
        const card = document.createElement("div");
        card.className = "activity-card";
        card.innerHTML = `
          <h4>${name}</h4>
          <p><strong>Description:</strong> ${activity.description}</p>
          <p><strong>Schedule:</strong> ${activity.schedule}</p>
          <p><strong>Max Participants:</strong> ${activity.max_participants}</p>
          <div class="participants-section">
            <strong>Participants:</strong>
            <ul class="participants-list">
              ${activity.participants.length > 0 ? activity.participants.map(p => `<li>${p}</li>`).join('') : '<li class="no-participants">No participants yet</li>'}
            </ul>
          </div>
        `;
        activitiesList.appendChild(card);
        // Add to select
        const option = document.createElement("option");
        option.value = name;
        option.textContent = name;
        activitySelect.appendChild(option);
      });
    });

  // Handle form submission
  signupForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const activity = document.getElementById("activity").value;

    try {
      const response = await fetch(
        `/activities/${encodeURIComponent(activity)}/signup?email=${encodeURIComponent(email)}`,
        {
          method: "POST",
        }
      );

      const result = await response.json();

      if (response.ok) {
        messageDiv.textContent = result.message;
        messageDiv.className = "success";
        signupForm.reset();
      } else {
        messageDiv.textContent = result.detail || "An error occurred";
        messageDiv.className = "error";
      }

      messageDiv.classList.remove("hidden");

      // Hide message after 5 seconds
      setTimeout(() => {
        messageDiv.classList.add("hidden");
      }, 5000);
    } catch (error) {
      messageDiv.textContent = "Failed to sign up. Please try again.";
      messageDiv.className = "error";
      messageDiv.classList.remove("hidden");
      console.error("Error signing up:", error);
    }
  });
});
