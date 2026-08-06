// This script generates audio for expressions using ElevenLabs and uploads data to Firebase.
// Before running:
// 1. Install required packages: npm install node-fetch dotenv firebase
// 2. Setup Firebase client config in a .env file or hardcode for local seeding.
// 3. Provide your ElevenLabs API Key.

const fs = require('fs');
const path = require('path');
// Dynamic import for node-fetch is needed for recent versions if not using ES modules
// For this script, we'll assume basic fetch is available (Node 18+)

const ELEVENLABS_API_KEY = 'YOUR_ELEVENLABS_API_KEY';
const VOICE_ID = '21m00Tcm4TlvDq8ikWAM'; // Rachel (example voice ID)

// Sample Data
const expressions = [
  { id: 'exp_001', category: 'Greetings', english: "How's it going?", korean: "어떻게 지내세요?" },
  { id: 'exp_002', category: 'Greetings', english: "Long time no see.", korean: "오랜만이에요." },
  { id: 'exp_003', category: 'Travel', english: "Where is the nearest restroom?", korean: "가장 가까운 화장실이 어디 있나요?" }
];

async function generateAudio(text, expressionId) {
  const url = `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Accept': 'audio/mpeg',
      'xi-api-key': ELEVENLABS_API_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      text: text,
      model_id: "eleven_monolingual_v1",
      voice_settings: { stability: 0.5, similarity_boost: 0.5 }
    })
  });

  if (!response.ok) {
    throw new Error(`Failed to generate audio for ${text}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  
  const outputPath = path.join(__dirname, `${expressionId}.mp3`);
  fs.writeFileSync(outputPath, buffer);
  console.log(`Saved audio to ${outputPath}`);
  
  // In a real scenario, you would upload this 'buffer' to Firebase Storage here,
  // get the downloadURL, and then save the document to Firestore.
  // Example: 
  // const storageRef = ref(storage, `audio/${expressionId}.mp3`);
  // await uploadBytes(storageRef, buffer);
  // const audioUrl = await getDownloadURL(storageRef);
  // await setDoc(doc(db, "expressions", expressionId), { ...expression, audioUrl });
}

async function runSeed() {
  console.log("Starting LingoFlow Data Seed...");
  if (ELEVENLABS_API_KEY === 'YOUR_ELEVENLABS_API_KEY') {
    console.warn("⚠️ Please set your ELEVENLABS_API_KEY to generate actual audio.");
    return;
  }

  for (const exp of expressions) {
    console.log(`Processing: ${exp.english}`);
    try {
      await generateAudio(exp.english, exp.id);
    } catch (e) {
      console.error(e);
    }
  }
  console.log("Seeding complete!");
}

runSeed();
