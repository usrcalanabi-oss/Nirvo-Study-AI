# NIRVO Study AI

NIRVO Study AI includes an optional on-device language model for study chat. It does not require an OpenAI, Cloudflare, or other paid AI API key.

## On-device AI

- The chat model is downloaded from the public WebLLM model repository the first time a student chooses **Load NIRVO AI**.
- The selected Qwen2.5 0.5B quantized model has an estimated graphics-memory requirement of about 945 MB in the WebLLM catalogue. Actual download size and total device-memory use can differ. Use Wi-Fi and make sure the device has enough free storage and memory.
- Once downloaded and cached, inference runs in the browser using WebGPU. Prompts are processed locally; they are not sent to an AI chat API.
- The model requires a compatible browser/device with WebGPU. Some phones, browsers, school devices, or low-memory devices may not support it.
- A small built-in offline helper remains available when WebGPU is unavailable. It is a limited rule-based helper, not a generative AI model.
- Small on-device models can make mistakes and may be weaker in Malayalam/Hindi than English. Verify formulas, textbook facts and exam answers with the current textbook and teacher.

## Student memory

The planner and saved study profile use the existing Supabase anonymous-session setup. Students do not need to create an email/password account. The browser's anonymous session is needed to reconnect to the same Supabase profile; clearing browser data may make it unrecoverable.

## Privacy

- The local chat model processes prompts on the student's device after the model files are downloaded.
- Model files are downloaded from the WebLLM/Hugging Face hosting infrastructure.
- Supabase is separate and stores only the student profile/progress that the website syncs. Do not enter passwords, private contact details or sensitive personal information into study chat.

## Developer notes

WebLLM documentation and built-in model catalogue: https://webllm.mlc.ai/
