const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const { scoreAnswers } = require("./scoring");
const app = express();
const PORT = 3001;

app.use(bodyParser.json());
// Serve static files from public directory with correct path
app.use('/images', express.static(path.join(__dirname, '../public/images'))); 
app.use('/frames', express.static(path.join(__dirname, '../frames'))); // Serve frame HTML files

// Add a test endpoint to verify server is working
app.get("/test", (req, res) => {
  res.send("Server is working correctly!");
});

// Add a debug endpoint to simulate frame interactions in a browser
app.get("/debug", (req, res) => {
  const frameUrl = `http://localhost:${PORT}`;
  return res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>DeepGov Compass Frame Debugger</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; max-width: 800px; margin: 0 auto; }
          .frame-container { border: 2px solid #ccc; padding: 20px; margin: 20px 0; border-radius: 8px; }
          .frame-image { max-width: 100%; margin: 10px 0; }
          .button-row { display: flex; gap: 10px; margin: 15px 0; }
          .frame-button { padding: 8px 16px; background: #5C5CFF; color: white; border: none; border-radius: 4px; cursor: pointer; }
          h1 { color: #333; }
          .debug-info { background: #f5f5f5; padding: 10px; border-radius: 4px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <h1>DeepGov Compass Frame Debugger</h1>
        <p>This page simulates a Farcaster client to test your frame locally.</p>
        
        <div class="frame-container">
          <h2>Current Frame</h2>
          <div id="frame-content">Loading frame...</div>
          
          <div class="button-row" id="button-row"></div>
          
          <div class="debug-info">
            <h3>Debug Info</h3>
            <pre id="debug-info"></pre>
          </div>
        </div>
        
        <script>
          // Simple Farcaster frame debugger
          const userId = "debug-user-" + Math.floor(Math.random() * 1000);
          let currentFrameHtml = "";
          
          async function fetchFrame(url, buttonIndex = null) {
            try {
              const response = buttonIndex === null 
                ? await fetch(url) 
                : await fetch(url + '/api/handle', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                      trustedData: {
                        fid: userId,
                        buttonIndex: buttonIndex
                      }
                    }),
                  });
              
              const html = await response.text();
              currentFrameHtml = html;
              
              // Extract frame data
              const imageMatch = html.match(/<meta property="fc:frame:image" content="([^"]+)"/);
              const imageUrl = imageMatch ? imageMatch[1] : null;
              
              // Extract buttons
              const buttons = [];
              let buttonMatch;
              const buttonRegex = /<meta property="fc:frame:button:([1-4])" content="([^"]+)"/g;
              while ((buttonMatch = buttonRegex.exec(html)) !== null) {
                buttons.push({
                  index: buttonMatch[1],
                  label: buttonMatch[2]
                });
              }
              
              // Extract post URL
              const postUrlMatch = html.match(/<meta property="fc:frame:post_url" content="([^"]+)"/);
              const postUrl = postUrlMatch ? postUrlMatch[1] : null;
              
              // Display frame
              const frameContent = document.getElementById('frame-content');
              let content = '';
              
              if (imageUrl) {
                content += \`<img src="\${imageUrl}" class="frame-image" />\`;
              }
              
              frameContent.innerHTML = content;
              
              // Create buttons
              const buttonRow = document.getElementById('button-row');
              buttonRow.innerHTML = '';
              
              buttons.forEach(button => {
                const btn = document.createElement('button');
                btn.className = 'frame-button';
                btn.textContent = button.label;
                btn.onclick = () => fetchFrame(postUrl, parseInt(button.index));
                buttonRow.appendChild(btn);
              });
              
              // Update debug info
              document.getElementById('debug-info').textContent = 
                JSON.stringify({
                  userId: userId,
                  imageUrl,
                  postUrl,
                  buttons: buttons.map(b => b.label)
                }, null, 2);
              
            } catch (error) {
              console.error('Error fetching frame:', error);
              document.getElementById('frame-content').innerHTML = 
                '<p style="color: red">Error loading frame: ' + error.message + '</p>';
            }
          }
          
          // Initial frame load
          fetchFrame('${frameUrl}');
        </script>
      </body>
    </html>
  `);
});

// Add a handler for GET requests to the root path
app.get("/", (req, res) => {
  // Instead of a simple message, serve the first question frame
  const firstQuestionImageUrl = `http://localhost:${PORT}/images/q1.jpg`;
  return res.status(200).send(`
    <html>
      <head>
        <title>DeepGov Compass Quiz</title>
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content="${firstQuestionImageUrl}" />
        <meta property="fc:frame:button:1" content="Option A" />
        <meta property="fc:frame:button:2" content="Option B" />
        <meta property="fc:frame:button:3" content="Option C" />
        <meta property="fc:frame:button:4" content="Option D" />
        <meta property="fc:frame:post_url" content="http://localhost:${PORT}/api/handle" />
      </head>
      <body>
        <h1>DeepGov Compass Quiz</h1>
        <p>Answer the questions to discover your governance persona.</p>
        <p>You should be viewing this in a Farcaster client to use the interactive frame.</p>
      </body>
    </html>
  `);
});

