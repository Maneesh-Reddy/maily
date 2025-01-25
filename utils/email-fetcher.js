async function fetchGmailMessages(authToken) {
    try {
      const response = await fetch(
        'https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=50',
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
  
      if (!response.ok) throw new Error('Failed to fetch messages.');
  
      const messageList = await response.json();
      if (!messageList.messages) return [];
  
      // Fetch message details
      return await Promise.all(
        messageList.messages.map(async (message) => {
          const detailResponse = await fetch(
            `https://gmail.googleapis.com/gmail/v1/users/me/messages/${message.id}`,
            {
              headers: {
                Authorization: `Bearer ${authToken}`,
              },
            }
          );
  
          if (!detailResponse.ok)
            throw new Error('Failed to fetch message details.');
  
          const email = await detailResponse.json();
          const subjectHeader = email.payload.headers.find((h) => h.name === 'Subject');
          const subject = subjectHeader ? subjectHeader.value : 'No Subject';
  
          const label = assignLabel(subject);
  
          // Extract deadline from subject or metadata
          let deadline = null;
          const dateMatch = subject.match(/(\d{1,2}\/\d{1,2}\/\d{4})/);
          if (dateMatch) {
            deadline = new Date(dateMatch[0]);
          }
  
          const score = calculateScore(label, deadline);
  
          return {
            id: message.id,
            subject,
            label,
            score,
            internalDate: email.internalDate,
          };
        })
      );
    } catch (error) {
      console.error('Error fetching Gmail messages:', error);
      return [];
    }
  }
  
  function assignLabel(subject) {
    const lowerCaseSubject = subject.toLowerCase();
    if (lowerCaseSubject.includes('internship')) return 'Internship';
    if (lowerCaseSubject.includes('hackathon')) return 'Hackathon';
    if (lowerCaseSubject.includes('job')) return 'Job';
    if (lowerCaseSubject.includes('exam')) return 'Exam';
    if (lowerCaseSubject.includes('application')) return 'Application';
    if (lowerCaseSubject.includes('holiday')) return 'Holiday';
    if (lowerCaseSubject.includes('lab')) return 'Lab';
    if (lowerCaseSubject.includes('event')) return 'Event';
    return 'General';
  }
  
  function calculateScore(label, deadline = null) {
    const now = new Date();
    let baseScore = 50;
  
    // Adjust base score by label importance
    switch (label) {
      case 'Internship':
      case 'Job':
        baseScore = 90;
        break;
      case 'Hackathon':
      case 'Exam':
      case 'Event':
        baseScore = 80;
        break;
      case 'Holiday':
      case 'Application':
      case 'Lab':
        baseScore = 60;
        break;
      default:
        baseScore = 50;
    }
  
    // Adjust by deadline
    if (deadline) {
      const timeDiff = deadline - now;
  
      if (timeDiff <= 24 * 60 * 60 * 1000) return Math.min(baseScore + 20, 100); // Due tomorrow
      if (timeDiff <= 7 * 24 * 60 * 60 * 1000) return baseScore + 10; // Due this week
      if (timeDiff > 30 * 24 * 60 * 60 * 1000) return Math.max(baseScore - 20, 30); // More than a month away
    }
  
    return baseScore;
  }
  