document.addEventListener('DOMContentLoaded', () => {
  const loginBtn = document.getElementById('login-btn');
  const logoutBtn = document.getElementById('logout-btn');
  const loginSection = document.getElementById('login-section');
  const emailSection = document.getElementById('email-section');
  const emailList = document.getElementById('email-list');

  // Login Event
  loginBtn.addEventListener('click', async () => {
    try {
      const { token } = await authenticateWithGoogle();

      loginSection.classList.add('hidden');
      emailSection.classList.remove('hidden');

      let emails = await fetchGmailMessages(token);

      // Sort emails by score (highest to lowest)
      emails.sort((a, b) => b.score - a.score);

      // Render emails dynamically
      renderEmails(emails, token);
    } catch (error) {
      console.error('Login failed:', error);
      alert(error.message);
    }
  });

  // Logout Event
  logoutBtn.addEventListener('click', () => {
    chrome.storage.sync.get(['authToken'], async ({ authToken }) => {
      if (!authToken) {
        alert('You are already logged out.');
        return;
      }

      chrome.identity.removeCachedAuthToken({ token: authToken }, async () => {
        try {
          await fetch(`https://oauth2.googleapis.com/revoke?token=${authToken}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          });
          console.log('Token revoked successfully.');
        } catch (error) {
          console.error('Error revoking token:', error);
        }

        chrome.storage.sync.set({ authToken: null }, () => {
          loginSection.classList.remove('hidden');
          emailSection.classList.add('hidden');
          emailList.innerHTML = '';
          alert('Logged out successfully.');
        });
      });
    });
  });
});

// Render Emails
function renderEmails(emails, token) {
  const emailList = document.getElementById('email-list');

  emailList.innerHTML = emails
    .map(
      (email) => `
        <div class="email-item" id="email-${email.id}">
          <div class="email-header">
            <span class="label ${email.label.toLowerCase()}">${email.label}</span>
            <div class="score ${
              email.score > 80
                ? 'green'
                : email.score > 50
                ? 'yellow'
                : 'red'
            }">${email.score}</div>
          </div>
          <h3 class="email-title">${email.subject}</h3>
          <p class="email-info">Received: ${new Date(
            parseInt(email.internalDate)
          ).toLocaleString()}</p>
          <div class="email-actions">
            <button class="summarize" data-id="${email.id}">Summarize</button>
            <button class="view" data-id="${email.id}">View Full Email</button>
          </div>
        </div>
      `
    )
    .join('');

  // Attach event listeners to dynamically created buttons
  document.querySelectorAll('.summarize').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const emailId = e.target.getAttribute('data-id');
      summarizeEmail(emailId, token);
    });
  });

  document.querySelectorAll('.view').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const emailId = e.target.getAttribute('data-id');
      viewOriginalEmail(emailId);
    });
  });
}

// Summarize Email
async function summarizeEmail(emailId, token) {
  try {
    console.log(`Summarize button clicked for email ID: ${emailId}`);
    const emailBody = await fetchEmailBody(emailId, token);

    // Call AI Model for summarization (Hugging Face example)
    const summary = await summarizeText(emailBody.body);

    const emailCard = document.getElementById(`email-${emailId}`);
    emailCard.innerHTML = `
      <div class="email-summary">
        <h3>Summary</h3>
        <p>${summary}</p>
        <button class="view" onclick="viewOriginalEmail('${emailId}')">View in Gmail</button>
        <button class="close-btn" onclick="renderEmailsAfterClose('${token}')">X</button>
      </div>
    `;
  } catch (error) {
    console.error('Error summarizing email:', error);
    alert('Failed to summarize the email.');
  }
}

// View Original Email in Gmail
function viewOriginalEmail(emailId) {
  const gmailUrl = `https://mail.google.com/mail/u/2/#inbox/${emailId}`;
  window.open(gmailUrl, '_blank');
}

// Close and Re-render Emails
function renderEmailsAfterClose(token) {
  const emailSection = document.getElementById('email-section');
  const emailList = document.getElementById('email-list');
  emailSection.scrollIntoView({ behavior: 'smooth' });
  emailList.innerHTML = ''; // Re-render original content if needed.
}

// Fetch Email Body
async function fetchEmailBody(emailId, token) {
  const response = await fetch(
    `https://gmail.googleapis.com/gmail/v1/users/me/messages/${emailId}?format=full`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) throw new Error('Failed to fetch email body.');

  const emailData = await response.json();
  const bodyData =
    emailData.payload.parts?.[0]?.body?.data || emailData.payload.body?.data || '';
  console.log(`Fetched email body for ${emailId}:`, bodyData);
  return {
    body: decodeURIComponent(
      atob(bodyData.replace(/-/g, '+').replace(/_/g, '/'))
    ),
  };
}

// Hugging Face Summarization
async function summarizeText(text) {
  const response = await fetch('https://api-inference.huggingface.co/models/facebook/bart-large-cnn', {
    method: 'POST',
    headers: {
      Authorization: 'Bearer YOUR_HUGGINGFACE_API_KEY',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ inputs: text }),
  });

  if (!response.ok) throw new Error('Failed to summarize the text.');

  const data = await response.json();
  console.log('Summarization Response:', data);
  return data[0]?.summary_text || 'Unable to generate summary.';
}
