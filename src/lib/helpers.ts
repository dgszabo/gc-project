import { Message, Topic } from "@/lib/schemas";

export function buildTopicsPrompt(areaOfLaw: string) {
  return `
    You are an in-house legal counsel at a mid-sized company in the US. You need to generate realistic legal discussion topics that would occur between in-house counsel and their AI legal assistant.

    For each topic, consider and vary the following:
    1. Context: The specific situation or workflow (e.g., vendor contract review, policy drafting, regulatory compliance)
    2. Intent: The type of legal assistance needed (e.g., checklist request, policy review, drafting help, regulatory analysis)
    3. Tone: The communication style (e.g., formal email, casual Slack thread, urgent request)
    4. Complexity: The level of legal expertise required (e.g., basic compliance check, complex regulatory analysis)
    5. Specificity: The level of specificity of the question (e.g., a specific clause in a specific contract of our company vs a regulation's specific change's effect on our company, a general regultation's foreseeable effect on the industry)
    6. Urgency: The level of urgency of the question (e.g., a question about a new regulation that we need to comply with in 2 weeks vs a question about a clause in a contract that we need to review in 2 months)
    7. Company type: The type of company (e.g., a tech company vs a manufacturing company vs a retail company)

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
    You are a legal analytics expert specializing in evaluating AI-assisted legal work. Analyze the following chat threads between legal counsels and their AI assistants about ${areaOfLaw}.

    Chat Threads:
    ${formatThreadsForAnalysis(threads)}

    Provide a detailed analysis following this structure:

    1. Common Topics (5-10 items)
       - List recurring legal themes
       - Include specific regulations or laws referenced
       - Note any industry-specific considerations
       - Group related topics together
       - Rank by frequency of occurrence

    2. Frequent Questions (5-10 items)
       - Categorize by type (compliance, process, risk, etc.)
       - Note the level of specificity (general vs. specific)
       - Include context about urgency or priority
       - Identify patterns in question types
       - Rank by frequency of occurrence

    3. Common Needs of GCs (5-10 items)
       - Focus on practical needs
       - Include both immediate and strategic needs
       - Consider process vs. content needs
       - Note any gaps in current support
       - Rank by importance

    4. Time Savings Analysis
       For each thread, calculate time saved by considering:
       - Research time saved (legal research, regulatory review)
       - Drafting time saved (document creation, template development)
       - Review time saved (document review, compliance checking)
       - Coordination time saved (stakeholder communication, process management)
       - Learning curve reduction (training, knowledge transfer)

    5. Recommendations (5-10 items)
       Focus on:
       - AI capability improvements
       - Process optimization
       - Content enhancement
       - Integration suggestions
       - Training needs
       - Industry-specific adaptations

    Ensure your analysis:
    - Uses consistent metrics for time savings
    - Provides specific examples from the threads
    - Balances quantitative and qualitative insights
    - Considers both immediate and long-term improvements
    - Maintains a practical, implementation-focused perspective
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

