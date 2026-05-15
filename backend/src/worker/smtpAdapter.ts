export interface SendArgs {
  from: string;
  to: string;
  subject: string;
  body: string;
}

export async function send(args: SendArgs): Promise<void> {
  const latency = 100 + Math.floor(Math.random() * 200);
  await new Promise((r) => setTimeout(r, latency));
  if (Math.random() < 0.05) {
    throw new Error('SMTP timeout');
  }
  // Pretend we sent it.
  void args;
}
