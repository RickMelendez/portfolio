import { NextResponse } from "next/server"
import nodemailer from "nodemailer"

export async function POST(req: Request) {
  try {
    const { name, email, subject, message } = await req.json()

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Configurar transporte de email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD
      }
    })

    const html = `
      <div>
        <h2>Nuevo mensaje de portfolio</h2>
        <p><strong>Nombre:</strong> ${String(name)}</p>
        <p><strong>Email:</strong> ${String(email)}</p>
        <p><strong>Asunto:</strong> ${String(subject)}</p>
        <p><strong>Mensaje:</strong></p>
        <p style="white-space: pre-wrap;">${String(message)}</p>
      </div>
    `

    await transporter.sendMail({
      from: `"Portfolio Contact" <${process.env.GMAIL_USER}>`,
      to: process.env.GMAIL_USER,
      subject: `Portfolio: ${String(subject)}`,
      html,
      replyTo: String(email)
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Error sending email:', err)
    return NextResponse.json({ error: "Error sending message" }, { status: 500 })
  }
}

