import Link from "next/link";
import { SlideDeck } from "./SlideDeck";

export function ScriptView() {
  const slides = [
    <>
      <div className="cue-step-label">STEP 1 · THE SETUP</div>
      <div className="cue-direction">Laptop open on leaderboard.</div>
      <div className="cue-say">
        &ldquo;Monday, Danny mocked up a dashboard. This is a live product on the internet. And that (point at
        Tracy&apos;s LIVE card) is Tracy&apos;s actual ring data from last night. Tracy?&rdquo;
      </div>
    </>,

    <>
      <div className="cue-step-label">STEP 2 · THE PROOF</div>
      <div className="cue-beat">
        <div className="cue-direction">
          Before she signs in — show{" "}
          <Link href="/privacy-slides" style={{ color: "var(--cc-gold)" }}>
            /privacy-slides
          </Link>{" "}
          (4 slides, ~30 seconds). Answers her questions before she has to ask them.
        </div>
      </div>
      <div className="cue-beat">
        <div className="cue-direction">Hand Nadia the laptop. She clicks Sign in with Oura.</div>
        <div className="cue-say">
          &ldquo;She&apos;s typing her password into Oura&apos;s site, not my app — we never see it.&rdquo;
        </div>
      </div>
      <div className="cue-beat">
        <div className="cue-direction">Consent screen.</div>
        <div className="cue-say">&ldquo;Nothing is shared unless SHE turns it on. Default is private. Nadia, your choice.&rdquo;</div>
      </div>
      <div className="cue-beat">
        <div className="cue-direction">
          She flips toggles. Everyone watches the leaderboard re-rank itself — nobody touches it.
        </div>
      </div>
      <div className="cue-beat">
        <div className="cue-say">&ldquo;Nadia, open your Oura app — do the numbers match?&rdquo;</div>
      </div>
    </>,

    <>
      <div className="cue-step-label">STEP 3 · THE RECEIPTS</div>
      <div className="cue-direction">Open /story, scroll the slides, pause on the quote.</div>
    </>,

    <>
      <div className="cue-step-label">STEP 4 · THE CLOSE</div>
      <div className="cue-say">
        &ldquo;Real data, real privacy controls, live pipeline, two days, zero dollars. Phase 2: the whole team
        wears rings and we run the real productivity experiment. Danny — I believe you owe me and Kat some
        jewelry.&rdquo;
      </div>
    </>,

    <>
      <div className="cue-step-label">FALLBACK</div>
      <div className="cue-fallback">
        <div className="cue-say" style={{ fontSize: 20 }}>
          If tech fails: screenshots on phone, /story carries the argument, Tracy&apos;s data is already in
          production.
        </div>
      </div>
    </>,
  ];

  return <SlideDeck slides={slides} />;
}