const userAnswers = {}; // key = session/user ID, value = array of answers

// Add an endpoint to serve specific frames
app.get("/frame/:questionNumber", (req, res) => {
  const questionNumber = req.params.questionNumber;
  res.sendFile(path.join(__dirname, `../frames/question${questionNumber}.html`));
});

app.post("/api/handle", (req, res) => {
  const { trustedData } = req.body || {};
  const userId = trustedData?.fid || "anon"; // Use Farcaster ID (fid) or 'anon' if not available
  const answer = trustedData?.buttonIndex || 1; // Default to 1 if not present

  if (!userAnswers[userId]) userAnswers[userId] = [];
  userAnswers[userId].push(answer);

  const currentQuestion = userAnswers[userId].length;

  if (currentQuestion >= 6) {
    // Score the answers to get the persona and quote
    const result = scoreAnswers(userAnswers[userId]); // Updated call

    // Construct the image URL based on the winning persona
    const image = `http://localhost:${PORT}/images/${result.winner.toUpperCase()}.jpg`;

    // Generate the result frame HTML (optionally include result.quote here if desired)
    const html = `
      <html>
        <head>
          <meta property="fc:frame" content="vNext" />
          <meta property="fc:frame:image" content="${image}" />
          <meta property="og:description" content="${result.quote}" /> 
          <meta property="fc:frame:button:1" content="Share" />
          <meta property="fc:frame:button:2" content="Retake Quiz" />
          <meta property="fc:frame:post_url" content="http://localhost:${PORT}/api/reset" />
        </head>
      </html>
    `;

    // Reset answers for the user after completion
    delete userAnswers[userId];

    return res.status(200).send(html);
  } else {
    // Redirect to the next question's static HTML file
    const nextQuestionNumber = currentQuestion + 1;
    
    // Read the content of the static HTML file
    const nextQuestionPath = path.join(__dirname, `../frames/question${nextQuestionNumber}.html`);
    const fs = require('fs');
    
    try {
      let html = fs.readFileSync(nextQuestionPath, 'utf8');
      
      // Update the post_url to use the current server address
      html = html.replace(
        /<meta property="fc:frame:post_url" content="[^"]*"/, 
        `<meta property="fc:frame:post_url" content="http://localhost:${PORT}/api/handle"`
      );
      
      // Update the image URL to use the current server address
      html = html.replace(
        /<meta property="fc:frame:image" content="[^"]*"/,
        `<meta property="fc:frame:image" content="http://localhost:${PORT}/images/q${nextQuestionNumber}.jpg"`
      );
      
      return res.status(200).send(html);
    } catch (err) {
      console.error(`Error reading question${nextQuestionNumber}.html:`, err);
      
      // Fallback to dynamically generated HTML if file reading fails
      const nextImageUrl = `http://localhost:${PORT}/images/q${nextQuestionNumber}.jpg`;
      
      let buttonContents = ["Option A", "Option B", "Option C", "Option D"];
      
      // Check which question number and set appropriate button text
      if (nextQuestionNumber === 5) {
        buttonContents = ["Teleportation", "Talking to animals", "Reading minds", "Controlling time"];
      }
      
      return res.status(200).send(`
        <html>
          <head>
            <meta property="fc:frame" content="vNext" />
            <meta property="fc:frame:image" content="${nextImageUrl}" />
            <meta property="fc:frame:button:1" content="${buttonContents[0]}" />
            <meta property="fc:frame:button:2" content="${buttonContents[1]}" />
            <meta property="fc:frame:button:3" content="${buttonContents[2]}" />
            <meta property="fc:frame:button:4" content="${buttonContents[3]}" />
            <meta property="fc:frame:post_url" content="http://localhost:${PORT}/api/handle" />
          </head>
        </html>
      `);
    }
  }
});

// Add a simple reset endpoint (optional, depends on how you handle 'Retake Quiz')
app.post("/api/reset", (req, res) => {
  const { trustedData } = req.body || {};
  const userId = trustedData?.fid || "anon";
  delete userAnswers[userId]; // Clear answers for the user
  
  // Redirect or send the first question frame back
  const firstQuestionImageUrl = `http://localhost:${PORT}/images/q1.jpg`;
  return res.status(200).send(`
      <html>
        <head>
          <meta property="fc:frame" content="vNext" />
          <meta property="fc:frame:image" content="${firstQuestionImageUrl}" />
          <meta property="fc:frame:button:1" content="Start Quiz" /> 
          <meta property="fc:frame:post_url" content="http://localhost:${PORT}/api/handle" /> 
        </head>
      </html>
    `);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
