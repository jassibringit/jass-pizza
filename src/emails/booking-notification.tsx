import { format, parseISO } from "date-fns";
import {
  Body,
  Button,
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
} from "react-email";
import type { QuoteData } from "@/lib/booking-schema";

// Email apps ignore stylesheets and can't read globals.css or load our fonts,
// so the brand colours are repeated here and every style is inline.
// Same dark palette as the website (see CLAUDE.md).
const colors = {
  background: "#0E0D0B", // ink
  card: "#1C1A15", // ink-3
  text: "#F4EEE2", // ivory
  muted: "#B8AF9E", // stone
  gold: "#C9A24A",
  line: "#3A3428", // thin divider, a little lighter than the card
};
const serif = "Georgia, 'Times New Roman', serif"; // stands in for Playfair
const sans = "Helvetica, Arial, sans-serif"; // stands in for DM Sans

export default function BookingNotification(booking: QuoteData) {
    const eventDate = format(parseISO(booking.date), "EEEE, MMMM d, yyyy");
//   const eventDate = format(parseISO("2026-10-31"), "EEEE, MMMM d, yyyy");
    const firstName = booking.name.split(" ")[0];
//   const firstName = "jassi";

  const eventRows = [
    { label: "Celebrating", value: booking.eventType },
    { label: "Date", value: eventDate },
    { label: "Guests", value: String(booking.guests) },
    { label: "City", value: booking.city },
  ];
  const contactRows = [
    { label: "Name", value: booking.name },
    { label: "Email", value: booking.email },
    { label: "Phone", value: booking.phone },
  ];

  return (
    <Html lang="en">
      <Head>
        {/* Tells Apple Mail and others the email is already dark,
            so they don't try to invert the colours */}
        <meta name="color-scheme" content="dark" />
        <meta name="supported-color-schemes" content="dark" />
      </Head>
      {/* The grey preview line next to the subject in the inbox */}
      <Preview>
        {`${booking.guests} guests in ${booking.city}, from ${booking.name}`}
      </Preview>

      <Body
        style={{ margin: 0, backgroundColor: colors.background, fontFamily: sans }}
      >
        {/* Background repeated here: Gmail sometimes drops the Body colour */}
        <Container
          style={{
            maxWidth: 560,
            margin: "0 auto",
            padding: "32px 16px",
            backgroundColor: colors.background,
          }}
        >
          <Text style={eyebrow}>Jass Pizza · New inquiry</Text>
          <Heading
            as="h1"
            style={{
              margin: "8px 0 0",
              fontFamily: serif,
              fontSize: 32,
              lineHeight: "38px",
              color: colors.text,
            }}
          >
            new quote request<span style={{ color: colors.gold }}>.</span>
          </Heading>
          <Text style={{ margin: "12px 0 0", fontSize: 18, color: colors.text }}>
            {booking.eventType} · {booking.guests} guests
          </Text>
          <Text
            style={{ margin: "4px 0 24px", fontSize: 15, color: colors.muted }}
          >
            {eventDate} · {booking.city}
          </Text>

          <Button
            href={`mailto:${booking.email}`}
            style={{
              backgroundColor: colors.gold,
              color: colors.background,
              borderRadius: 999,
              padding: "14px 24px",
              fontSize: 15,
              fontWeight: 700,
            }}
          >
            Reply to {firstName} →
          </Button>

          <Section style={card}>
            <Text style={eyebrow}>The event</Text>
            {eventRows.map((row) => (
              <DetailRow key={row.label} label={row.label} value={row.value} />
            ))}
          </Section>

          <Section style={card}>
            <Text style={eyebrow}>Contact</Text>
            {contactRows.map((row) => (
              <DetailRow key={row.label} label={row.label} value={row.value} />
            ))}
          </Section>

          {booking.message && (
            <Section style={card}>
              <Text style={eyebrow}>Their message</Text>
              <Text
                style={{
                  margin: "12px 0 0",
                  paddingLeft: 12,
                  borderLeft: `2px solid ${colors.gold}`,
                  fontSize: 15,
                  lineHeight: "24px",
                  color: colors.text,
                  whiteSpace: "pre-line",
                }}
              >
                {booking.message}
              </Text>
            </Section>
          )}

          <Hr style={{ borderColor: colors.line, margin: "32px 0 16px" }} />
          <Text
            style={{
              margin: 0,
              fontSize: 13,
              lineHeight: "20px",
              color: colors.muted,
            }}
          >
            Sent from the quote form on your website. Replying to this email
            goes straight to {booking.email}.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

// One label/value line. Empty answers show a dash so every row is always there.
function DetailRow({ label, value }: { label: string; value?: string }) {
  return (
    <Row style={{ borderTop: `1px solid ${colors.line}` }}>
      <Column
        style={{
          width: "40%",
          padding: "10px 0",
          fontSize: 14,
          color: colors.muted,
          verticalAlign: "top",
        }}
      >
        {label}
      </Column>
      <Column
        style={{
          padding: "10px 0",
          fontSize: 15,
          color: colors.text,
          verticalAlign: "top",
        }}
      >
        {value || "—"}
      </Column>
    </Row>
  );
}

// Shared styles, like the class constants in quote-section.tsx.
const eyebrow = {
  margin: 0,
  fontSize: 12,
  letterSpacing: "0.2em",
  textTransform: "uppercase" as const,
  color: colors.gold,
};
const card = {
  marginTop: 24,
  padding: "20px 24px 12px",
  backgroundColor: colors.card,
  border: `1px solid ${colors.line}`,
  borderRadius: 12,
};
