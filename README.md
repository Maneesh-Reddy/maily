# Email Priority Manager

## Project Overview
The *Email Priority Manager* is a Chrome extension that simplifies email management. Users can log in with their Google account, scan their Gmail inbox, and view prioritized emails based on deadlines and labels. It also leverages AI-powered summarization to generate concise email summaries, enhancing productivity.

---

## Features

- **Google Login**: Secure OAuth2-based authentication.
- **Email Scanning**: Fetches up to 50 recent emails from Gmail.
- **Prioritization**:
  - Scores emails based on labels and deadlines.
  - Sorts emails dynamically by priority.
- **Summarization**: Uses Hugging Face models for AI-generated summaries.
- **Email Viewing**: Provides direct links to open emails in Gmail.
- **Logout**: Securely revokes the user's session.

---

## Technologies Used

### Frontend
- HTML and CSS for the UI.

### Backend Logic
- JavaScript for email fetching, prioritization, and summarization logic.

### APIs
- **Google OAuth2** for authentication.
- **Gmail API** for email fetching.
- **Hugging Face Inference API** for summarization.

---

## File Structure

- **manifest.json**: Chrome extension configuration.
- **popup.html**: User interface for login, email scanning, and email lists.
- **popup.js**: Core logic for user interactions.
- **auth.js**: Handles Google OAuth2 authentication.
- **email-fetcher.js**: Manages email fetching, labeling, and scoring.
- **styles.css**: Styles for the extension UI.
- **background.js**: Initializes storage variables.

---

## Workflow

1. **Login**:
   - Authenticate using Google OAuth2.
2. **Scan Emails**:
   - Fetch and prioritize emails based on labels and deadlines.
3. **Summarization**:
   - Generate AI-powered summaries for email content.
4. **View Emails**:
   - Open emails directly in Gmail.
5. **Logout**:
   - Securely revoke the session.

---

## Installation Guide

### Prerequisites
- **Google API Setup**:
  1. Create a project in the [Google Cloud Console](https://console.cloud.google.com/).
  2. Enable the Gmail API.
  3. Generate an OAuth2 client ID.
  4. Add the scope: `https://www.googleapis.com/auth/gmail.readonly`.

- **Hugging Face API**:
  1. Sign up at [Hugging Face](https://huggingface.co/).
  2. Generate an API key from the "Settings > Access Tokens" page.

### Steps to Install
1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/email-priority-manager.git
   cd email-priority-manager
