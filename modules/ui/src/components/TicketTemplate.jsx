import React from 'react';
import { 
  Document, 
  Page, 
  View, 
  Text, 
  Image, 
  StyleSheet, 
  Font 
} from '@react-pdf/renderer';

// Register Roboto Font for Vietnamese support
Font.register({
  family: 'Roboto',
  fonts: [
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Regular.ttf' },
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Medium.ttf', fontWeight: 700 },
  ],
});

const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    backgroundColor: '#090014', // THEME_COLORS.BACKGROUND
    color: '#E0E0E0',
    padding: 0,
    width: 600,
    height: 240,
    fontFamily: 'Roboto',
  },
  // --- MAIN PART (72%) ---
  mainSection: {
    width: '72%',
    padding: 24,
    borderRight: '1px dashed #2D1B4E',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
  },
  brandHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  logoText: {
    fontSize: 10,
    fontWeight: 700,
    color: '#00FFFF',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  ticketLabel: {
    fontSize: 8,
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  eventTitle: {
    fontSize: 22,
    fontWeight: 700,
    color: '#FFFFFF',
    textTransform: 'uppercase',
    marginBottom: 15,
    height: 50, // Fixed height to prevent shifting
  },
  detailsColumn: {
    flexDirection: 'column',
    marginBottom: 15,
  },
  detailsRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  detailBlock: {
    width: '33%', // Fixed width columns to prevent overlap
  },
  detailLabel: {
    fontSize: 7,
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 9,
    fontWeight: 700,
    color: '#FFFFFF',
  },
  footerInfo: {
    borderTop: '1px solid #2D1B4E',
    paddingTop: 12,
    marginTop: 'auto',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userName: {
    fontSize: 11,
    fontWeight: 700,
    color: '#00FFFF',
  },
  issueDate: {
    fontSize: 7,
    color: '#94a3b8',
  },

  // --- STUB PART (28%) ---
  stubSection: {
    width: '28%',
    backgroundColor: '#0D021F',
    padding: 20,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrContainer: {
    backgroundColor: '#FFFFFF',
    padding: 6,
    borderRadius: 4,
    marginBottom: 10,
  },
  qrImage: {
    width: 90,
    height: 90,
  },
  stubId: {
    fontSize: 8,
    color: '#00FFFF',
    marginTop: 5,
    textAlign: 'center',
  },
  stubNote: {
    fontSize: 6,
    color: '#94a3b8',
    marginTop: 12,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  
  circleTop: {
    position: 'absolute',
    top: -10,
    right: -10,
    width: 20,
    height: 20,
    backgroundColor: '#090014', 
    borderRadius: 10,
    zIndex: 10,
  },
  circleBottom: {
    position: 'absolute',
    bottom: -10,
    right: -10,
    width: 20,
    height: 20,
    backgroundColor: '#090014',
    borderRadius: 10,
    zIndex: 10,
  }
});

/**
 * TicketTemplate Component
 * @param {Object} props
 * @param {Object} props.ticket - The ticket data object
 * @param {string} props.qrCode - Data URL of the QR code
 */
const TicketTemplate = ({ ticket, qrCode }) => {
  if (!ticket) return null;

  const { event, user, _id, createdAt } = ticket;
  const formattedDate = event?.date ? new Date(event.date).toLocaleDateString('vi-VN', {
    day: '2-digit', month: '2-digit', year: 'numeric'
  }) : 'N/A';
  
  const issueDate = createdAt ? new Date(createdAt).toLocaleDateString('vi-VN') : 'N/A';
  const ticketIdShort = String(_id).slice(-8).toUpperCase();

  return (
    <Document title={`Ticket-${ticketIdShort}`}>
      <Page size={[600, 240]} style={styles.page}>
        {/* Main Section */}
        <View style={styles.mainSection}>
          <View style={styles.brandHeader}>
            <Text style={styles.logoText}>CLOUD TICKET</Text>
            <Text style={styles.ticketLabel}>Official Entry Pass</Text>
          </View>

          <View>
            <Text style={styles.eventTitle}>{event?.title || 'EVENT TITLE'}</Text>
            
            <View style={styles.detailsRow}>
              <View style={styles.detailBlock}>
                <Text style={styles.detailLabel}>Date</Text>
                <Text style={styles.detailValue}>{formattedDate}</Text>
              </View>
              <View style={styles.detailBlock}>
                <Text style={styles.detailLabel}>Location</Text>
                <Text style={styles.detailValue}>{event?.location || 'TBA'}</Text>
              </View>
              <View style={styles.detailBlock}>
                <Text style={styles.detailLabel}>Time</Text>
                <Text style={styles.detailValue}>08:00 AM</Text>
              </View>
            </View>
          </View>

          <View style={styles.footerInfo}>
            <View>
              <Text style={styles.detailLabel}>Ticket Holder</Text>
              <Text style={styles.userName}>{user?.displayName || 'Guest User'}</Text>
            </View>
            <Text style={styles.issueDate}>Issued on: {issueDate}</Text>
          </View>

          {/* Decorative cuts */}
          <View style={styles.circleTop} />
          <View style={styles.circleBottom} />
        </View>

        {/* Stub Section */}
        <View style={styles.stubSection}>
          <View style={styles.qrContainer}>
            {qrCode ? (
              <Image src={qrCode} style={styles.qrImage} />
            ) : (
              <View style={[styles.qrImage, { backgroundColor: '#1A003C', justifyContent: 'center', alignItems: 'center' }]}>
                <Text style={{ color: '#00FFFF', fontSize: 8 }}>QR READY</Text>
              </View>
            )}
          </View>
          
          <Text style={styles.detailLabel}>Ticket ID</Text>
          <Text style={styles.stubId}>#{ticketIdShort}</Text>
          
          <Text style={styles.stubNote}>Valid identity card required at the gate</Text>
        </View>
      </Page>
    </Document>
  );
};

export default TicketTemplate;
