import type { Metadata } from "next";
import { AlertOctagon, Clock3, Mail, MapPin, Phone, TriangleAlert } from "lucide-react";
import { EnquiryForm } from "@/components/enquiry-form";
import { Reveal } from "@/components/reveal";
import { Badge, PageHero } from "@/components/ui";
import { HOSPITAL_HOURS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Send an administrative enquiry or view our hospital contact information and department opening hours.",
};

const CONTACT_ITEMS = [
  {
    icon: Phone,
    title: "Phone Number",
    lines: ["+1 (555) 010-2020", "Demo support line"],
  },
  {
    icon: Mail,
    title: "Email Address",
    lines: ["hello@medicare.example"],
  },
  {
    icon: MapPin,
    title: "Hospital Address",
    lines: ["125 Wellness Avenue", "Demo City, DC 00000"],
  },
  {
    icon: Clock3,
    title: "Opening Hours",
    lines: [HOSPITAL_HOURS.label, HOSPITAL_HOURS.sundayLabel],
  },
];

export default function ContactPage() {
  return (
    <>
      <PageHero
        badge="Get In Touch"
        title="We're Here to Help"
        description="Send an administrative enquiry, or reach out through our contact channels for department information and opening hours."
      />

      <section className="section bg-paper">
        <div className="container-site">
          {/* Emergency Information Strip */}
          <Reveal>
            <div className="mb-10 flex items-center gap-3 rounded-2xl border border-rose-200 bg-rose-50 px-5 py-3.5 text-[0.84rem] font-medium text-rose-900 shadow-sm">
              <AlertOctagon className="h-5 w-5 shrink-0 text-rose-600" />
              <span>
                For medical emergencies, call your local emergency number immediately. This website is not for emergency use.
              </span>
            </div>
          </Reveal>

          <div className="grid items-start gap-12 lg:grid-cols-[1fr_1.25fr]">
            <div>
              <Reveal>
                <Badge>Contact Information</Badge>
                <h2 className="display mt-5 text-[clamp(1.8rem,3vw,2.5rem)] font-extrabold text-navy">
                  Let&apos;s Connect
                </h2>
                <p className="mt-4 text-[0.95rem]">
                  Have a question about our departments, opening hours, or the
                  appointment process? The assistant in the corner can also help
                  instantly.
                </p>
              </Reveal>

              <div className="mt-9 space-y-6">
                {CONTACT_ITEMS.map((item, index) => (
                  <Reveal key={item.title} delay={index * 70}>
                    <div className="flex items-start gap-4">
                      <span className="icon-tile !h-12 !w-12">
                        <item.icon className="h-5 w-5" strokeWidth={1.9} />
                      </span>
                      <div>
                        <h3 className="font-display text-[0.95rem] font-bold text-navy">
                          {item.title}
                        </h3>
                        {item.lines.map((line, i) => (
                          <p
                            key={line}
                            className={`text-[0.82rem] ${
                              i > 0 || item.lines.length > 1 ? "text-ink" : ""
                            }`}
                          >
                            {line}
                          </p>
                        ))}
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>

              <Reveal delay={300}>
                <div className="notice notice-warning mt-9 flex items-start gap-2.5">
                  <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>
                    These contact details are for demonstration only. Nothing here
                    connects to emergency services or an active medical helpline.
                  </span>
                </div>
              </Reveal>
            </div>

            <Reveal delay={120}>
              <EnquiryForm />
            </Reveal>
          </div>

          {/* Embedded Map */}
          <Reveal delay={200} className="mt-14">
            <div className="overflow-hidden rounded-[1.6rem] border border-line bg-white p-4 shadow-sm">
              <div className="relative h-[320px] w-full overflow-hidden rounded-xl">
                <iframe
                  title="MediCare Hospital Illustrative Location Map"
                  width="100%"
                  height="100%"
                  loading="lazy"
                  style={{ border: 0 }}
                  src="https://www.openstreetmap.org/export/embed.html?bbox=77.585%2C12.965%2C77.615%2C12.985&amp;layer=mapnik"
                />
              </div>
              <p className="mt-2.5 text-center text-[0.76rem] font-medium text-ink">
                Map shows an illustrative location
              </p>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
