import Link from 'next/link';
import LegalChrome from '@/components/legal/LegalChrome';
import {
  LegalCallout,
  LegalDoc,
  LegalList,
  LegalSection,
} from '@/components/legal/LegalDoc';
import {
  LEGAL_ENTITY,
  LEGAL_LAST_UPDATED,
  PRIVACY_EMAIL,
  SITE_NAME,
  SUPPORT_EMAIL,
  pageTitle,
} from '@/lib/ogi/branding';

export const metadata = {
  title: pageTitle('Terms of Service'),
  description: `Terms governing use of ${SITE_NAME}.`,
};

const TOC = [
  { id: 'agreement', label: 'Agreement' },
  { id: 'eligibility', label: 'Eligibility' },
  { id: 'accounts', label: 'Accounts & workspaces' },
  { id: 'service', label: 'The service' },
  { id: 'acceptable-use', label: 'Acceptable use' },
  { id: 'customer-content', label: 'Your content' },
  { id: 'ai-features', label: 'AI features' },
  { id: 'byok', label: 'Third-party AI keys' },
  { id: 'sms-messaging', label: 'SMS (A2P)' },
  { id: 'billing', label: 'Billing' },
  { id: 'ip', label: 'Intellectual property' },
  { id: 'disclaimers', label: 'Disclaimers' },
  { id: 'liability', label: 'Limitation of liability' },
  { id: 'termination', label: 'Termination' },
  { id: 'changes', label: 'Changes' },
  { id: 'contact', label: 'Contact' },
];

export default function TermsPage() {
  return (
    <LegalChrome>
      <LegalDoc
        eyebrow="Legal"
        title="Terms of Service"
        description={`These Terms govern your access to and use of ${SITE_NAME}, an OWeb satellite creative studio operated by ${LEGAL_ENTITY}.`}
        lastUpdated={LEGAL_LAST_UPDATED}
        toc={TOC}
        related={[{ label: 'Privacy Policy', href: '/privacy' }]}
      >
        <LegalSection id="agreement" title="1. Agreement to these Terms">
          <p>
            By accessing or using {SITE_NAME}, you agree to these Terms and our{' '}
            <Link href="/privacy" className="text-white hover:underline">
              Privacy Policy
            </Link>
            . If you use the service on behalf of an organization, you represent that you have
            authority to bind that organization.
          </p>
        </LegalSection>

        <LegalSection id="eligibility" title="2. Eligibility">
          <p>
            You must be at least 18 years old (or the age of majority in your jurisdiction) to use
            the service. You may not use the service where prohibited by law.
          </p>
        </LegalSection>

        <LegalSection id="accounts" title="3. Accounts & workspaces">
          <p>
            Authentication is provided through OWeb OneID. You are responsible for safeguarding your
            credentials and for activity under your account. Workspace administrators may manage
            membership and policies for their organization.
          </p>
        </LegalSection>

        <LegalSection id="service" title="4. The service">
          <p>
            {SITE_NAME} provides AI-assisted creative tools, workflows, agents, and access to OWeb
            apps. Features may change; we may add, modify, or discontinue functionality with
            reasonable notice when practicable.
          </p>
        </LegalSection>

        <LegalSection id="acceptable-use" title="5. Acceptable use">
          <p>You agree not to:</p>
          <LegalList
            items={[
              <>Violate law or third-party rights</>,
              <>Generate or distribute illegal content, malware, or non-consensual intimate imagery</>,
              <>Attempt to bypass security, rate limits, or usage controls</>,
              <>Misrepresent identity or send unsolicited messages without proper consent</>,
              <>Reverse engineer the service except where permitted by law</>,
            ]}
          />
        </LegalSection>

        <LegalSection id="customer-content" title="6. Your content">
          <p>
            You retain ownership of content you submit. You grant us a limited license to host,
            process, and transmit content solely to operate the service and provide support. You are
            responsible for obtaining rights to inputs you upload.
          </p>
        </LegalSection>

        <LegalSection id="ai-features" title="7. AI features">
          <p>
            AI outputs may be inaccurate or inappropriate. You are responsible for reviewing outputs
            before reliance or publication. We do not guarantee that models will be available
            uninterrupted.
          </p>
        </LegalSection>

        <LegalSection id="byok" title="8. Third-party AI keys">
          <p>
            When you supply a MuAPI or other provider key, you contract directly with that provider
            under their terms. Fees charged by third-party providers are your responsibility. Keys
            stored in your browser remain under your control.
          </p>
        </LegalSection>

        <LegalSection id="sms-messaging" title="9. SMS messaging (A2P)">
          <p>
            If you send SMS through OWeb communications or integrated tools, you agree to comply with
            applicable law, carrier rules, and CTIA guidelines, including obtaining prior express
            consent, providing clear opt-out (STOP) and help (HELP) instructions, and honoring
            suppression lists.
          </p>
          <LegalCallout>
            Message frequency varies. Message and data rates may apply. Carriers are not liable for
            delayed or undelivered messages.
          </LegalCallout>
          <p>
            You will not share or sell opt-in lists. {LEGAL_ENTITY} may suspend messaging for
            compliance violations.
          </p>
        </LegalSection>

        <LegalSection id="billing" title="10. Billing">
          <p>
            Paid features, credits, or subscriptions may be billed through OWeb or third-party
            processors. Taxes may apply. Refund policies are stated at purchase unless required
            otherwise by law.
          </p>
        </LegalSection>

        <LegalSection id="ip" title="11. Intellectual property">
          <p>
            We and our licensors own the service, software, and branding. These Terms do not grant you
            rights to our trademarks except as needed to use the service.
          </p>
        </LegalSection>

        <LegalSection id="disclaimers" title="12. Disclaimers">
          <p>
            THE SERVICE IS PROVIDED &quot;AS IS&quot; WITHOUT WARRANTIES OF ANY KIND, WHETHER EXPRESS
            OR IMPLIED, INCLUDING MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND
            NON-INFRINGEMENT.
          </p>
        </LegalSection>

        <LegalSection id="liability" title="13. Limitation of liability">
          <p>
            TO THE MAXIMUM EXTENT PERMITTED BY LAW, {LEGAL_ENTITY.toUpperCase()} AND ITS SUPPLIERS
            WILL NOT BE LIABLE FOR INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES,
            OR ANY LOSS OF PROFITS, DATA, OR GOODWILL. OUR AGGREGATE LIABILITY FOR CLAIMS RELATING
            TO THE SERVICE IS LIMITED TO THE GREATER OF USD $100 OR THE AMOUNTS YOU PAID US IN THE
            TWELVE MONTHS BEFORE THE CLAIM.
          </p>
        </LegalSection>

        <LegalSection id="termination" title="14. Suspension & termination">
          <p>
            We may suspend or terminate access for violations of these Terms or to protect the
            service. You may stop using the service at any time. Provisions that by nature should
            survive will survive termination.
          </p>
        </LegalSection>

        <LegalSection id="changes" title="15. Changes">
          <p>
            We may update these Terms. Continued use after the effective date constitutes acceptance
            of the revised Terms.
          </p>
        </LegalSection>

        <LegalSection id="contact" title="16. Contact">
          <p>
            Legal inquiries:{' '}
            <a href={`mailto:${PRIVACY_EMAIL}`} className="text-white hover:underline">
              {PRIVACY_EMAIL}
            </a>
            . Support:{' '}
            <a href={`mailto:${SUPPORT_EMAIL}`} className="text-white hover:underline">
              {SUPPORT_EMAIL}
            </a>
            .
          </p>
        </LegalSection>
      </LegalDoc>
    </LegalChrome>
  );
}
