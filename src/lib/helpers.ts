import { Message, Topic } from "@/lib/schemas";

/*
  WARNING:  These prompts are used to generate topics and threads, and analyze them both by Anthropic and OpenAI LLMs.
            If you change them, double check that the prompts work with both LLMs.
*/

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

    Generate 10 diverse topics about "${areaOfLaw}" that cover different scenarios, for example but not limited to (only apply any of these sample ideas if relevant to ${areaOfLaw}):
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
    You are an in-house legal counsel at a mid-sized company in the US. You are having a conversation with your AI legal assistant about ${topic.title}. The specific context is: ${topic.description}

    Generate a realistic conversation that follows these guidelines:

    1. Conversation Structure:
       - Start with a clear context-setting message from the GC
       - Vary the number of exchanges (2-20 messages) based on the complexity of the topic
       - End naturally (either with a conclusion, next steps, or mid-discussion)
       - Vary message length based on the content
       - If appropriate, simulate the lawyer pasting in clauses or documents into the chat
       - Use appropriate legal terminology but keep it conversational

    2. Realistic GC Behavior:
       - Show varying levels of legal expertise
       - Include occasional typos or informal language
       - Express urgency or calmness appropriately
       - Ask follow-up questions when needed
       - Skip unnecessary clarifications when confident
       - Reference company-specific details naturally
       - Vary the depth of questions (some detailed, some high-level)
       - Mix quick clarifications with deeper discussions

    3. AI Assistant Responses:
       - Provide concise, practical advice
       - Reference specific regulations when relevant
       - Suggest concrete next steps
       - Acknowledge limitations when appropriate
       - Use bullet points for complex information
       - Maintain professional but helpful tone
       - Vary response length based on complexity and need
       - Sometimes provide quick answers, sometimes detailed analysis, as appropriate

    4. Contextual Elements:
       - Reference specific company departments, where relevant
       - Mention relevant stakeholders, where relevant
       - Consider business impact, where relevant
       - Discuss timelines and deadlines, where relevant
       - Reference past similar situations, where relevant
       - Include industry-specific details, where relevant
       - Vary the level of detail in context provided

    5. Natural Flow:
       - Build on previous responses
       - Show progressive understanding
       - Include occasional clarifications
       - Allow for some back-and-forth
       - End conversations naturally
       - Vary the pace of the conversation
       - Include some quick exchanges (minimum 2 question/answer messages) and some longer discussions (maximum 20 question/answer messages)
       - Mix simple confirmations with complex analyses

    The conversation should feel like a real interaction between a GC and their AI assistant, with appropriate legal depth and practical focus. Vary the conversation length and complexity based on the topic's nature and the GC's needs.
  `;
}

export function buildAnalysisPrompt(threads: Message[][], areaOfLaw: string) {
  return `
    You are a legal analytics expert specializing in evaluating AI-assisted legal work. Analyze the following chat threads between legal counsels and their AI assistants about ${areaOfLaw}.

    Chat Threads:
    ${formatThreadsForAnalysis(threads)}

    Provide a detailed analysis following this structure:

    1. Common Topics (3-6 items)
       - List recurring legal themes
       - Include specific regulations or laws referenced
       - Note any industry-specific considerations
       - Group related topics together
       - Rank by frequency of occurrence

    2. Frequent Questions (3-6 items)
       - Categorize by type (compliance, process, risk, etc.)
       - Note the level of specificity (general vs. specific)
       - Include context about urgency or priority
       - Identify patterns in question types
       - Rank by frequency of occurrence

    3. Common Needs of GCs (3-6 items)
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

       Format each time savings entry as:
       "The AI saved time by [specific action], in [specific activity]."
       Example: "The AI saved time by providing a structured template and checklist, in drafting and review."

    5. Recommendations (3-6 items)
       Focus on:
       - AI capability improvements
       - Process optimization
       - Content enhancement
       - Integration suggestions
       - Training needs
       - Industry-specific adaptations

    Ensure your analysis:
    - Uses consistent metrics for time savings (in minutes)
    - Provides specific examples from the threads
    - Balances quantitative and qualitative insights
    - Considers both immediate and long-term improvements
    - Maintains a practical, implementation-focused perspective
    - Follows the exact format specified for time savings analysis
  `;
}

function formatThreadsForAnalysis(threads: Message[][]) {
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

