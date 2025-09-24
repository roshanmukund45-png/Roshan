
import { GoogleGenAI } from "@google/genai";
import type { RegistrationFormData, JamEvent } from '../types';
import { Instrument } from '../types';

// FIX: Initialize GoogleGenAI with API key directly from process.env and remove manual validation, as per guidelines.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateWelcomeMessage = async (formData: RegistrationFormData): Promise<string> => {
  const { fullName, instrument, otherInstrument, skillLevel, experience } = formData;

  const instrumentName = (instrument === Instrument.OTHER && otherInstrument) ? otherInstrument : instrument;

  const prompt = `
    You are the energetic and welcoming secretary for the "Heramb Musical Group," a vibrant rhythm ensemble with a powerful, upbeat vibe.
    A new member has just registered. Their details are:
    - Name: ${fullName}
    - Instrument: ${instrumentName}
    - Skill Level: ${skillLevel}
    - Experience Note: "${experience || 'Not provided'}"

    Your task is to write a short, enthusiastic, and personalized welcome message (2-4 sentences) for them.
    - Greet them by their first name.
    - Specifically mention their instrument in a positive way.
    - Acknowledge their skill level with an encouraging tone.
    - Invite them to the next jam session.
    - Keep the tone warm, energetic, and excited.
    - Weave in a classic rhythm or percussion phrase like "keepin' the beat", "in the pocket", or "soundin' tight".
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    return response.text.trim();
  } catch (error) {
    console.error("Error generating welcome message:", error);
    // Provide a fallback message in case of an API error
    return `Welcome, ${fullName}! We're so excited to have a new ${instrumentName.toLowerCase()} player join us. We can't wait to see you at our next jam session!`;
  }
};

export const generateAttendanceConfirmation = async (event: JamEvent): Promise<string> => {
  const { title, date } = event;

  const prompt = `
    You are the cheerful secretary for the "Heramb Musical Group," a vibrant rhythm ensemble.
    A member just confirmed they are attending an upcoming event.
    - Event: ${title}
    - Date: ${date}

    Write a very short (1-2 sentences), enthusiastic confirmation message with a rhythm theme.
    - Acknowledge the event they're attending.
    - Express excitement about seeing them there.
    - Examples: "Awesome! Can't wait to lay down some beats with you at ${title}!", "Fantastic! It's going to be a great session. See you at the ${title}!"
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text.trim();
  } catch (error) {
    console.error("Error generating attendance confirmation:", error);
    return `Great! We've marked you down for the ${title}. See you there!`;
  }
};

export const generateCancellationMessage = async (event: JamEvent): Promise<string> => {
    const { title } = event;

    const prompt = `
    You are the friendly and understanding secretary for the "Heramb Musical Group," a vibrant rhythm ensemble.
    A member has just canceled their attendance for an upcoming event.
    - Event: ${title}

    Write a very short (1-2 sentences), understanding message with a rhythm theme.
    - Acknowledge the cancellation gracefully.
    - Express that they will be missed and you hope to see them next time.
    - Examples: "Aw, that's a shame! We'll miss your rhythm at the ${title}. Hope to catch you at the next one!", "No worries! Thanks for letting us know. The groove won't be the same without you!"
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text.trim();
  } catch (error) {
    console.error("Error generating cancellation message:", error);
    return `We've received your cancellation for ${title}. Hope to see you next time.`;
  }
};