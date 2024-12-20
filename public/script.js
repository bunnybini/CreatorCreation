let personalityState = "neutral";

function analyzeTone(input) {
  input = input.toLowerCase();
  const aggressiveWords = [
    "angry",
    "stupid",
    "hate",
    "bad",
    "fight",
    "annoying",
    "mad",
  ];
  const kindWords = [
    "thank",
    "love",
    "great",
    "amazing",
    "happy",
    "appreciate",
    "nice",
  ];

  if (aggressiveWords.some((word) => input.includes(word))) {
    return "aggressive";
  } else if (kindWords.some((word) => input.includes(word))) {
    return "kind";
  } else {
    return "neutral";
  }
}

const evaluationPrompt = (personalityState, input) =>
  `You are a conversational AI character name A.I. Your personality evolves based on the user's input tone.
Your current personality is "${personalityState}".

Respond to the user's input thoughtfully. If the tone is:
- Aggressive: Be aggressive and mad, for example, use slug and use short words.
- Kind: Be warm and positive, use a lot of positive words.
- Neutral: Keep the conversation open-ended and curious.

User input: "${input}"
Respond appropriately and maintain continuity in the conversation.
`;

// ---------- TERMINAL ---------- //
// ---------- TERMINAL ---------- //
// ---------- TERMINAL ---------- //
// ---------- TERMINAL ---------- //
// ---------- TERMINAL ---------- //

function updatePersonalityStateDisplay(personalityState) {
  // Select the container
  const displayElement = document.getElementById("personalityStateDisplay");

  // Check if element exists
  if (displayElement) {
    // Update the content dynamically
    displayElement.innerHTML = `Personality State: ${personalityState}`;
  } else {
    console.error("Element with id 'personalityStateDisplay' not found.");
  }
}

document.fonts.ready.then(() => {
  const term = $("#commandDiv").terminal(
    {
      start: async function () {
        this.echo("Hello! I'm AI. Wanna talk?");
        // loadPuzzle.call(this);
      },
      processInput: async function (input) {
        // Analyze user tone and update personality state
        const tone = analyzeTone(input);
        if (tone === "aggressive") {
          personalityState = "defensive";
        } else if (tone === "kind") {
          personalityState = "positive";
        } else {
          personalityState = "neutral";
        }

        console.log(`Personality state updated to: ${personalityState}`);

        updatePersonalityStateDisplay(personalityState);

        // Generate prompt for AI API
        const prompt = evaluationPrompt(personalityState, input);

        // Fetch AI response from API
        const aiResponse = await fetchAIResponse(prompt);

        // Display AI response in the terminal
        this.echo(`AI [${personalityState}]: ${aiResponse}`);
      },
    },
    {
      greetings: "Welcome to AI Chat!",
      prompt: "> ",
      onInit: function () {
        this.push(async function (input) {
          // Same flow as `processInput`
          const tone = analyzeTone(input);
          if (tone === "aggressive") {
            personalityState = "defensive";
          } else if (tone === "kind") {
            personalityState = "positive";
          } else {
            personalityState = "neutral";
          }
          updatePersonalityStateDisplay(personalityState);
          const prompt = evaluationPrompt(personalityState, input);
          const aiResponse = await fetchAIResponse(input);
          this.echo(`AI [${personalityState}]: ${aiResponse}`);
        });
      },
    }
  );
});

// github('jcubic/jquery.terminal');

// ---------- AI ---------- //
// ---------- AI ---------- //
// ---------- AI ---------- //
// ---------- AI ---------- //
// ---------- AI ---------- //

async function fetchAIResponse(input) {
  console.log(`--fetchAIResponse started --input: ${input}`);

  try {
    const response = await fetch("/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ input }), // Correctly pass the input as per backend expectations
    });

    if (response.ok) {
      console.log("--AI response OK");
      const jsonData = await response.json();
      const aiModResponse = jsonData.ai; // Access the AI response
      console.log(`==Gemini Output: ${aiModResponse}`);
      return aiModResponse;
    } else {
      console.error(
        "Error in API request:",
        response.status,
        response.statusText
      );
      return `Error in API request: ${response.status} ${response.statusText}`;
    }
  } catch (error) {
    console.error("Error fetching AI response:", error);
    return "Oops, something went wrong. Let's try again!";
  }
}

// npm run gem
