// ====== НАЛАШТУВАННЯ ======
const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbweA-1U2eAOH0SPGMff8UMP_EncLmKVl8FgsxtG4cth_FhI-AmX0JdDf7EOR3MY3UMQ/exec";
const SECRET = "mySuperSecret123"; // має співпадати з SECRET в Apps Script


// ====== ДОПОМІЖНІ ФУНКЦІЇ ======
function setStatus(text, isError = false) {
  const el = document.getElementById("status");
  if (!el) return;
  el.textContent = text;

  el.classList.toggle("text-danger", isError);
  el.classList.toggle("text-success", !isError && text.includes("✅"));
}

function getValue(id) {
  const el = document.getElementById(id);
  return el ? el.value.trim() : "";
}


// ====== ОСНОВНА ЛОГІКА ======
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("leadForm");

  if (!form) {
    console.error('Form with id="leadForm" not found');
    return;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = getValue("email");
    const telegram = getValue("telegram");
    const phone = getValue("phone");

    if (!email || !telegram || !phone) {
      setStatus("❌ Заповни всі поля", true);
      return;
    }
    if (!telegram.startsWith("@")) {
      setStatus("❌ Telegram має починатися з @", true);
      return;
    }

    const payload = {
      secret: SECRET,
      email,
      telegram,
      phone,
      browser: navigator.userAgent
    };

    const btn = form.querySelector('button[type="submit"]');
    if (btn) btn.disabled = true;

    setStatus("Відправляю...");

    try {
      // IMPORTANT:
      // mode: "no-cors" прибирає CORS помилку в браузері.
      // Ми НЕ читаємо відповідь, але запит доходить до Apps Script.
      await fetch(WEB_APP_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(payload)
      });

      setStatus("✅ Відправлено!");
      form.reset();

    } catch (err) {
      setStatus("❌ Network error. Спробуй ще раз або перевір інтернет.", true);
      console.error("Fetch error:", err);
    } finally {
      if (btn) btn.disabled = false;
    }
  });
});
