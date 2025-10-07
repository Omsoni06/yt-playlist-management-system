import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = "AIzaSyBeWukAoIOxyekL678QKm1E0jNhk_dX7Es";
const genAI = new GoogleGenerativeAI(API_KEY);

async function listModels() {
  try {
    console.log("📋 Listing available Gemini models...\n");

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`
    );

    const data = await response.json();

    if (data.models) {
      console.log("✅ Available models:");
      data.models.forEach((model) => {
        console.log(`  - ${model.name}`);
        console.log(
          `    Supports: ${model.supportedGenerationMethods?.join(", ")}`
        );
      });
    }
  } catch (error) {
    console.error("❌ Error listing models:", error.message);
  }
}

async function testModel(modelName) {
  try {
    console.log(`\n🧪 Testing model: ${modelName}`);
    const model = genAI.getGenerativeModel({ model: modelName });

    const prompt = 'Say "Hello! This model is working!" in one sentence.';
    const result = await model.generateContent(prompt);
    const response = await result.response;

    console.log("✅ Success!");
    console.log("Response:", response.text());
    return true;
  } catch (error) {
    console.error(`❌ Failed: ${error.message}`);
    return false;
  }
}

async function runTests() {
  // First, list all available models
  await listModels();

  // Then test common model names
  const modelsToTest = [
    "gemini-pro",
    "gemini-2.0-flash-exp",
    "gemini-1.5-pro",
    "gemini-1.5-flash",
  ];

  console.log("\n\n🔍 Testing model names...\n");

  for (const modelName of modelsToTest) {
    const success = await testModel(modelName);
    if (success) {
      console.log(`\n✨ Use this model in your code: "${modelName}"\n`);
      break;
    }
  }
}

runTests();
