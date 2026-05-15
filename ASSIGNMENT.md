# SDE-2 Full Stack — Take-Home Assignment

## Context

You're joining a team that built an internal email sequencing tool. The previous
engineer left mid-feature. The code mostly works — you can log in, view
sequences, schedule them, and watch the worker dispatch emails — but the team
suspects there are issues, both in correctness and in the half-built features.

Your job: **stabilize what's there and finish the in-flight features.**

We expect you to use AI assistants (Claude, Copilot, Cursor, whatever you
prefer). What we care about is whether you can **critically review what AI
produces** — spot subtle bugs, reason about edge cases, and decide when the
suggested fix is wrong.

---

## Your tasks

### 1. Get it running
Follow `README.md`. Log in as alice, look at her sequences, watch the worker
process some emails. If something is broken before you've touched anything, note
it.

### 2. Find and fix bugs
Read the code. There are correctness issues, concurrency bugs, security
issues, and risky patterns scattered through the existing code. We won't tell
you how many or where — finding them is part of the assignment.

For each issue:
- Fix it minimally and correctly. "Make the symptom go away" is not a fix.
- Write down what you found in `FINDINGS.md` (format below).

### 3. Finish the **Pause / Resume sequence** feature
The UI has buttons. The pause endpoint exists but doesn't fully work. Resume
isn't implemented. Required behavior:

- **Pause:** No more emails from this sequence should go out. Anything currently
  in-flight should respect the pause as soon as possible.
- **Resume:** The remaining (unsent) emails should be re-scheduled. New send
  times must account for:
  - the step's `delay_days` measured from "now" (not from the original schedule), and
  - the mailbox's remaining daily / hourly budget (don't queue 500 sends today
    on a mailbox with `daily_limit=100`).
- Pausing a sequence that is already paused, or resuming one that is active,
  should be a no-op (not an error).

### 4. Finish the **Mailbox Quota** UI page
`frontend/src/pages/MailboxQuota.tsx` is partly scaffolded. Show, per mailbox
the current user owns:

- mailbox email
- daily sent / daily limit
- hourly sent / hourly limit
- visual indication when usage is ≥ 80% of either limit

The page must auto-refresh — pick a refresh strategy that's appropriate for
this data, and be ready to justify it.

Backend endpoint: `GET /mailboxes/:id/quota`. Read what it returns and decide
how to handle the data on the client.

### 5. Tests
Add tests for **at least**:
- the rate limiter, and
- one concurrency-sensitive code path of your choosing.

Pick any test framework (vitest, jest, node:test — your call). Document the
choice briefly in `DECISIONS.md`.

---

## Submission format

Open a branch off `main` and commit your work with meaningful messages. In the
root of the repo, add the following files:

### `FINDINGS.md`
For every issue you found, one entry:

```
### <Short title>
- **File / line:** `backend/src/foo.ts:42`
- **Severity:** Low / Medium / High / Critical
- **What's wrong:**
- **Why it's a bug (when does it manifest?):**
- **Fix:**
- **How I verified:**
```

### `DECISIONS.md`
- Trade-offs you made in pause/resume (especially around in-flight jobs).
- Trade-offs in the quota UI (refresh cadence, staleness, cache).
- What you'd change with another day.
- Anything you noticed but consciously did not fix, and why.

### `AI_USAGE.md`
We want to see how you collaborate with AI. Include:
- Which tools you used and roughly how.
- 1–2 prompts that worked well — what you asked, what you got.
- At least one time AI led you astray (wrong fix, hallucinated API,
  plausible-but-wrong suggestion) and how you caught it.

If you didn't use AI at all, say so and explain why.

---

## Evaluation criteria

We grade on:

1. **Depth of discovery.** We've planted multiple bugs of varying subtlety.
   Several are easy to spot if you read carefully; at least one is not. We're
   looking for *thorough* review, not a checklist.
2. **Quality of fixes.** Atomic, minimal, correct. A fix that introduces a new
   bug or papers over the symptom is worse than no fix.
3. **Edge-case reasoning** in pause/resume and quota — especially what happens
   under concurrency, on failure, and at limit boundaries.
4. **Tests** that exercise the failure modes you're worried about, not just
   the happy path.
5. **Critical review of AI output.** We expect you to push back on AI when
   it's wrong.

---

## Time

Plan for **1–2 focused days**. Please don't sink a week into this. If you run
out of time, stop and write down in `DECISIONS.md` what's left and why — that
is more useful to us than rushed code.

Good luck.
