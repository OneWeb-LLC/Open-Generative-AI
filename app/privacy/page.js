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
  title: pageTitle('Privacy Policy'),
  description: `How ${SITE_NAME} collects, uses, and protects personal data.`,
};

const TOC = [
  { id: 'introduction', label: 'Introduction' },
  { id: 'who-we-are', label: 'Who we are' },
  { id: 'scope', label: 'Scope' },
  { id: 'information-we-collect', label: 'Information we collect' },
  { id: 'how-we-use', label: 'How we use information' },
  { id: 'byok', label: 'Bring-your-own-key (MuAPI)' },
  { id: 'ai-processing', label: 'AI processing' },
  { id: 'sms-a2p', label: 'SMS & A2P messaging' },
  { id: 'cookies', label: 'Cookies & storage' },
  { id: 'sharing', label: 'When we share information' },
  { id: 'subprocessors', label: 'Subprocessors' },
  { id: 'retention', label: 'Retention' },
  { id: 'security', label: 'Security (SOC 2 aligned)' },
  { id: 'your-rights', label: 'Your choices & rights' },
  { id: 'children', label: 'Children' },
  { id: 'changes', label: 'Changes' },
  { id: 'contact', label: 'Contact' },
];

export default function PrivacyPage() {
  return (
    <LegalChrome>
      <LegalDoc
        eyebrow="Legal"
        title="Privacy Policy"
        description={`This Privacy Policy describes how ${SITE_NAME} collects, uses, stores, shares, and protects personal and workspace data when you use our AI creative studio as an OWeb satellite application.`}
        lastUpdated={LEGAL_LAST_UPDATED}
        toc={TOC}
        related={[{ label: 'Terms of Service', href: '/terms' }]}
      >
        <LegalSection id="introduction" title="1. Introduction">
          <p>
            {SITE_NAME} provides AI image, video, audio, and related creative tools. We use shared
            OWeb OneID authentication and workspace isolation so you can sign in once across the
            OWeb ecosystem while keeping workspace data separated.
          </p>
          <p>
            We designed this policy to meet common SOC 2 transparency expectations and U.S.
            application-to-person (A2P) messaging disclosure requirements where communications
            features are enabled through the OWeb platform. If you do not agree with this policy,
            please do not use {SITE_NAME}.
          </p>
        </LegalSection>

        <LegalSection id="who-we-are" title="2. Who we are">
          <p>
            {SITE_NAME} is operated by {LEGAL_ENTITY} (&quot;we,&quot; &quot;us,&quot; or
            &quot;our&quot;) as an OWeb ecosystem satellite application (app id{' '}
            <span className="font-medium text-[#202124]">open-generative-ai</span>).
          </p>
          <p>
            Privacy requests:{' '}
            <a href={`mailto:${PRIVACY_EMAIL}`} className="text-[#1a73e8] hover:underline">
              {PRIVACY_EMAIL}
            </a>
            . Support:{' '}
            <a href={`mailto:${SUPPORT_EMAIL}`} className="text-[#1a73e8] hover:underline">
              {SUPPORT_EMAIL}
            </a>
            .
          </p>
        </LegalSection>

        <LegalSection id="scope" title="3. Scope">
          <p>This policy applies when you:</p>
          <LegalList
            items={[
              <>Visit or sign in to {SITE_NAME} (web or desktop builds distributed by us)</>,
              <>Use studio features, agents, workflows, or connected OWeb apps from this product</>,
              <>
                Authenticate through OWeb OneID (auth.oweb.one) or SSO launch from the OWeb App Store
              </>,
              <>
                Receive operational or transactional SMS from {LEGAL_ENTITY} or a workspace you
                belong to, when messaging is enabled
              </>,
            ]}
          />
          <p>
            Third-party AI providers (for example MuAPI and underlying model hosts) process
            generation requests according to their own terms when you invoke those services.
          </p>
        </LegalSection>

        <LegalSection id="information-we-collect" title="4. Information we collect">
          <p>Depending on how you use {SITE_NAME}, we may collect:</p>
          <LegalList
            items={[
              <>
                <span className="font-medium text-[#202124]">Account & profile</span> — name, email, user id, and
                authentication session data from OWeb OneID / Supabase Auth
              </>,
              <>
                <span className="font-medium text-[#202124]">Workspace data</span> — workspace membership, role,
                preferences, and tenant-scoped settings stored in our shared One OS database with
                app-level isolation
              </>,
              <>
                <span className="font-medium text-[#202124]">Creative inputs & outputs</span> — prompts, uploads,
                generated media metadata, and workflow state needed to provide the service
              </>,
              <>
                <span className="font-medium text-[#202124]">API configuration</span> — selected API provider and
                workspace-scoped preference flags (see BYOK section for key storage)
              </>,
              <>
                <span className="font-medium text-[#202124]">Device & logs</span> — IP address, browser type,
                timestamps, error diagnostics, and security logs
              </>,
              <>
                <span className="font-medium text-[#202124]">Messaging data (if enabled)</span> — mobile numbers,
                opt-in/opt-out records, message content and delivery metadata for A2P programs you
                or your organization configure through OWeb communications
              </>,
            ]}
          />
        </LegalSection>

        <LegalSection id="how-we-use" title="5. How we use information">
          <LegalList
            items={[
              <>Provide, operate, secure, and improve the studio and related features</>,
              <>Authenticate users and enforce workspace isolation</>,
              <>Process generations and workflows you initiate</>,
              <>Meter usage, prevent abuse, and investigate security incidents</>,
              <>Send transactional notices (security, billing-related, or product changes)</>,
              <>Comply with law and enforce our Terms of Service</>,
            ]}
          />
          <LegalCallout>
            We do not sell personal information. We do not use SMS opt-in data or workspace content
            for third-party advertising or data brokerage.
          </LegalCallout>
        </LegalSection>

        <LegalSection id="byok" title="6. Bring-your-own-key (MuAPI)">
          <p>
            {SITE_NAME} supports bring-your-own-key access to MuAPI and related providers. Unless you
            use a team-managed proxy, your API key is stored in your browser&apos;s local storage
            under workspace-scoped keys and is sent directly to the provider you select to fulfill
            your generations. We do not persist your MuAPI secret on our application servers as part
            of the default BYOK flow.
          </p>
          <p>
            You are responsible for safeguarding keys on devices you control and for rotating keys if
            a device is compromised.
          </p>
        </LegalSection>

        <LegalSection id="ai-processing" title="7. AI processing">
          <p>
            When you run a model, your prompts and media may be transmitted to MuAPI, Vercel AI
            Gateway, Comfy/RunPod, or other providers you enable solely to produce the output you
            requested. Do not submit personal data you are not authorized to process with AI tools.
          </p>
        </LegalSection>

        <LegalSection id="sms-a2p" title="8. SMS messaging & A2P">
          <p>
            If you or your organization use OWeb-enabled SMS or voice features that contact mobile
            subscribers, the following disclosures apply for U.S. A2P 10DLC and carrier compliance:
          </p>
          <LegalList
            items={[
              <>
                Recipients must provide prior express consent for the specific program and sender
                before marketing or recurring automated texts
              </>,
              <>
                Disclosures should state that message frequency varies and that message and data
                rates may apply
              </>,
              <>
                Recipients may opt out at any time by replying STOP; reply HELP for assistance or
                contact {SUPPORT_EMAIL}
              </>,
              <>
                We maintain suppression records and do not share mobile opt-in data with third
                parties for their own marketing
              </>,
            ]}
          />
          <LegalCallout>
            No mobile information will be shared with third parties or affiliates for marketing or
            promotional purposes. Text messaging originator opt-in data and consent will not be
            shared with third parties for their own marketing.
          </LegalCallout>
          <p>
            Carriers are not liable for delayed or undelivered messages. See also the SMS section in
            our{' '}
            <Link href="/terms" className="text-[#1a73e8] hover:underline">
              Terms of Service
            </Link>
            .
          </p>
        </LegalSection>

        <LegalSection id="cookies" title="9. Cookies & storage">
          <p>
            We use cookies and browser storage for authentication sessions, locale preferences, and
            BYOK credentials you choose to save locally. You can clear site data in your browser;
            doing so may sign you out and remove saved API keys.
          </p>
        </LegalSection>

        <LegalSection id="sharing" title="10. When we share information">
          <LegalList
            items={[
              <>With workspace members according to role and sharing settings</>,
              <>
                With infrastructure and AI subprocessors that process data on our behalf under
                contractual safeguards
              </>,
              <>When required by law or to protect security and rights</>,
              <>With your direction when you connect integrations or export content</>,
            ]}
          />
        </LegalSection>

        <LegalSection id="subprocessors" title="11. Subprocessors">
          <p>Primary categories of subprocessors include:</p>
          <LegalList
            items={[
              <>Supabase — authentication and workspace-scoped data storage (One OS)</>,
              <>Vercel — application hosting and serverless functions</>,
              <>MuAPI and model hosts — AI inference you invoke with your key or team proxy</>,
              <>Telephony providers (for example Twilio) — when OWeb communications are enabled</>,
            ]}
          />
          <p>
            Enterprise customers may request an updated subprocessor list at {PRIVACY_EMAIL}.
          </p>
        </LegalSection>

        <LegalSection id="retention" title="12. Retention">
          <p>
            We retain account and workspace data while your account is active and as needed for
            security, backups, and legal obligations. Messaging consent and opt-out records are
            retained as required for compliance. You may request deletion by contacting{' '}
            {PRIVACY_EMAIL}.
          </p>
        </LegalSection>

        <LegalSection id="security" title="13. Security (SOC 2 aligned)">
          <p>
            We maintain administrative, technical, and organizational controls designed around
            common SOC 2 trust principles, including:
          </p>
          <LegalList
            items={[
              <>Encryption in transit (TLS) and encryption at rest via our infrastructure providers</>,
              <>Logical access controls, least-privilege administration, and audit logging</>,
              <>Workspace tenant isolation for satellite application data</>,
              <>Vulnerability management and incident response procedures</>,
              <>Vendor risk review for subprocessors handling personal data</>,
            ]}
          />
          <p>No security program can guarantee absolute security; please use strong passwords and protect your devices.</p>
        </LegalSection>

        <LegalSection id="your-rights" title="14. Your choices & rights">
          <p>
            Depending on your location, you may request access, correction, deletion, or portability
            of personal data we control. Contact {PRIVACY_EMAIL}. If you are an end user contacted
            by a workspace customer, contact that organization first.
          </p>
        </LegalSection>

        <LegalSection id="children" title="15. Children">
          <p>
            {SITE_NAME} is not directed to children under 13 (or 16 where applicable). We do not
            knowingly collect children&apos;s personal information.
          </p>
        </LegalSection>

        <LegalSection id="changes" title="16. Changes">
          <p>
            We may update this policy. Material changes will be reflected in the &quot;Last
            updated&quot; date and, when appropriate, additional in-product notice.
          </p>
        </LegalSection>

        <LegalSection id="contact" title="17. Contact">
          <p>
            Questions:{' '}
            <a href={`mailto:${PRIVACY_EMAIL}`} className="text-[#1a73e8] hover:underline">
              {PRIVACY_EMAIL}
            </a>
            . Related:{' '}
            <Link href="/terms" className="text-[#1a73e8] hover:underline">
              Terms of Service
            </Link>
            .
          </p>
        </LegalSection>
      </LegalDoc>
    </LegalChrome>
  );
}
