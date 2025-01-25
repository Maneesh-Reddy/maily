# Gmail Email Viewer Extension

This is a Chrome extension that allows users to log in with their Google account, view a list of their emails, and open individual emails directly in Gmail. The extension uses the Gmail API to fetch and display email data securely.

---

## Features

- **Login with Google**: Authenticate using your Google account.
- **Email List**: View a list of your recent emails.
- **View Full Email**: Open the selected email directly in Gmail in a new tab.
- **Logout**: Log out securely and clear the session.

---

## Screenshots

### **Login Page**
![Login Page](images/login-page.png)

### **Email List View**
![Email List](images/email-list.png)

### **View Full Email**
![View Full Email](images/view-full-email.png)

---

## Prerequisites

### **Google API Setup**
1. Visit the [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project.
3. Enable the **Gmail API** for the project.
4. Navigate to **APIs & Services > Credentials**.
5. Create an **OAuth 2.0 Client ID** and configure the consent screen.
6. Add the following scope:
   https://www.googleapis.com/auth/gmail.readonly
7. Download the credentials and note the **Client ID** and **Client Secret**.

### **Chrome Developer Mode**
1. Open Chrome and go to `chrome://extensions/`.
2. Enable **Developer Mode** (toggle in the top-right corner).

---

## Installation

1. **Clone the Repository**:
```bash
git clone https://github.com/your-repo/gmail-email-viewer-extension.git
cd gmail-email-viewer-extension
