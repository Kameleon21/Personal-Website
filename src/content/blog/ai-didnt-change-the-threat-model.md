---
title: "AI didn't change the threat model. It changed how fast you reach it"
description: "AI made writing code fast, but trusting it didn't get any faster. Notes on SBOMs, Sigstore, SLSA, and what a solo developer can actually do about supply chain security."
pubDate: 2026-07-18
author: "Kamil Rogozinski"
tags: ["security", "supply-chain", "openssf", "ai"]
---

# The bottleneck moved

For most of my career, the slow part of building software was writing it. You'd sit with a problem, work out the shape of it, and type until it existed. Everything downstream — review, testing, release — was fast relative to that.

That's not true anymore, and I don't think we've caught up to what it means.

I've been reading about secure software development lifecycle practices for a few months now. Not because anyone asked me to, but because I kept running into the same uncomfortable thought: I can now produce more code in an afternoon than I can meaningfully review in a week. The generating got faster. The trusting didn't.

## What I actually found

I started with the OpenSSF — the Open Source Security Foundation — mostly because their name kept appearing under things I was already using. What I found was less a set of tools and more a vocabulary I'd been missing.

**SBOM** — Software Bill of Materials. An ingredients list for a build. Every library, every version, every transitive dependency you didn't know you had. It's boring in the way an inventory is boring, right up until you need to answer "are we affected?" at 11pm.

**Sigstore and cosign** — signing artifacts so you can verify they haven't been altered between build and deploy, without the traditional pain of managing long-lived signing keys. The keyless flow was the part that surprised me; I'd assumed artifact signing meant key ceremonies and a spreadsheet somewhere.

**SLSA** — pronounced "salsa." A framework of levels describing how trustworthy your build pipeline is. Less about the code, more about whether the thing you shipped is provably the thing you built.

**Scorecard** — automated checks on a repository's security posture. Run it against a dependency and you get a read on whether it's maintained, reviewed, signed, and so on.

The distinction that took me longest to internalise, and the one I think most people conflate:

- An SBOM tells you **what's in it**.
- A signature tells you **it hasn't changed since it was built**.
- Provenance tells you **where it actually came from**.

Those are three different questions. Answering one doesn't answer the others. I'd been vaguely assuming they were the same problem with different marketing.

## Why now, specifically

None of this is new. SBOMs predate the current AI wave by years. Log4Shell was 2021, and the reason it was so painful for so many organisations wasn't the vulnerability itself — it was that nobody could answer where Log4j was running. The xz-utils backdoor in 2024 was a multi-year social engineering campaign against a maintainer, caught almost by accident.

So the threat model hasn't changed. What's changed is the volume.

Every dependency you add is a trust decision. Historically the number of those decisions was bounded by how much code you could write, which was bounded by how fast you could type and think. That constraint is gone. When you can scaffold a service in twenty minutes, you're making dozens of trust decisions per hour, and most of them are invisible — a package pulled in transitively, a version bumped, a suggestion accepted because it looked right.

Security tooling, and code review as a practice, quietly assumes a human read the diff. That assumption is now doing a lot of unpaid work.

## The honest part

I want to be careful here, because it's easy to write this kind of piece and end up sounding like I've solved something.

An SBOM you generate and never look at is theatre. A signature nobody verifies is a checkbox. Most of the value in this tooling is unlocked by the boring organisational thing — someone actually being responsible for looking at the output — and that part doesn't ship in a release pipeline.

I'd also say the gap between what a large regulated organisation can do here and what a solo developer or small team can do is real. Some of these practices assume a security function, a budget, and a mandate. If you don't have those, most of the framework documentation is going to read as aspirational.

But some of it is genuinely a few lines of config.

## What I'd actually do

If you take one thing from this, take the small version:

1. **Turn on Dependabot** (or equivalent). Free, immediate, and it makes your dependency surface visible.
2. **Run Scorecard** against your three most important dependencies. Not to make a decision — just to see what the output looks like.
3. **Generate an SBOM in one pipeline.** If you're using GoReleaser, it's a config block. Same for most modern release tooling. Then actually open the file once.
4. **Sign one release.** cosign, keyless. Mostly to prove to yourself it isn't hard.

None of that makes you secure. It makes you *legible to yourself*, which is the prerequisite.

## The thing I keep coming back to

The industry spent a decade getting good at shipping fast, and then AI made shipping faster by another order of magnitude. That's genuinely great. I use these tools daily and I'm not going back.

But velocity was never the only thing that mattered — it was just the thing we were optimising because it was the constraint. Now it isn't the constraint. What's left is the stuff that was always there and never got faster: knowing what you're running, knowing where it came from, and knowing it hasn't been tampered with.

AI didn't change the threat model. It changed how fast you reach it.

---

*If you're starting from zero on this, the OpenSSF's own documentation is the least painful entry point I found. Start with the Concise Guide for Developing More Secure Software, then work outward.*
