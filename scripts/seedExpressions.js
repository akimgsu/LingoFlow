// This script reads expressions from 'expressions.csv', fetches the ElevenLabs API Key
// from Google Cloud Secret Manager (or env variable), generates high-quality audio,
// and prepares/uploads data to Firebase.

const fs = require('fs');
const path = require('path');
const { SecretManagerServiceClient } = require('@google-cloud/secret-manager');

const SECRET_NAME = 'projects/16087637963/secrets/ELEVENLABS_API_KEY/versions/latest';
const VOICE_ID = 'EXAVITQu4vr4xnSDxMaL'; // Sarah (Default premade voice for Free Tier)

// 1. Fetch ElevenLabs API Key from Google Secret Manager
async function getElevenLabsApiKey() {
  if (process.env.ELEVENLABS_API_KEY) {
    console.log('Using ELEVENLABS_API_KEY from environment variable.');
    return process.env.ELEVENLABS_API_KEY;
  }

  console.log(`Fetching ElevenLabs API key from Google Secret Manager (${SECRET_NAME})...`);
  try {
    const client = new SecretManagerServiceClient();
    const [version] = await client.accessSecretVersion({ name: SECRET_NAME });
    const apiKey = version.payload.data.toString('utf8').trim();
    console.log('Successfully retrieved API key from Google Secret Manager!');
    return apiKey;
  } catch (error) {
    console.error('Error fetching secret from Google Cloud Secret Manager:', error.message);
    console.log('Tip: Ensure Google credentials are authenticated, or run with ELEVENLABS_API_KEY="your_key" node scripts/seedExpressions.js');
    throw error;
  }
}

// 2. Parse CSV file helper
function loadExpressionsFromCSV(csvPath) {
  const fileContent = fs.readFileSync(csvPath, 'utf8');
  const lines = fileContent.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  
  if (lines.length <= 1) return [];

  const headers = lines[0].split(',').map(h => h.trim());
  const expressions = [];

  for (let i = 1; i < lines.length; i++) {
    const row = lines[i].split(',').map(c => c.trim());
    if (row.length >= 4) {
      expressions.push({
        id: row[0],
        category: row[1],
        english: row[2],
        korean: row[3],
      });
    }
  }

  return expressions;
}

// 3. Generate Audio using ElevenLabs
async function generateAudio(apiKey, text, outputPath) {
  const url = `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Accept': 'audio/mpeg',
      'xi-api-key': apiKey,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      text: text,
      model_id: "eleven_multilingual_v2",
      voice_settings: { stability: 0.5, similarity_boost: 0.75 }
    })
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`ElevenLabs API error (${response.status}): ${errText}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  fs.writeFileSync(outputPath, buffer);
}

// 4. Main Execution Function
async function main() {
  try {
    const apiKey = await getElevenLabsApiKey();
    const csvPath = path.join(__dirname, 'expressions.csv');
    const audioDir = path.join(__dirname, 'audio');

    if (!fs.existsSync(audioDir)) {
      fs.mkdirSync(audioDir, { recursive: true });
    }

    if (!fs.existsSync(csvPath)) {
      console.error(`CSV file not found at ${csvPath}`);
      return;
    }

    const expressions = loadExpressionsFromCSV(csvPath);
    console.log(`Found ${expressions.length} expressions in CSV.`);

    for (const exp of expressions) {
      const outputPath = path.join(audioDir, `${exp.id}.mp3`);
      
      if (fs.existsSync(outputPath)) {
        console.log(`Audio for "${exp.english}" already exists at ${outputPath}. Skipping.`);
        continue;
      }

      console.log(`Generating audio for [${exp.category}] "${exp.english}"...`);
      await generateAudio(apiKey, exp.english, outputPath);
      console.log(`Saved MP3: ${outputPath}`);
    }

    console.log('\nAll expressions processed successfully!');
    console.log(`Generated audio files are saved in: ${audioDir}`);
  } catch (err) {
    console.error('Seeding process failed:', err.message);
  }
}

main();
