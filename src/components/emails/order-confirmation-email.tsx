import {
  Body,
  Column,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Row,
  Section,
  Text,
} from '@react-email/components'

interface OrderItem {
  name: string
  quantity: number
  price: string
}

interface OrderConfirmationEmailProps {
  customerName: string
  orderNumber: string
  orderTotal: string
  items: OrderItem[]
}

export default function OrderConfirmationEmail({
  customerName = 'John Doe',
  orderNumber = 'ORD-12345',
  orderTotal = '$299.99',
  items = [
    { name: 'Suspension Fork Springs', quantity: 1, price: '$149.99' },
    { name: 'Performance Air Filter', quantity: 1, price: '$79.99' },
    { name: 'Brake Pads - Front', quantity: 1, price: '$69.99' },
  ],
}: OrderConfirmationEmailProps) {
  const previewText = `Your order ${orderNumber} has been confirmed - Thank you for choosing Four Speed Motorcycle!`

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Heading style={headerTitle}>Order Confirmed!</Heading>
            <Text style={headerSubtitle}>Four Speed Motorcycle Shop</Text>
          </Section>

          <Section style={content}>
            <Section style={greeting}>
              <Heading style={greetingTitle}>Thank you, {customerName}!</Heading>
              <Text style={greetingText}>
                Your order has been confirmed and is being prepared for shipment.
              </Text>
            </Section>

            <Section style={orderInfo}>
              <Row>
                <Column style={orderDetail}>
                  <Text style={orderLabel}>Order Number</Text>
                  <Text style={orderValue}>{orderNumber}</Text>
                </Column>
                <Column style={orderDetail}>
                  <Text style={orderLabel}>Order Total</Text>
                  <Text style={orderValue}>{orderTotal}</Text>
                </Column>
              </Row>
            </Section>

            <Hr style={hr} />

            <Section>
              <Heading style={sectionTitle}>Order Details</Heading>

              {items.map((item, index) => (
                <Section key={index} style={itemRow}>
                  <Row>
                    <Column style={itemName}>
                      <Text style={itemText}>{item.name}</Text>
                      <Text style={itemQuantity}>Qty: {item.quantity}</Text>
                    </Column>
                    <Column style={itemPrice}>
                      <Text style={itemPriceText}>{item.price}</Text>
                    </Column>
                  </Row>
                </Section>
              ))}
            </Section>

            <Hr style={hr} />

            <Section style={totalSection}>
              <Row>
                <Column>
                  <Text style={totalLabel}>Total</Text>
                </Column>
                <Column>
                  <Text style={totalValue}>{orderTotal}</Text>
                </Column>
              </Row>
            </Section>

            <Section style={nextSteps}>
              <Heading style={sectionTitle}>What's Next?</Heading>
              <Text style={bodyText}>
                • We'll send you a shipping confirmation email with tracking information once your
                order ships
              </Text>
              <Text style={bodyText}>• Orders typically ship within 1-2 business days</Text>
              <Text style={bodyText}>
                • You can track your order status in your account dashboard
              </Text>
            </Section>

            <Hr style={hr} />

            <Section style={footer}>
              <Text style={footerText}>
                Questions about your order? Contact us at{' '}
                <Text style={linkText}>support@4speedmotorcycle.com</Text>
              </Text>
              <Text style={footerText}>
                Four Speed Motorcycle Shop - Your trusted parts partner
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
  borderRadius: '10px',
  overflow: 'hidden',
}

const header = {
  background: 'linear-gradient(135deg, #f97316, #dc2626)',
  padding: '40px 30px',
  textAlign: 'center' as const,
}

const headerTitle = {
  color: '#ffffff',
  fontSize: '28px',
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
  padding: '40px 30px',
}

const greeting = {
  textAlign: 'center' as const,
  marginBottom: '30px',
}

const greetingTitle = {
  color: '#111827',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '0 0 10px 0',
}

const greetingText = {
  color: '#6b7280',
  fontSize: '16px',
  margin: '0',
  lineHeight: '1.5',
}

const orderInfo = {
  backgroundColor: '#f9fafb',
  padding: '20px',
  borderRadius: '8px',
  marginBottom: '30px',
}

const orderDetail = {
  textAlign: 'center' as const,
}

const orderLabel = {
  color: '#6b7280',
  fontSize: '14px',
  fontWeight: '600',
  margin: '0 0 5px 0',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.05em',
}

const orderValue = {
  color: '#111827',
  fontSize: '18px',
  fontWeight: 'bold',
  margin: '0',
}

const sectionTitle = {
  color: '#111827',
  fontSize: '20px',
  fontWeight: 'bold',
  margin: '0 0 20px 0',
}

const itemRow = {
  borderBottom: '1px solid #e5e7eb',
  paddingBottom: '15px',
  marginBottom: '15px',
}

const itemName = {
  width: '70%',
}

const itemPrice = {
  width: '30%',
  textAlign: 'right' as const,
}

const itemText = {
  color: '#111827',
  fontSize: '16px',
  margin: '0 0 5px 0',
  fontWeight: '500',
}

const itemQuantity = {
  color: '#6b7280',
  fontSize: '14px',
  margin: '0',
}

const itemPriceText = {
  color: '#111827',
  fontSize: '16px',
  fontWeight: 'bold',
  margin: '0',
}

const totalSection = {
  backgroundColor: '#f9fafb',
  padding: '20px',
  borderRadius: '8px',
  marginBottom: '30px',
}

const totalLabel = {
  color: '#111827',
  fontSize: '18px',
  fontWeight: 'bold',
  margin: '0',
  textAlign: 'right' as const,
}

const totalValue = {
  color: '#f97316',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '0',
  textAlign: 'right' as const,
}

const nextSteps = {
  marginBottom: '30px',
}

const bodyText = {
  color: '#374151',
  fontSize: '16px',
  margin: '0 0 10px 0',
  lineHeight: '1.5',
}

const hr = {
  borderColor: '#e6e8eb',
  margin: '30px 0',
}

const footer = {
  textAlign: 'center' as const,
  borderTop: '1px solid #e5e7eb',
  paddingTop: '30px',
}

const footerText = {
  color: '#6b7280',
  fontSize: '14px',
  margin: '5px 0',
  lineHeight: '1.5',
}

const linkText = {
  color: '#f97316',
  textDecoration: 'none',
  fontWeight: '500',
}
