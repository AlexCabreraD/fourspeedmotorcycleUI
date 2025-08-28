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

interface ShippingNotificationEmailProps {
  customerName: string
  orderNumber: string
  trackingNumber: string
  carrier: string
  estimatedDelivery?: string
}

export default function ShippingNotificationEmail({
  customerName = 'John Doe',
  orderNumber = 'ORD-12345',
  trackingNumber = '1Z999AA1234567890',
  carrier = 'UPS',
  estimatedDelivery = 'Friday, December 15',
}: ShippingNotificationEmailProps) {
  const previewText = `Your order ${orderNumber} has shipped! Track it with ${trackingNumber}`

  const getCarrierTrackingUrl = (carrier: string, trackingNumber: string) => {
    switch (carrier.toLowerCase()) {
      case 'ups':
        return `https://www.ups.com/track?tracknum=${trackingNumber}`
      case 'fedex':
        return `https://www.fedex.com/fedextrack/?trknbr=${trackingNumber}`
      case 'usps':
        return `https://tools.usps.com/go/TrackConfirmAction?tLabels=${trackingNumber}`
      default:
        return '#'
    }
  }

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Heading style={headerTitle}>Your Order Has Shipped!</Heading>
            <Text style={headerSubtitle}>Four Speed Motorcycle Shop</Text>
          </Section>

          <Section style={content}>
            <Section style={greeting}>
              <Heading style={greetingTitle}>Great news, {customerName}!</Heading>
              <Text style={greetingText}>
                Your motorcycle parts are on their way. Your order is now in transit and you'll have
                it soon.
              </Text>
            </Section>

            <Section style={shippingInfo}>
              <Row>
                <Column style={shippingDetail}>
                  <Text style={shippingLabel}>Order Number</Text>
                  <Text style={shippingValue}>{orderNumber}</Text>
                </Column>
                <Column style={shippingDetail}>
                  <Text style={shippingLabel}>Carrier</Text>
                  <Text style={shippingValue}>{carrier}</Text>
                </Column>
              </Row>
              <Row style={trackingRow}>
                <Column>
                  <Text style={shippingLabel}>Tracking Number</Text>
                  <Text style={trackingNumber}>{trackingNumber}</Text>
                </Column>
              </Row>
              {estimatedDelivery && (
                <Row>
                  <Column>
                    <Text style={shippingLabel}>Estimated Delivery</Text>
                    <Text style={estimatedDeliveryText}>{estimatedDelivery}</Text>
                  </Column>
                </Row>
              )}
            </Section>

            <Section style={trackingButton}>
              <a href={getCarrierTrackingUrl(carrier, trackingNumber)} style={buttonLink}>
                <Text style={buttonText}>Track Your Package</Text>
              </a>
            </Section>

            <Hr style={hr} />

            <Section style={deliveryTips}>
              <Heading style={sectionTitle}>Delivery Information</Heading>
              <Text style={bodyText}>
                <strong>📦 Package Protection:</strong> Your items are securely packaged to ensure
                they arrive in perfect condition.
              </Text>
              <Text style={bodyText}>
                <strong>🏠 Delivery Requirements:</strong> A signature may be required for
                high-value orders.
              </Text>
              <Text style={bodyText}>
                <strong>📱 Stay Updated:</strong> You'll receive SMS updates if you provided a
                mobile number.
              </Text>
              <Text style={bodyText}>
                <strong>❓ Questions?</strong> Contact us at support@4speedmotorcycle.com if you
                have any concerns.
              </Text>
            </Section>

            <Hr style={hr} />

            <Section style={footer}>
              <Text style={footerTitle}>Keep Your Ride Running Strong</Text>
              <Text style={footerText}>
                Thank you for choosing Four Speed Motorcycle Shop for your parts needs. We're here
                to help you keep your bike performing at its best.
              </Text>
              <Text style={footerText}>
                Need more parts? Visit us online anytime at 4speedmotorcycle.com
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
  background: 'linear-gradient(135deg, #10b981, #059669)',
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

const shippingInfo = {
  backgroundColor: '#f0fdf4',
  border: '2px solid #bbf7d0',
  padding: '25px',
  borderRadius: '12px',
  marginBottom: '30px',
}

const shippingDetail = {
  textAlign: 'center' as const,
  marginBottom: '15px',
}

const trackingRow = {
  marginTop: '20px',
  marginBottom: '15px',
}

const shippingLabel = {
  color: '#059669',
  fontSize: '14px',
  fontWeight: '600',
  margin: '0 0 5px 0',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.05em',
}

const shippingValue = {
  color: '#111827',
  fontSize: '16px',
  fontWeight: 'bold',
  margin: '0',
}

const trackingNumber = {
  color: '#111827',
  fontSize: '20px',
  fontWeight: 'bold',
  margin: '0',
  fontFamily: 'monospace',
  letterSpacing: '0.05em',
}

const estimatedDeliveryText = {
  color: '#059669',
  fontSize: '18px',
  fontWeight: 'bold',
  margin: '0',
}

const trackingButton = {
  textAlign: 'center' as const,
  marginBottom: '30px',
}

const buttonLink = {
  backgroundColor: '#f97316',
  color: '#ffffff',
  padding: '15px 30px',
  borderRadius: '8px',
  textDecoration: 'none',
  display: 'inline-block',
  fontWeight: 'bold',
  fontSize: '16px',
}

const buttonText = {
  color: '#ffffff',
  margin: '0',
  fontWeight: 'bold',
}

const sectionTitle = {
  color: '#111827',
  fontSize: '20px',
  fontWeight: 'bold',
  margin: '0 0 20px 0',
}

const deliveryTips = {
  marginBottom: '30px',
}

const bodyText = {
  color: '#374151',
  fontSize: '16px',
  margin: '0 0 15px 0',
  lineHeight: '1.6',
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

const footerTitle = {
  color: '#111827',
  fontSize: '18px',
  fontWeight: 'bold',
  margin: '0 0 15px 0',
}

const footerText = {
  color: '#6b7280',
  fontSize: '14px',
  margin: '0 0 10px 0',
  lineHeight: '1.5',
}
