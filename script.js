async function sendMessage() {
  const userInput = document.getElementById('userInput');
  const chatbox = document.getElementById('chatbox');
  const message = userInput.value.trim();
  if (message === "") return;

  const userMessage = document.createElement('div');
  userMessage.className = 'message user';
  userMessage.textContent = message;
  chatbox.appendChild(userMessage);
  userInput.value = "";

  const botMessage = document.createElement('div');
  botMessage.className = 'message bot';
  botMessage.textContent = "🔄 Αναλύω την ερώτησή σου...";
  chatbox.appendChild(botMessage);
  chatbox.scrollTop = chatbox.scrollHeight;

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message })
    });

    const data = await response.json();
    botMessage.textContent = data.reply || "⚠️ Δεν δόθηκε απάντηση από το AgroBot.";
  } catch (error) {
    botMessage.textContent = "⚠️ Σφάλμα κατά την επικοινωνία με τον AgroBot.";
    console.error(error);
  }

  chatbox.scrollTop = chatbox.scrollHeight;
}

document.getElementById('userInput').addEventListener('keydown', function(e) {
  if (e.key === 'Enter') sendMessage();
});
