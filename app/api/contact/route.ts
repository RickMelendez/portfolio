import { NextResponse } from "next/server"
import { Resend } from "resend"

export async function POST(req: Request) {
  try {
    const { name, email, subject, message } = await req.json()

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const resend = new Resend(process.env.RESEND_API_KEY)

    const html = `
      <div>
        <p><strong>Name:</strong> ${String(name)}</p>
        <p><strong>Email:</strong> ${String(email)}</p>
        <p><strong>Subject:</strong> ${String(subject)}</p>
        <p><strong>Message:</strong></p>
        <p style="white-space: pre-wrap;">${String(message)}</p>
      </div>
    `

    const data = await resend.emails.send({
      from: "Portfolio <onboarding@resend.dev>",
      to: ["rickmelendez001@gmail.com"],
      subject: subject as string,
      html,
      reply_to: String(email),
    })

    if ((data as any).error) {
      return NextResponse.json({ error: (data as any).error }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 })
  }
}

