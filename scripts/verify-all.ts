import { getHospitalOpdStatus, DEPARTMENTS } from "../src/lib/constants";
import { DOCTORS_DATA } from "../src/lib/doctor-data";

async function main() {
  console.log("=== 1. TEST OPD STATUS HELPER ===");
  // Test simulated dates/times in Asia/Kolkata (UTC+5:30)
  // Mon Oct 26 2026, 10:00 AM IST = 04:30 UTC
  const mon10am = new Date("2026-10-26T04:30:00Z");
  const status1 = getHospitalOpdStatus(mon10am);
  console.log("Mon 10:00 AM IST:", status1);
  if (!status1.statusText.includes("Open now") || !status1.isOpen) {
    throw new Error(`Expected Open now, got: ${JSON.stringify(status1)}`);
  }

  // Mon Oct 26 2026, 07:00 AM IST = 01:30 UTC
  const mon7am = new Date("2026-10-26T01:30:00Z");
  const status2 = getHospitalOpdStatus(mon7am);
  console.log("Mon 07:00 AM IST:", status2);
  if (!status2.statusText.includes("Opens today at 8 AM") || status2.isOpen) {
    throw new Error(`Expected Opens today at 8 AM, got: ${JSON.stringify(status2)}`);
  }

  // Mon Oct 26 2026, 09:00 PM IST = 15:30 UTC
  const mon9pm = new Date("2026-10-26T15:30:00Z");
  const status3 = getHospitalOpdStatus(mon9pm);
  console.log("Mon 09:00 PM IST:", status3);
  if (!status3.statusText.includes("Closed today · opens Tuesday 8 AM") || status3.isOpen) {
    throw new Error(`Expected Closed today · opens Tuesday 8 AM, got: ${JSON.stringify(status3)}`);
  }

  // Sat Oct 31 2026, 09:00 PM IST = 15:30 UTC
  const sat9pm = new Date("2026-10-31T15:30:00Z");
  const status4 = getHospitalOpdStatus(sat9pm);
  console.log("Sat 09:00 PM IST:", status4);
  if (!status4.statusText.includes("Closed today · opens Monday 8 AM") || status4.isOpen) {
    throw new Error(`Expected Closed today · opens Monday 8 AM, got: ${JSON.stringify(status4)}`);
  }

  // Sun Oct 25 2026, 12:00 PM IST = 06:30 UTC
  const sun12pm = new Date("2026-10-25T06:30:00Z");
  const status5 = getHospitalOpdStatus(sun12pm);
  console.log("Sun 12:00 PM IST:", status5);
  if (!status5.statusText.includes("Closed today · opens Monday 8 AM") || status5.isOpen) {
    throw new Error(`Expected Closed today · opens Monday 8 AM, got: ${JSON.stringify(status5)}`);
  }
  console.log("-> OPD Status helper tests PASSED!\n");

  console.log("=== 2. TEST DEPARTMENTS & 12 DOCTORS ===");
  const expectedSlugs = ["cardiology", "neurology", "orthopedics", "pediatrics", "general", "dermatology"];
  const actualSlugs = DEPARTMENTS.map(d => d.slug);
  console.log("Department slugs:", actualSlugs);
  if (JSON.stringify(actualSlugs) !== JSON.stringify(expectedSlugs)) {
    throw new Error(`Slugs mismatch! Expected ${expectedSlugs}, got ${actualSlugs}`);
  }

  const doctorList = Object.values(DOCTORS_DATA);
  console.log(`Total doctors defined: ${doctorList.length}`);
  if (doctorList.length !== 12) {
    throw new Error(`Expected 12 doctors, got ${doctorList.length}`);
  }

  // Verify each department has exactly 2 doctors
  for (const slug of expectedSlugs) {
    const deptDoctors = doctorList.filter(d => d.departmentId === slug);
    console.log(`Department ${slug} has ${deptDoctors.length} doctors:`, deptDoctors.map(d => d.name));
    if (deptDoctors.length !== 2) {
      throw new Error(`Department ${slug} expected 2 doctors, got ${deptDoctors.length}`);
    }
  }
  console.log("-> Department and 12 doctors structure PASSED!\n");

  console.log("=== 3. TEST DOCTOR META DESCRIPTIONS (150-160 CHARS) ===");
  for (const [id, doc] of Object.entries(DOCTORS_DATA)) {
    const len = doc.metaDescription.length;
    console.log(`Doctor ${id} (${doc.name}) meta desc length: ${len}`);
    if (len < 150 || len > 160) {
      throw new Error(`Doctor ${id} meta description length ${len} is outside 150-160 range!`);
    }
  }
  console.log("-> All 12 doctor meta description lengths PASSED!\n");

  console.log("=== 4. TEST LIVE ENDPOINTS ON DEV SERVER (localhost:3000) ===");
  // Test Home page
  const homeRes = await fetch("http://localhost:3000/");
  console.log("GET / status:", homeRes.status);
  const homeHtml = await homeRes.text();
  if (homeRes.status !== 200 || !homeHtml.includes("What Our Patients Say") || !homeHtml.includes("Illustrative testimonials")) {
    throw new Error("Home page missing Testimonials section");
  }

  // Test About page
  const aboutRes = await fetch("http://localhost:3000/about");
  console.log("GET /about status:", aboutRes.status);
  const aboutHtml = await aboutRes.text();
  if (aboutRes.status !== 200 || !aboutHtml.includes("Our Healthcare Journey") || !aboutHtml.includes("Facilities Gallery")) {
    throw new Error("About page missing new journey or gallery sections");
  }

  // Test Departments page
  const deptRes = await fetch("http://localhost:3000/departments");
  console.log("GET /departments status:", deptRes.status);
  const deptHtml = await deptRes.text();
  if (!deptHtml.includes("2 Specialists")) {
    throw new Error("Departments page does not show '2 Specialists'");
  }

  // Test FAQ page
  const faqRes = await fetch("http://localhost:3000/faq");
  console.log("GET /faq status:", faqRes.status);
  const faqHtml = await faqRes.text();
  if (faqRes.status !== 200 || !faqHtml.includes("FAQPage") || !faqHtml.includes("How do I request an appointment")) {
    throw new Error("FAQ page missing FAQPage schema or content");
  }

  // Test Legal pages
  const privRes = await fetch("http://localhost:3000/privacy");
  console.log("GET /privacy status:", privRes.status);
  if (privRes.status !== 200) throw new Error("Privacy page returned non-200");

  const termsRes = await fetch("http://localhost:3000/terms");
  console.log("GET /terms status:", termsRes.status);
  if (termsRes.status !== 200) throw new Error("Terms page returned non-200");

  // Test Sitemap
  const sitemapRes = await fetch("http://localhost:3000/sitemap.xml");
  console.log("GET /sitemap.xml status:", sitemapRes.status);
  const sitemapXml = await sitemapRes.text();
  if (sitemapRes.status !== 200 || !sitemapXml.includes("/doctors/d12") || !sitemapXml.includes("/faq")) {
    throw new Error("Sitemap missing doctors or new pages");
  }

  // Test 404 page for /doctors/d99
  const d99Res = await fetch("http://localhost:3000/doctors/d99");
  console.log("GET /doctors/d99 status:", d99Res.status);
  const d99Html = await d99Res.text();
  if (d99Res.status !== 404 || !d99Html.includes("Back to Home") || !d99Html.includes("Our Doctors") || !d99Html.includes("Book Appointment")) {
    throw new Error("404 page missing expected navigation links");
  }

  // Test new doctor profile /doctors/d7 (Dr. Marcus Vance)
  const d7Res = await fetch("http://localhost:3000/doctors/d7");
  console.log("GET /doctors/d7 status:", d7Res.status);
  const d7Html = await d7Res.text();
  if (d7Res.status !== 200 || !d7Html.includes("Dr. Marcus Vance") || !d7Html.includes("Next Available Slot")) {
    throw new Error("Doctor d7 profile failed to render properly");
  }

  // Test Admin Reset restoring 12 doctors
  const loginRes = await fetch("http://localhost:3000/api/admin/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password: "admin123" }),
  });
  console.log("Admin login status:", loginRes.status);
  const cookie = loginRes.headers.get("set-cookie");
  if (!loginRes.ok || !cookie) {
    throw new Error("Admin login failed during test");
  }

  const resetRes = await fetch("http://localhost:3000/api/admin/reset", {
    method: "POST",
    headers: { Cookie: cookie },
  });
  console.log("Admin reset status:", resetRes.status);
  if (!resetRes.ok) {
    throw new Error("Admin reset failed during test");
  }

  // Verify that doctors list still has 12 doctors after reset
  const docListRes = await fetch("http://localhost:3000/doctors");
  const docListHtml = await docListRes.text();
  if (!docListHtml.includes("Dr. Marcus Vance") || !docListHtml.includes("Dr. Maya Patel")) {
    throw new Error("Doctors missing after reset!");
  }
  console.log("Reset restored all 12 doctors successfully!");

  // Test booking with new doctor d7 (works Tue, Thu, Sat: days 2, 4, 6)
  const d = new Date();
  d.setDate(d.getDate() + 25);
  const diffTue = (2 - d.getDay() + 7) % 7;
  d.setDate(d.getDate() + diffTue);
  const tueDate = [
    d.getFullYear(),
    String(d.getMonth() + 1).padStart(2, "0"),
    String(d.getDate()).padStart(2, "0"),
  ].join("-");

  const bookD7Res = await fetch("http://localhost:3000/api/appointments", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      departmentId: "cardiology",
      doctorId: "d7",
      date: tueDate,
      time: "15:00",
      name: "Marcus Vance Patient",
      phone: "5558889999",
      email: "vance.patient@example.com",
      reason: "Consultation with new doctor d7",
    }),
  });
  console.log("POST /api/appointments for doctor d7 status:", bookD7Res.status);
  const bookD7Data = await bookD7Res.json();
  console.log("Doctor d7 booking reference:", bookD7Data.reference);
  if (!bookD7Res.ok || !bookD7Data.ok || !bookD7Data.reference) {
    throw new Error(`Booking with d7 failed: ${JSON.stringify(bookD7Data)}`);
  }

  // Test status lookup for d7 booking
  const lookupRes = await fetch("http://localhost:3000/api/appointments/status", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ reference: bookD7Data.reference, phone: "5558889999" }),
  });
  console.log("Status lookup for d7 booking status:", lookupRes.status);
  const lookupData = await lookupRes.json();
  console.log("Lookup result:", lookupData.appointment);
  if (!lookupRes.ok || !lookupData.ok || lookupData.appointment?.doctorName !== "Dr. Marcus Vance") {
    throw new Error(`Lookup failed or doctor mismatch: ${JSON.stringify(lookupData)}`);
  }

  console.log("\nALL VERIFICATION TESTS COMPLETED SUCCESSFULLY!");
}

main().catch((err) => {
  console.error("Verification failed:", err);
  process.exit(1);
});
