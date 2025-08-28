import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components'

interface ContactFormEmailProps {
  name: string
  email: string
  subject: string
  message: string
}

export default function ContactFormEmail({
  name = 'John Doe',
  email = 'john@example.com',
  subject = 'General Inquiry',
  message = 'This is a sample message from the contact form.',
}: ContactFormEmailProps) {
  const previewText = `New contact form submission from ${name}: ${subject}`

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Heading style={headerTitle}>New Contact Form Submission</Heading>
            <Text style={headerSubtitle}>Four Speed Motorcycle Shop</Text>
          </Section>

          <Section style={content}>
            <Section style={fieldSection}>
              <Text style={label}>From:</Text>
              <Section style={valueBox}>
                <Text style={value}>
                  {name} ({email})
                </Text>
              </Section>
            </Section>

            <Section style={fieldSection}>
              <Text style={label}>Subject:</Text>
              <Section style={valueBox}>
                <Text style={value}>{subject}</Text>
              </Section>
            </Section>

            <Section style={fieldSection}>
              <Text style={label}>Message:</Text>
              <Section style={messageBox}>
                <Text style={messageText}>{message}</Text>
              </Section>
            </Section>

            <Hr style={hr} />

            <Section style={footer}>
              <Text style={footerText}>
                This message was sent via the contact form on 4speedmotorcycle.com
              </Text>
              <Text style={footerText}>
                Received:{' '}
                {new Date().toLocaleString('en-US', {
                  timeZone: 'America/Los_Angeles',
                  dateStyle: 'full',
                  timeStyle: 'short',
                })}
              </Text>
            </Section>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

// Styles
const main = {
  backgroundColor: '#f6f9fc',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
}

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
  maxWidth: '600px',
}

const header = {
  background: 'linear-gradient(135deg, #f97316, #dc2626)',
  borderRadius: '10px 10px 0 0',
  padding: '30px',
  textAlign: 'center' as const,
}

const headerTitle = {
  color: '#ffffff',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '0',
}

const headerSubtitle = {
  color: '#ffffff',
  fontSize: '16px',
  margin: '10px 0 0 0',
  opacity: 0.9,
}

const content = {
  backgroundColor: '#f9fafb',
  padding: '30px',
  borderRadius: '0 0 10px 10px',
}

const fieldSection = {
  marginBottom: '20px',
}

const label = {
  fontWeight: 'bold',
  color: '#374151',
  fontSize: '14px',
  marginBottom: '8px',
  margin: '0 0 8px 0',
}

const valueBox = {
  backgroundColor: '#ffffff',
  padding: '15px',
  borderRadius: '8px',
  border: '1px solid #e5e7eb',
}

const value = {
  color: '#111827',
  fontSize: '16px',
  margin: '0',
  lineHeight: '1.4',
}

const messageBox = {
  backgroundColor: '#ffffff',
  padding: '20px',
  borderRadius: '8px',
  borderLeft: '4px solid #f97316',
  border: '1px solid #e5e7eb',
}

const messageText = {
  color: '#111827',
  fontSize: '16px',
  margin: '0',
  lineHeight: '1.6',
  whiteSpace: 'pre-wrap' as const,
}

const hr = {
  borderColor: '#e6e8eb',
  margin: '30px 0',
}

const footer = {
  textAlign: 'center' as const,
  marginTop: '30px',
}

const footerText = {
  color: '#6b7280',
  fontSize: '14px',
  margin: '5px 0',
}
