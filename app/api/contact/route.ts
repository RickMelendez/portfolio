import { NextResponse } from "next/server"
import nodemailer from "nodemailer"
import { Resend } from "resend"


const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

export async function POST(req: Request) {
  try {
    const { name, email, subject, message } = await req.json()

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    const html = `
      <div style="font-family: Arial, sans-serif; padding:20px;">
        <h2>Nuevo mensaje de portfolio</h2>
        <p><strong>Nombre:</strong> ${String(name)}</p>
        <p><strong>Email:</strong> ${String(email)}</p>
        <p><strong>Asunto:</strong> ${String(subject)}</p>
        <p><strong>Mensaje:</strong></p>
        <div style="background:#f4f4f4;padding:15px;border-radius:8px;white-space: pre-wrap;">
          ${String(message)}
        </div>
        <hr/>
        <p style="font-size:12px;color:#777;">
          Este mensaje fue enviado desde el formulario de contacto de tu portfolio.
        </p>
      </div>
    `

    // Opción 1: Enviar usando Resend (Recomendado para producción)
    const { data: resendData, error: resendError } = resend 
      ? await resend.emails.send({
          from: "Portfolio Contact <onboarding@resend.dev>",
          to: [process.env.GMAIL_USER!],
          subject: `Portfolio: ${String(subject)}`,
          html,
          reply_to: String(email),
        })
      : { data: null, error: { message: "Resend API key missing" } }

    if (resendError) {
      console.error('Resend error:', resendError)
      
      // Opción 2: Fallback a Nodemailer (Gmail) si Resend falla
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_APP_PASSWORD
        }
      })

      await transporter.sendMail({
        from: `"Portfolio Contact" <${process.env.GMAIL_USER}>`,
        to: process.env.GMAIL_USER,
        subject: `Portfolio (Fallback): ${String(subject)}`,
        html,
        replyTo: String(email)
      })
    }

    return NextResponse.json({ ok: true, provider: resendError ? 'nodemailer' : 'resend' })
  } catch (err) {
    console.error('Error sending email:', err)
    return NextResponse.json({ error: "Error sending message" }, { status: 500 })
  }
}
