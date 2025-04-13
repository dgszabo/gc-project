import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
  Row,
  Column,
} from '@react-email/components';
import { Analysis } from '@/lib/schemas';

interface AnalysisEmailProps {
  analysis: Analysis;
}

export const AnalysisEmail = ({ analysis }: AnalysisEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>AI Legal Assistant Analysis Results</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Analysis Results</Heading>

          <Section style={section}>
            <Heading style={h2}>Key Insights</Heading>
            {analysis.keyInsights.map((insight, index) => (
              <div key={index}>
                <Heading style={h3}>Common Topics</Heading>
                <ul>
                  {insight.commonTopics.map((topic, i) => (
                    <Text key={i} style={listItem}>• {topic}</Text>
                  ))}
                </ul>

                <Heading style={h3}>Frequent Questions</Heading>
                <ul>
                  {insight.frequentQuestions.map((question, i) => (
                    <Text key={i} style={listItem}>• {question}</Text>
                  ))}
                </ul>

                <Heading style={h3}>Common Needs of GCs</Heading>
                <ul>
                  {insight.commonNeedsofGCs.map((need, i) => (
                    <Text key={i} style={listItem}>• {need}</Text>
                  ))}
                </ul>
              </div>
            ))}
          </Section>

          <Section style={section}>
            <Heading style={h2}>Time Savings Analysis</Heading>
            <Row style={tableRow}>
              <Column style={{...tableHeader, width: '20%'}}>
                <Text>Thread</Text>
              </Column>
              <Column style={{...tableHeader, width: '20%'}}>
                <Text>Time Saved</Text>
              </Column>
              <Column style={{...tableHeader, width: '60%'}}>
                <Text>Explanation</Text>
              </Column>
            </Row>
            {analysis.timeSavingsPerThread.map((timeSaving, index) => (
              <Row key={index} style={tableRow}>
                <Column style={{...tableCell, width: '20%'}}>
                  <Text>{timeSaving.threadIndex}</Text>
                </Column>
                <Column style={{...tableCell, width: '20%'}}>
                  <Text>{timeSaving.estimatedMinutesSaved} minutes</Text>
                </Column>
                <Column style={{...tableCell, width: '60%'}}>
                  <Text>{timeSaving.explanation}</Text>
                </Column>
              </Row>
            ))}
          </Section>

          <Section style={section}>
            <Heading style={h2}>Recommendations</Heading>
            <ul>
              {analysis.recommendations.map((recommendation, index) => (
                <Text key={index} style={listItem}>• {recommendation}</Text>
              ))}
            </ul>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

const main = {
  backgroundColor: '#ffffff',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
  width: '580px',
};

const section = {
  padding: '24px',
  backgroundColor: '#f6f6f6',
  borderRadius: '5px',
  marginBottom: '20px',
};

const h1 = {
  color: '#333',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '40px 0',
  padding: '0',
};

const h2 = {
  color: '#333',
  fontSize: '20px',
  fontWeight: 'bold',
  margin: '20px 0',
  padding: '0',
};

const h3 = {
  color: '#333',
  fontSize: '16px',
  fontWeight: 'bold',
  margin: '16px 0',
  padding: '0',
};

const listItem = {
  margin: '8px 0',
  padding: '0',
  color: '#333',
};

const tableHeader = {
  fontWeight: 'bold',
  padding: '8px',
  backgroundColor: '#f0f0f0',
};

const tableCell = {
  padding: '8px',
  borderBottom: '1px solid #ddd',
};

const tableRow = {
  // Add appropriate styles for the table row
};

export default AnalysisEmail; 