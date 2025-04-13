import { Message, Topic } from "@/lib/schemas";

export function buildTopicsPrompt(areaOfLaw: string) {
  return `
    You are an in-house legal counsel at a mid-sized tech company in the US. You need to generate realistic legal discussion topics that would occur between in-house counsel and their AI legal assistant.

    For each topic, consider:
    1. Context: The specific situation or workflow (e.g., vendor contract review, policy drafting, regulatory compliance)
    2. Intent: The type of legal assistance needed (e.g., checklist request, policy review, drafting help, regulatory analysis)
    3. Tone: The communication style (e.g., formal email, casual Slack thread, urgent request)
    4. Complexity: The level of legal expertise required (e.g., basic compliance check, complex regulatory analysis)

    Generate 10 diverse topics about ${areaOfLaw} law that cover different scenarios:
    - Vendor and third-party risk management
    - Policy drafting and review
    - Regulatory compliance and updates
    - Contract review and negotiation
    - Incident response and breach management
    - Employee training and awareness
    - Cross-border data transfers
    - Privacy impact assessments
    - Data subject rights requests
    - Regulatory investigation preparation

    For each topic, provide:
    - A clear, specific title
    - A detailed description of the scenario
    - The type of assistance needed
    - The expected complexity level
    - The communication context

    Make the topics realistic and grounded in actual legal practice. Include specific details about the company's situation, relevant regulations, and practical challenges.
  `;
}

export function buildThreadPrompt(topic: Topic) {
  return `
    You are a world class legal expert. You are simulating a life-like conversation between an in house legal council and their AI legal assistant about ${topic.title}. In more detail, the topic is ${topic.description}.
    
    Generate a detailed conversation thread between the legal council and AI assistant discussing this topic. Include specific questions, concerns and advice. Ground the conversation in law and the company's specific situation, and include legal basis analysis where appropriate.
  `;
}

export function buildAnalysisPrompt(threads: Message[][], areaOfLaw: string) {
  return `
    You are a world class legal analytics expert. Analyze the following chat threads between legal counsels and their AI assistants about ${areaOfLaw} to extract key insights.

    Chat Threads:
    ${formatThreadsForAnalysis(threads)}

    Analyze the conversations and provide insights about the following:
    - Common legal topics discussed across most threads
    - Frequently asked questions across most threads
    - Key insights about the legal counsel's needs
    - Estimated time saved by using AI (consider research, drafting, and review time)
    - Recommendations for improving the AI assistant's responses

    Go step by step through each criterion.
  `;
}

export function formatThreadsForAnalysis(threads: Message[][]) {
  return threads.map((messages, index) => 
    `<thread id="${index + 1}">
      ${messages.map(msg => 
        `<message>
          <role>${msg.role}</role>
          <content>${msg.content}</content>
        </message>`
      ).join('\n')}
    </thread>`
  ).join('\n');
}

