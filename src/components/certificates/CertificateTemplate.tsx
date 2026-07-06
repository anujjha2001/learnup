import React from "react";
import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";

// Stylesheet matching the Black-Purple-Orange premium LMS brand
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#050505", // Deep Black
    padding: 30,
    width: "100%",
    height: "100%",
  },
  borderContainer: {
    border: "2px solid #8b5cf6", // Purple border
    borderRadius: 16,
    flex: 1,
    padding: 30,
    position: "relative",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  accentLineTop: {
    position: "absolute",
    top: 0,
    left: "15%",
    right: "15%",
    height: 4,
    backgroundColor: "#f97316", // Orange accent top line
  },
  accentLineBottom: {
    position: "absolute",
    bottom: 0,
    left: "15%",
    right: "15%",
    height: 4,
    backgroundColor: "#f97316", // Orange accent bottom line
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  logoText: {
    color: "#ffffff",
    fontSize: 24,
    fontWeight: "bold",
    letterSpacing: 1.5,
  },
  logoSub: {
    color: "#f97316", // Orange
    fontSize: 24,
    fontWeight: "bold",
  },
  badgeText: {
    color: "#8b5cf6", // Purple
    fontSize: 10,
    fontWeight: "bold",
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  body: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
  },
  mainTitle: {
    color: "#ffffff",
    fontSize: 32,
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: 4,
    marginBottom: 8,
  },
  subTitle: {
    color: "#94a3b8", // slate-400
    fontSize: 12,
    marginBottom: 20,
    letterSpacing: 1.5,
  },
  presentText: {
    color: "#94a3b8",
    fontSize: 10,
    fontStyle: "italic",
    marginBottom: 10,
  },
  studentName: {
    color: "#f97316", // Orange
    fontSize: 36,
    fontWeight: "bold",
    marginVertical: 10,
    textDecoration: "underline",
    textDecorationColor: "#8b5cf6",
  },
  courseInfo: {
    color: "#ffffff",
    fontSize: 14,
    textAlign: "center",
    marginTop: 15,
    maxWidth: "80%",
    lineHeight: 1.5,
  },
  courseTitle: {
    color: "#8b5cf6", // Purple
    fontWeight: "bold",
  },
  dateText: {
    color: "#64748b", // slate-500
    fontSize: 10,
    marginTop: 10,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginTop: 20,
  },
  signatureContainer: {
    flexDirection: "column",
    alignItems: "center",
    width: 150,
  },
  signatureImage: {
    width: 120,
    height: 45,
    objectFit: "contain",
    marginBottom: 5,
  },
  signLine: {
    borderBottom: "1px solid #475569",
    width: "100%",
    marginBottom: 5,
  },
  signTitle: {
    color: "#94a3b8",
    fontSize: 8,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  qrContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  qrImage: {
    width: 65,
    height: 65,
    backgroundColor: "#ffffff",
    padding: 2,
    borderRadius: 4,
  },
  verificationDetails: {
    flexDirection: "column",
  },
  verifyTitle: {
    color: "#ffffff",
    fontSize: 8,
    fontWeight: "bold",
    marginBottom: 2,
  },
  verifyCode: {
    color: "#8b5cf6",
    fontSize: 9,
    fontWeight: "bold",
  },
  verifyLink: {
    color: "#64748b",
    fontSize: 7,
    marginTop: 2,
  },
});

interface CertificateTemplateProps {
  studentName: string;
  courseTitle: string;
  issueDate: string;
  uniqueCode: string;
  qrCodeDataUrl: string; // Base64 QR Code
  signaturePath: string; // Local signature file path
}

export default function CertificateTemplate({
  studentName,
  courseTitle,
  issueDate,
  uniqueCode,
  qrCodeDataUrl,
  signaturePath,
}: CertificateTemplateProps) {
  return (
    <Document>
      <Page size="A4" orientation="landscape" style={styles.page}>
        <View style={styles.borderContainer}>
          {/* Top and Bottom Colored Accents */}
          <View style={styles.accentLineTop} />
          <View style={styles.accentLineBottom} />

          {/* Header */}
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Text style={styles.logoText}>Learn</Text>
              <Text style={styles.logoSub}>Up</Text>
            </View>
            <Text style={styles.badgeText}>OFFICIAL CREDENTIAL</Text>
          </View>

          {/* Body */}
          <View style={styles.body}>
            <Text style={styles.mainTitle}>Certificate of Completion</Text>
            <Text style={styles.subTitle}>HONORING INTELLECTUAL ACHIEVEMENT</Text>
            
            <Text style={styles.presentText}>This certificate is proudly awarded to</Text>
            <Text style={styles.studentName}>{studentName}</Text>
            
            <Text style={styles.courseInfo}>
              for successfully mastering all modules, labs, and the final assessment for the course{"\n"}
              <Text style={styles.courseTitle}>{courseTitle}</Text>
            </Text>

            <Text style={styles.dateText}>Issued on {issueDate}</Text>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            {/* Verification QR and Code */}
            <View style={styles.qrContainer}>
              {qrCodeDataUrl ? (
                <Image src={qrCodeDataUrl} style={styles.qrImage} />
              ) : null}
              <View style={styles.verificationDetails}>
                <Text style={styles.verifyTitle}>SECURE VERIFICATION</Text>
                <Text style={styles.verifyCode}>ID: {uniqueCode}</Text>
                <Text style={styles.verifyLink}>verify.learnup.com/verify/{uniqueCode}</Text>
              </View>
            </View>

            {/* Signature */}
            <View style={styles.signatureContainer}>
              {signaturePath ? (
                <Image src={signaturePath} style={styles.signatureImage} cache={false} />
              ) : null}
              <View style={styles.signLine} />
              <Text style={styles.signTitle}>Authorized Signature</Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
}
