import Image from "next/image"
import { Github, Linkedin, Mail, Download, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import AnimatedBackground from "@/components/AnimatedBackground"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import Link from "next/link"

function SkillCard({ title, skills }: { title: string; skills: string[] }) {
  return (
    <Card className="bg-black/50 backdrop-blur-sm border-gray-800 transform transition-all duration-300 hover:scale-105 hover:border-blue-500">
      <CardHeader>
        <CardTitle className="text-white">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {skills.map((skill) => (
            <Badge key={skill} variant="secondary" className="bg-blue-500/20 text-blue-300">
              {skill}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function ProjectCard({
  title,
  description,
  tags,
  link = "#",
}: {
  title: string
  description: string
  tags: string[]
  link?: string
}) {
  return (
    <Card className="bg-black/50 backdrop-blur-sm border-gray-800 transform transition-all duration-300 hover:scale-105 hover:border-blue-500 group">
      <CardHeader>
        <CardTitle className="text-white flex items-center justify-between">
          {title}
          <ExternalLink className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-gray-300">{description}</CardDescription>
        <div className="mt-4 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Badge key={tag} variant="outline" className="border-blue-500 text-blue-300">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function ExperienceCard({
  role,
  company,
  period,
  description,
}: {
  role: string
  company: string
  period: string
  description: string
}) {
  return (
    <Card className="bg-black/50 backdrop-blur-sm border-gray-800 transform transition-all duration-300 hover:scale-105 hover:border-blue-500">
      <CardHeader>
        <CardTitle className="text-white">{role}</CardTitle>
        <CardDescription className="text-blue-300">
          {company} • {period}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-gray-300">{description}</p>
      </CardContent>
    </Card>
  )
}

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-900 text-white relative overflow-hidden">
      <AnimatedBackground />
      <div className="relative z-10">
        <header className="container mx-auto px-4 py-16 text-center">
          <div className="relative w-48 h-48 mx-auto mb-8">
            <div className="absolute inset-0 rounded-full bg-blue-500/20"></div>
            <div className="relative w-full h-full animate-float">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/439be2e9-aab4-4f65-825c-9f67563502dd.jpg-5DLNgyW2GlbpeYSKoezCTV9CaqoFqh.jpeg"
                alt="Ricardo Sanchez"
                width={192}
                height={192}
                className="rounded-full border-4 border-blue-500/30 transition-all duration-300 object-cover"
                priority
              />
            </div>
          </div>
          <h1 className="text-5xl font-bold mb-2">Ricardo Sanchez</h1>
          <p className="text-2xl text-blue-300 mb-6">Junior Software Engineer</p>
          <div className="flex justify-center space-x-4">
            <Link href="https://github.com/RickMelendez" target="_blank" rel="noopener noreferrer">
              <Button
                variant="outline"
                size="icon"
                className="bg-blue-500/20 border-blue-500 text-blue-300 hover:bg-blue-500/30 w-12 h-12"
              >
                <Github className="h-6 w-6" />
              </Button>
            </Link>
            <Link href="https://www.linkedin.com/in/ricardosanchez01" target="_blank" rel="noopener noreferrer">
              <Button
                variant="outline"
                size="icon"
                className="bg-blue-500/20 border-blue-500 text-blue-300 hover:bg-blue-500/30 w-12 h-12"
              >
                <Linkedin className="h-6 w-6" />
              </Button>
            </Link>
            <Link href="mailto:rickmelendez001@gmail.com">
              <Button
                variant="outline"
                size="icon"
                className="bg-blue-500/20 border-blue-500 text-blue-300 hover:bg-blue-500/30 w-12 h-12"
              >
                <Mail className="h-6 w-6" />
              </Button>
            </Link>
            <Link
              href="https://docs.google.com/document/d/16jlpoLih6_4ZeKqJ8VeO3Ps_WZWmgsTeVKIGgw_0RHQ/edit?usp=sharing"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                variant="outline"
                className="bg-blue-500/20 border-blue-500 text-blue-300 hover:bg-blue-500/30 flex items-center space-x-2"
              >
                <Download className="h-4 w-4" />
                <span>Resume</span>
              </Button>
            </Link>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8 space-y-24">
          <section>
            <h2 className="text-3xl font-semibold mb-8 text-center text-blue-300">About Me</h2>
            <p className="text-gray-300 max-w-3xl mx-auto text-center text-lg">
              Motivated and passionate about starting my journey as a software engineer. With foundational skills
              acquired from Holberton Coding School, I am eager to apply my knowledge of full-stack development,
              collaborate on innovative projects, and grow in a dynamic, learning-oriented environment.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-semibold mb-8 text-center text-blue-300">Experience</h2>
            <div className="grid gap-6 max-w-4xl mx-auto">
              <ExperienceCard
                role="Software Engineering Student"
                company="Holberton School"
                period="February 2024 - Present"
                description="Developed multiple web applications using Python, Flask, and JavaScript. Designed and implemented APIs following RESTful principles for backend integration. Managed Docker containers for application deployment and development environments."
              />
              {/* Add more experience cards as needed */}
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-semibold mb-8 text-center text-blue-300">Skills</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              <SkillCard title="Languages" skills={["C", "Python", "JavaScript", "TypeScript", "SQL", "HTML", "CSS"]} />
              <SkillCard
                title="Frameworks & Tools"
                skills={[
                  "Flask",
                  "Docker",
                  "Express",
                  "Node.js",
                  "React",
                  "TailwindCSS",
                  "ShadCN",
                  "Zustand",
                  "Axios",
                  "Recharts",
                ]}
              />
              <SkillCard
                title="Technologies"
                skills={["APIs", "RESTful services", "MySQL", "Git", "Linux", "Cloudflare", "SQLite"]}
              />
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-semibold mb-8 text-center text-blue-300">Projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              <ProjectCard
                title="Simple Shell"
                description="A minimalist Unix shell showcasing low-level system operations and command-line interface design."
                tags={["C", "Unix", "System Programming"]}
              />
              <ProjectCard
                title="Airbnb Clone"
                description="A scalable platform mimicking Airbnb's functionalities, demonstrating full-stack development skills."
                tags={["React", "Node.js", "MongoDB"]}
              />
              <ProjectCard
                title="Website Monitoring Alert System"
                description="A system that allows users to track the uptime and response time of websites, with real-time notifications for downtime."
                tags={["React", "Flask", "SQLite", "TailwindCSS"]}
              />
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-semibold mb-8 text-center text-blue-300">Contact Me</h2>
            <div className="max-w-xl mx-auto space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  placeholder="Name"
                  className="bg-black/50 border-gray-800 text-white placeholder:text-gray-400"
                />
                <Input
                  placeholder="Email"
                  type="email"
                  className="bg-black/50 border-gray-800 text-white placeholder:text-gray-400"
                />
              </div>
              <Input
                placeholder="Subject"
                className="bg-black/50 border-gray-800 text-white placeholder:text-gray-400"
              />
              <Textarea
                placeholder="Message"
                className="bg-black/50 border-gray-800 text-white placeholder:text-gray-400 min-h-[150px]"
              />
              <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white">Send Message</Button>
            </div>
          </section>
        </main>

        <footer className="container mx-auto px-4 py-8">
          <p className="text-center text-gray-400">
            © {new Date().getFullYear()} Ricardo Sanchez. All rights reserved.
          </p>
        </footer>
      </div>
    </div>
  )
}

