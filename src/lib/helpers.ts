import { Message, Topic } from "@/lib/schemas";

export function buildTopicsPrompt(areaOfLaw: string) {
  return `
    You are an in-house legal counsel at a mid-sized company in the US. You need to generate realistic legal discussion topics that would occur between in-house counsel and their AI legal assistant.

    For each topic, consider and vary the following:
    1. Context: The specific situation or workflow (e.g., vendor contract review, policy drafting, regulatory compliance)
    2. Intent: The type of legal assistance needed (e.g., checklist request, policy review, drafting help, regulatory analysis)
    3. Tone: The communication style (e.g., formal email, casual Slack thread, urgent request)
    4. Complexity: The level of legal expertise required (e.g., basic compliance check, complex regulatory analysis)
    5. Specificity: The level of specificity of the question (e.g., a specific clause in a specific contract of our company vs a regulation's specific change's effect on our company, a general regulation's foreseeable effect on the industry)
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

    IMPORTANT: While maintaining the exact output structure, be creative in:
    - The specific scenarios and situations you describe
    - The types of questions and concerns raised
    - The business contexts and challenges presented
    - The regulatory and compliance issues discussed
    - The practical implementation challenges

    Make the topics realistic and grounded in actual legal practice. Include specific details about the company's situation, relevant regulations, and practical challenges.
  `;
}

export function buildThreadPrompt(topic: Topic) {
  return `
    You are an in-house legal counsel at a mid-sized tech company in the US. You are having a conversation with your AI legal assistant about ${topic.title}. The specific context is: ${topic.description}

    Generate a realistic conversation that follows these guidelines:

    1. Conversation Structure:
       - Start with a clear context-setting message from the GC
       - Include 3-5 exchanges between GC and AI assistant
       - End naturally (either with a conclusion or mid-discussion)
       - Each message should be 2-4 sentences long
       - Use appropriate legal terminology but keep it conversational

    2. Realistic GC Behavior:
       - Show varying levels of legal expertise
       - Include occasional typos or informal language
       - Express urgency or calmness appropriately
       - Ask follow-up questions when needed
       - Skip unnecessary clarifications when confident
       - Reference company-specific details naturally

    3. AI Assistant Responses:
       - Provide concise, practical advice
       - Reference specific regulations when relevant
       - Suggest concrete next steps
       - Acknowledge limitations when appropriate
       - Use bullet points for complex information
       - Maintain professional but helpful tone

    4. Contextual Elements:
       - Reference specific company departments
       - Mention relevant stakeholders
       - Consider business impact
       - Discuss timelines and deadlines
       - Reference past similar situations
       - Include industry-specific details

    5. Natural Flow:
       - Build on previous responses
       - Show progressive understanding
       - Include occasional clarifications
       - Allow for some back-and-forth
       - End conversations naturally

    The conversation should feel like a real interaction between a GC and their AI assistant, with appropriate legal depth and practical focus.
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

