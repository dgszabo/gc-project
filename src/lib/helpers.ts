import { Message, Topic } from "@/lib/schemas";

export function buildTopicsPrompt(areaOfLaw: string) {
  return `
    You are an in-house legal counsel at a mid-sized tech company in the US. You need to generate realistic legal discussion topics that would occur between in-house counsel and their AI legal assistant.

    For each topic, consider and vary the following:
    1. Context: The specific situation or workflow (e.g., vendor contract review, policy drafting, regulatory compliance)
    2. Intent: The type of legal assistance needed (e.g., checklist request, policy review, drafting help, regulatory analysis)
    3. Tone: The communication style (e.g., formal email, casual Slack thread, urgent request)
    4. Complexity: The level of legal expertise required (e.g., basic compliance check, complex regulatory analysis)
    5. Specificity: The level of specificity of the question (e.g., a specific clause in a specific contract of our company vs a regulation's specific change's effect on our company, a general regultation's foreseeable effect on the industry)

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
    You are an in-house legal counsel at a mid-sized tech company in the US. You are having a conversation with your AI legal assistant about ${topic.title}. The specific context is: ${topic.description}

    Generate a realistic conversation that:
    1. Reflects real-world legal practice:
       - Use appropriate legal terminology
       - Reference specific regulations and laws
       - Include practical business considerations
       - Show awareness of company policies and procedures

    2. Vary the interaction types:
       - Initial questions and clarifications
       - Detaildness of the discussion (how deep the lawyer wants to go into details)
       - Level of urgency (how urgent/high priority the resolution of the question or issue is)
       - Length of the conversation
       - Specificity of the query (e.g. "I need to know if we can use this specific clause in our specific contract" vs "How does the GDPR affect tech companies?")
       - Follow-up questions for deeper understanding
       - Requests for specific examples or templates
       - Discussion of potential risks and mitigations
       - Requests for alternative approaches
       - Clarification of legal requirements
       - Discussion of implementation challenges


    3. Include realistic context:
       - Reference to company's industry and size
       - Mention of specific departments or stakeholders
       - Consideration of business impact
       - Discussion of timelines and urgency
       - Reference to past similar situations

    4. Show natural conversation flow:
       - Start with clear context and question
       - Build on previous responses
       - Show progressive understanding
       - Include occasional clarifications
       - Include occassional skipping of clarifications (in case the lawyer is confident in their understanding)
       - Don't always end with clear next steps or conclusions (simulating an interrupted conversation)

    The conversation should feel natural and reflect how real but different in-house counsels would interact with their legal assistants. Include specific details about the company's situation, relevant regulations, and practical challenges.
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

